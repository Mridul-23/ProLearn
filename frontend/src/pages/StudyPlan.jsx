import { useEffect, useState } from "react";
import {
  FiBook,
  FiPlus,
  FiTrash,
  FiMap,
  FiX,
  FiCheck,
} from "react-icons/fi";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";

import api from "../utils/api";
import { useGemini } from "../services/useGemini";

import "reactflow/dist/style.css";

const panel =
  "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/20";

const StudyPlan = () => {
  const [plans, setPlans] = useState([]);
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { generateStudySteps } = useGemini();

  // --------------------------------------------------
  // Plans
  // --------------------------------------------------

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
  }, []);

  // --------------------------------------------------
  // Build roadmap from backend steps
  // --------------------------------------------------

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

        position: {
          x: 250,
          y: index * 160,
        },

        data: {
          label: step.description,
        },

        style: {
          background: step.is_completed
            ? "#064e3b"
            : "#1e293b",

          color: "#f8fafc",

          border: step.is_completed
            ? "1px solid #34d399"
            : "1px solid #475569",

          borderRadius: "12px",
          padding: "14px",
          width: 230,

          fontFamily: "Poppins, sans-serif",
          fontSize: "13px",
          fontWeight: step.is_completed ? "600" : "500",

          boxShadow: step.is_completed
            ? "0 0 20px rgba(16, 185, 129, 0.15)"
            : "0 4px 12px rgba(0, 0, 0, 0.25)",
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

          style: {
            stroke: "#818cf8",
            strokeWidth: 2,
          },

          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#818cf8",
          },
        };
      })
    );
  }, [selectedPlan, setNodes, setEdges]);

  // --------------------------------------------------
  // Create plan
  // --------------------------------------------------

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

        steps: steps.map((description, index) => ({
          description,
          order: index + 1,
        })),
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

  // --------------------------------------------------
  // Delete plan
  // --------------------------------------------------

  const deletePlan = async (id, e) => {
    e.stopPropagation();

    try {
      await api.delete(`/api/study-plans/${id}/`);

      setPlans((prev) =>
        prev.filter((plan) => plan.id !== id)
      );

      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error("Error deleting study plan:", error);
    }
  };

  // --------------------------------------------------
  // Toggle step
  // Backend remains source of truth
  // --------------------------------------------------

  const toggleStep = async (_, node) => {
    if (!selectedPlan) return;

    const step = selectedPlan.steps.find(
      (item) => String(item.id) === node.id
    );

    if (!step) return;

    try {
      const { data } = await api.patch(
        `/api/study-plans/${selectedPlan.id}/steps/${step.id}/`,
        {
          is_completed: !step.is_completed,
        }
      );

      // Backend response becomes source of truth
      setSelectedPlan(data);

      // Keep plan list synchronized
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === data.id ? data : plan
        )
      );
    } catch (error) {
      console.error(
        "Unable to update roadmap step:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 font-poppins">

      {/* ------------------------------------------------
          Header
      ------------------------------------------------ */}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <FiBook className="text-xl text-indigo-400" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Study Plans
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            AI-generated learning pathways you can complete step by step.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------
          Create Plan
      ------------------------------------------------ */}

      <section className={panel}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <FiPlus className="text-indigo-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              Create New Study Plan
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              Describe what you want to learn and let AI build the roadmap.
            </p>
          </div>
        </div>

        <form
          onSubmit={createPlan}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Plan title"
              value={newPlanTitle}
              onChange={(e) =>
                setNewPlanTitle(e.target.value)
              }
              className="
                w-full
                bg-slate-950
                border border-slate-800
                rounded-xl
                px-4 py-3
                text-sm text-white
                placeholder-slate-500
                focus:outline-none
                focus:border-indigo-500
                focus:ring-1
                focus:ring-indigo-500/20
                transition-all
              "
            />

            <textarea
              placeholder="What do you want to learn?"
              value={newPlanDesc}
              onChange={(e) =>
                setNewPlanDesc(e.target.value)
              }
              className="
                w-full
                h-[46px]
                resize-none
                bg-slate-950
                border border-slate-800
                rounded-xl
                px-4 py-3
                text-sm text-white
                placeholder-slate-500
                focus:outline-none
                focus:border-indigo-500
                focus:ring-1
                focus:ring-indigo-500/20
                transition-all
              "
            />

          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !newPlanTitle.trim()
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              px-5 py-2.5
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-indigo-950/30
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <FiPlus size={17} />

            {loading
              ? "Generating Roadmap..."
              : "Create Plan"}
          </button>
        </form>
      </section>

      {/* ------------------------------------------------
          Plans
      ------------------------------------------------ */}

      {plans.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Your Roadmaps
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Select a plan to open its interactive roadmap.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {plans.length}{" "}
              {plans.length === 1 ? "plan" : "plans"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() =>
                  setSelectedPlan(plan)
                }
                className={`
                  rounded-2xl
                  border
                  p-6
                  cursor-pointer
                  relative
                  group
                  flex flex-col
                  justify-between
                  transition-all
                  duration-200

                  ${
                    selectedPlan?.id === plan.id
                      ? `
                        border-indigo-500/70
                        bg-indigo-500/[0.06]
                        shadow-lg
                        shadow-indigo-950/20
                      `
                      : `
                        border-slate-800
                        bg-slate-900
                        hover:border-slate-700
                        hover:bg-slate-800/70
                      `
                  }
                `}
              >

                {/* Delete */}

                <button
                  onClick={(e) =>
                    deletePlan(plan.id, e)
                  }
                  className="
                    absolute
                    top-4 right-4
                    p-2
                    rounded-lg
                    text-slate-500
                    hover:text-rose-400
                    hover:bg-rose-500/10
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    z-10
                    cursor-pointer
                  "
                  title="Delete plan"
                >
                  <FiTrash size={16} />
                </button>

                <div>

                  <div className="pr-8">
                    <h3 className="text-lg font-semibold text-white leading-snug">
                      {plan.title}
                    </h3>

                    <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {plan.description ||
                        "No description provided."}
                    </p>
                  </div>

                  {/* Completed */}

                  {plan.is_completed && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        bg-emerald-500/15
                        border
                        border-emerald-400/40
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        text-emerald-300
                        mt-4
                      "
                    >
                      <FiCheck size={12} />
                      Completed
                    </span>
                  )}

                </div>

                {/* Metadata */}

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    {new Date(
                      plan.created_at
                    ).toLocaleDateString()}
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-slate-950
                      border
                      border-slate-800
                      px-2.5 py-1.5
                      text-xs
                      font-medium
                      text-indigo-300
                    "
                  >
                    <FiMap size={13} />
                    {plan.steps?.length || 0} Steps
                  </span>

                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* ------------------------------------------------
          Empty State
      ------------------------------------------------ */}

      {plans.length === 0 && (
        <div
          className="
            text-center
            py-20
            bg-slate-900
            border border-slate-800
            rounded-2xl
          "
        >
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-4">
            <FiBook className="text-xl text-slate-400" />
          </div>

          <p className="text-white font-semibold">
            No study plans yet
          </p>

          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first AI-generated roadmap above.
          </p>
        </div>
      )}

      {/* ------------------------------------------------
          Roadmap Modal
      ------------------------------------------------ */}

      {selectedPlan && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-slate-950/85
            backdrop-blur-sm
          "
        >

          <div
            className="
              bg-slate-900
              w-full
              max-w-5xl
              h-[82vh]
              rounded-2xl
              border border-slate-800
              shadow-2xl
              flex
              flex-col
              overflow-hidden
            "
          >

            {/* Modal Header */}

            <div
              className="
                px-5 sm:px-6
                py-4
                border-b border-slate-800
                flex
                items-center
                justify-between
                bg-slate-900
              "
            >

              <div className="min-w-0">

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <FiMap className="text-indigo-400" />
                  </div>

                  <h2 className="text-lg font-semibold text-white truncate">
                    {selectedPlan.title}
                  </h2>
                </div>

                <p className="text-xs text-slate-400 mt-1 ml-10">
                  Click a node to mark it complete or incomplete.
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedPlan(null)
                }
                className="
                  p-2
                  rounded-lg
                  text-slate-400
                  hover:text-white
                  hover:bg-slate-800
                  border border-transparent
                  hover:border-slate-700
                  transition-colors
                  cursor-pointer
                  flex-shrink-0
                "
                title="Close roadmap"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* React Flow */}

            <div className="flex-1 bg-slate-950 relative">

              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={toggleStep}
                fitView
              >

                <Background
                  color="#1e293b"
                  gap={32}
                  size={1}
                />

                <Controls
                  className="
                    bg-slate-900
                    border border-slate-800
                    rounded-xl
                    overflow-hidden
                    text-slate-200
                    fill-slate-200
                    shadow-lg
                    m-3
                  "
                />

                <MiniMap
                  style={{
                    background: "#111827",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                  }}
                  nodeColor={(node) =>
                    node.style?.background === "#064e3b"
                      ? "#34d399"
                      : "#6366f1"
                  }
                  maskColor="rgba(15, 23, 42, 0.72)"
                />

              </ReactFlow>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudyPlan;