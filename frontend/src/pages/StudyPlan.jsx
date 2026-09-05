import { useEffect, useState, useRef } from "react";
import { FiBook, FiPlus, FiTrash, FiMap, FiX, FiCheck, FiLoader, FiBookmark, FiCornerDownLeft } from "react-icons/fi";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from "reactflow";
import api from "../utils/api";
import { useGemini } from "../services/useGemini";
import ReactMarkdown from "react-markdown";
import "reactflow/dist/style.css";

const panel = "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20";

const StudyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [stepExplanation, setStepExplanation] = useState("");
  const [explanationError, setExplanationError] = useState(false);
  const [explainingStep, setExplainingStep] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isExplanationSaved, setIsExplanationSaved] = useState(false);
  const [mobileView, setMobileView] = useState("roadmap");
  const titleInputRef = useRef(null);
  const { generateStudySteps, explainStudyStep } = useGemini();

  const fetchPlans = async () => {
    try {
      const { data } = await api.get("/api/study-plans/");
      setPlans(data);
    } catch (error) {
      console.error("Error fetching study plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!selectedPlan?.steps) {
      setNodes([]);
      setEdges([]);
      return;
    }
    const steps = selectedPlan.steps;
    setNodes(
      steps.map((step, index) => ({
        id: String(step.id),
        position: { x: 250, y: index * 160 },
        data: { label: step.description },
        style: {
          background: step.is_completed ? "#064e3b" : "#1e293b",
          color: "#f8fafc",
          border: step.is_completed ? "1px solid #34d399" : "1px solid #475569",
          borderRadius: "12px",
          padding: "14px",
          width: 230,
          cursor: "pointer",
          fontFamily: "Poppins, sans-serif",
          fontSize: "13px",
          fontWeight: step.is_completed ? "600" : "500",
          boxShadow: step.is_completed ? "0 0 20px rgba(16, 185, 129, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.25)",
        },
      }))
    );
    setEdges(
      steps.slice(0, -1).map((step, index) => {
        const nextStep = steps[index + 1];
        return {
          id: `e${step.id}-${nextStep.id}`,
          source: String(step.id),
          target: String(nextStep.id),
          animated: true,
          style: { stroke: "#818cf8", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
        };
      })
    );
  }, [selectedPlan, setNodes, setEdges]);

  const createPlan = async (e) => {
    e.preventDefault();
    const title = newPlanTitle.trim();
    const description = newPlanDesc.trim();
    if (!title || loading) return;
    setLoading(true);
    try {
      const steps = await generateStudySteps(title, description);
      const { data } = await api.post("/api/study-plans/", {
        title,
        description,
        steps: steps.map((description, index) => ({ description, order: index + 1 })),
      });
      setPlans((prev) => [...prev, data]);
      setNewPlanTitle("");
      setNewPlanDesc("");
    } catch (error) {
      console.error("Failed to create study plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/study-plans/${id}/`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      if (selectedPlan?.id === id) setSelectedPlan(null);
    } catch (error) {
      console.error("Error deleting study plan:", error);
    }
  };

  const exploreStep = async (_, node) => {
    if (!selectedPlan || explainingStep) return;

    const step = selectedPlan.steps.find(
      (item) => String(item.id) === node.id
    );

    if (!step) return;

    setSelectedStep(step);
    setMobileView("explanation");
    setStepExplanation("");
    setExplanationError(false);
    setIsExplanationSaved(false);
    setExplainingStep(true);

    try {
      const completedSteps = selectedPlan.steps
        .filter((item) => item.is_completed)
        .map((item) => item.description);

      const explanation = await explainStudyStep(
        selectedPlan.title,
        selectedPlan.description,
        completedSteps,
        step.description
      );

      setStepExplanation(explanation);
      setExplanationError(false);
    } catch (error) {
      console.error("Unable to generate study step explanation:", error);
      setStepExplanation(
        "Unable to generate an explanation right now. Please check your Gemini API key and try again."
      );
      setExplanationError(true);
    } finally {
      setExplainingStep(false);
    }
  };

  const saveExplanation = async () => {
    if (!selectedStep || !stepExplanation || isExplanationSaved) return;

    try {
      await api.post("/api/resources/", {
        title: selectedStep.description,
        description: stepExplanation,
        resource_type: "step_note",
      });
      setIsExplanationSaved(true);
    } catch (error) {
      console.error("Unable to save step explanation:", error);
    }
  };

  const toggleStepCompletion = async () => {
    if (!selectedPlan || !selectedStep) return;

    try {
      const { data } = await api.patch(
        `/api/study-plans/${selectedPlan.id}/steps/${selectedStep.id}/`,
        {
          is_completed: !selectedStep.is_completed,
        }
      );

      setSelectedPlan(data);

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === data.id ? data : plan
        )
      );

      const updatedStep = data.steps.find(
        (step) => step.id === selectedStep.id
      );

      setSelectedStep(updatedStep || null);
    } catch (error) {
      console.error(
        "Unable to update roadmap step:",
        error
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 font-poppins">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <FiBook className="text-xl text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Study Plans</h1>
          <p className="text-sm text-slate-400 mt-1">AI-generated learning pathways you can complete step by step.</p>
        </div>
      </div>

      <section className={panel}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <FiPlus className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Create New Study Plan</h2>
            <p className="text-xs text-slate-400 mt-0.5">Describe what you want to learn and let AI build the roadmap.</p>
          </div>
        </div>
        <form onSubmit={createPlan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Plan title"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
            <textarea
              placeholder="What do you want to learn?"
              value={newPlanDesc}
              onChange={(e) => setNewPlanDesc(e.target.value)}
              className="w-full h-[46px] resize-none bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !newPlanTitle.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus size={17} />
            {loading ? "Generating Roadmap..." : "Create Plan"}
          </button>
        </form>
      </section>

      {plans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Roadmaps</h2>
              <p className="text-xs text-slate-400 mt-1">Select a plan to open its interactive roadmap.</p>
            </div>
            <span className="text-xs text-slate-500">{plans.length} {plans.length === 1 ? "plan" : "plans"}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-2xl border p-6 cursor-pointer relative group flex flex-col justify-between transition-all duration-200 ${selectedPlan?.id === plan.id
                  ? "border-indigo-500/75 bg-indigo-500/[0.06] shadow-lg shadow-indigo-950/20"
                  : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/70"
                  }`}
              >
                <button
                  onClick={(e) => deletePlan(plan.id, e)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10 cursor-pointer"
                  title="Delete plan"
                >
                  <FiTrash size={16} />
                </button>
                <div>
                  <div className="pr-8">
                    <h3 className="text-lg font-semibold text-white leading-snug">{plan.title}</h3>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">{plan.description || "No description provided."}</p>
                  </div>
                  {plan.is_completed && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 mt-4">
                      <FiCheck size={12} /> Completed
                    </span>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{new Date(plan.created_at).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 border border-slate-800 px-2.5 py-1.5 text-xs font-medium text-indigo-300">
                    <FiMap size={13} /> {plan.steps?.length || 0} Steps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {plans.length === 0 && (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-4">
            <FiBook className="text-xl text-slate-400" />
          </div>
          <p className="text-white font-semibold">No study plans yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">Create your first AI-generated roadmap above.</p>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-5xl h-[92vh] sm:h-[82vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <FiMap className="text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white truncate">{selectedPlan.title}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-10">Select a step to explore it with AI.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setSelectedStep(null);
                  setStepExplanation("");
                  setIsExplanationSaved(false);
                  setMobileView("roadmap");
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer flex-shrink-0"
                title="Close roadmap"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">

              {/* ReactFlow Roadmap */}
              <div className={`${mobileView === "roadmap" ? "flex" : "hidden"} lg:flex flex-1 bg-slate-950 relative min-h-0`}>
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={exploreStep} fitView>
                  <Background color="#1e293b" gap={32} size={1} />
                  <Controls className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-200 fill-slate-200 shadow-lg m-3" />
                  <MiniMap
                    className="hidden lg:block"
                    style={{ background: "#111827", border: "1px solid #334155", borderRadius: "10px" }}
                    nodeColor={(node) => (node.style?.background === "#064e3b" ? "#34d399" : "#6366f1")}
                    maskColor="rgba(15, 23, 42, 0.72)"
                  />
                </ReactFlow>
              </div>

              {/* Explanation Panel */}
              <aside className={`${mobileView === "explanation" ? "flex" : "hidden"} lg:flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex-col min-h-0`}>

                {!selectedStep ? (
                  <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div>
                      <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                        <FiBook className="text-xl text-indigo-400" />
                      </div>

                      <h3 className="text-sm font-semibold text-white">
                        Explore a study step
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Select a step from the roadmap to get an AI-powered explanation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-4 border-b border-slate-800">
                      <div className="flex items-start gap-3">

                        {/* Mobile Return */}
                        <button
                          onClick={() => {
                            setSelectedStep(null);
                            setStepExplanation("");
                            setIsExplanationSaved(false);
                            setMobileView("roadmap");
                          }}
                          className="lg:hidden p-1.5 bg-gradient-to-br from-slate-700/80 to-transparent rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
                          title="Return to roadmap"
                          aria-label="Return to roadmap"
                        >
                          <FiCornerDownLeft size={18} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-wider text-indigo-400 font-semibold">
                            Current Step
                          </p>

                          <h3 className="text-base font-semibold text-white mt-1 leading-snug truncate" title={selectedStep.description}>
                            {selectedStep.description}
                          </h3>
                        </div>

                        {/* Desktop Close Step */}
                        <button
                          onClick={() => {
                            setSelectedStep(null);
                            setStepExplanation("");
                            setIsExplanationSaved(false);
                          }}
                          className="hidden lg:block p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
                          title="Close step"
                        >
                          <FiX size={16} />
                        </button>

                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                      {explainingStep ? (
                        <div className="flex items-center justify-center min-h-[180px]">
                          <div className="text-center">
                            <FiLoader className="animate-spin text-2xl text-indigo-400 mx-auto" />

                            <p className="text-sm text-slate-300 mt-4">
                              Preparing your explanation...
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Gemini is connecting this step to your progress.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none theme-scroll text-slate-300 leading-relaxed">
                          {stepExplanation ? <ReactMarkdown>{stepExplanation}</ReactMarkdown> : <p className="text-sm text-slate-500">No explanation available.</p>}
                        </div>
                      )}
                    </div>

                    <div className="p-5 border-t border-slate-800">
                      {stepExplanation && !explainingStep && (
                        <button
                          onClick={saveExplanation}
                          disabled={explainingStep || !stepExplanation || isExplanationSaved || explanationError}
                          className="w-full inline-flex mb-3 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FiBookmark size={16} />
                          {isExplanationSaved ? "Saved to Resources" : "Save to Resources"}
                        </button>
                      )}

                      <button
                        onClick={toggleStepCompletion}
                        disabled={explainingStep}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${selectedStep.is_completed ? "bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 hover:bg-rose-500/10 hover:border-rose-400/30 hover:text-rose-300" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"}`}
                      >
                        <FiCheck size={16} />
                        {selectedStep.is_completed ? "Mark as Incomplete" : "Mark as Completed"}
                      </button>
                    </div>
                  </>
                )}
              </aside>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;