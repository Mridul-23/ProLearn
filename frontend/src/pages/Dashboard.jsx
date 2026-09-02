import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiActivity, FiArrowRight, FiAward, FiBook, FiCheckCircle, FiMessageSquare, FiPlus, FiShield, FiTarget, FiSearch } from "react-icons/fi";
import api from "../utils/api";

const panel = "rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-sm shadow-slate-950/50";

const getProgress = (plan) => {
  const total = plan.steps?.length || 0;
  const completed = plan.steps?.filter((step) => step.is_completed).length || 0;
  return { total, completed, percentage: total ? Math.round((completed / total) * 100) : 0 };
};

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [goal, setGoal] = useState("10");
  const [savingGoal, setSavingGoal] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    const [profileResponse, planResponse] = await Promise.all([api.get("/user/profile/"), api.get("/api/study-plans/")]);
    setProfile(profileResponse.data);
    setGoal(String(profileResponse.data.weekly_goal));
    setPlans(planResponse.data);
  };

  useEffect(() => {
    load().catch((error) => console.error("Unable to load dashboard", error));
  }, []);

  const activePlans = useMemo(() => plans.filter((plan) => !plan.is_completed), [plans]);
  const completedPlans = useMemo(() => plans.filter((plan) => plan.is_completed).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [plans]);
  const currentPlan = activePlans.length ? [...activePlans].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] : null;

  const totalCompletedSteps = useMemo(() => plans.reduce((total, plan) => total + (plan.steps?.filter((step) => step.is_completed).length || 0), 0), [plans]);
  const totalSteps = useMemo(() => plans.reduce((total, plan) => total + (plan.steps?.length || 0), 0), [plans]);

  const weeklyMinutes = profile?.focus_history?.reduce((total, item) => total + Number(item.minutes || 0), 0) || 0;
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);
  const weeklyGoalMinutes = Math.max(Number(profile?.weekly_goal || 0) * 60, 1);
  const goalProgress = Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100));

  const saveGoal = async () => {
    const weeklyGoal = Number(goal);
    if (!Number.isFinite(weeklyGoal) || weeklyGoal <= 0) return;
    setSavingGoal(true);
    try {
      const { data } = await api.patch("/user/profile/", { weekly_goal: weeklyGoal });
      setProfile(data);
    } catch (error) {
      console.error("Unable to update weekly goal", error);
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-indigo-400">ProLearn Workspace</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""} 👋</h1>
        <p className="text-sm sm:text-base text-slate-400">Pick up where you left off or start something new.</p>
      </section>

      {/* Learning Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={panel}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"><FiBook className="text-indigo-400 text-lg" /></div>
            <div><p className="text-xs text-slate-400">Active Plans</p><p className="text-2xl font-bold text-white">{activePlans.length}</p></div>
          </div>
        </div>
        <div className={panel}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><FiCheckCircle className="text-emerald-400 text-lg" /></div>
            <div><p className="text-xs text-slate-400">Completed Plans</p><p className="text-2xl font-bold text-white">{completedPlans.length}</p></div>
          </div>
        </div>
        <div className={panel}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"><FiTarget className="text-amber-400 text-lg" /></div>
            <div><p className="text-xs text-slate-400">Steps Completed</p><p className="text-2xl font-bold text-white">{totalCompletedSteps}<span className="text-sm text-slate-500"> / {totalSteps}</span></p></div>
          </div>
        </div>
      </section>

      {/* Continue Learning + Weekly Goal */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className={panel}>
          <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Continue Learning</p>
          {currentPlan ? (
            (() => {
              const progress = getProgress(currentPlan);
              return (
                <div className="mt-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{currentPlan.title}</h2>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{currentPlan.description}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-400"><span>{progress.completed} / {progress.total} steps completed</span><span>{progress.percentage}%</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950/70 border border-slate-800/80"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${progress.percentage}%` }} /></div>
                  <Link to="/user/study-plan" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm shadow-indigo-600/30">Continue Learning <FiArrowRight /></Link>
                </div>
              );
            })()
          ) : (
            <div className="mt-5">
              <h2 className="text-xl font-bold text-white">Ready for your next roadmap?</h2>
              <p className="mt-2 text-sm text-slate-400">Create an AI-powered study plan and turn your learning goal into a structured path.</p>
              <Link to="/user/study-plan" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm shadow-indigo-600/30"><FiPlus /> Create Study Plan</Link>
            </div>
          )}
        </div>

        <div className={panel}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">Weekly Goal</p><p className="mt-2 text-2xl font-bold text-white">{weeklyHours} <span className="text-sm font-medium text-slate-500">/ {profile?.weekly_goal || 0} hrs</span></p></div>
            <FiActivity className="text-xl text-amber-400" />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-950/70 border border-slate-800/80"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500" style={{ width: `${goalProgress}%` }} /></div>
          <p className="mt-2 text-xs text-slate-400">{goalProgress}% of this week's goal achieved</p>
          <div className="mt-5 flex gap-2">
            <input aria-label="Weekly goal in hours" className="w-24 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-sm text-white theme-scroll focus:outline-none focus:border-indigo-500 transition-colors" type="number" min="1" value={goal} onChange={(event) => setGoal(event.target.value)} />
            <button onClick={saveGoal} disabled={savingGoal} className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-60 cursor-pointer">{savingGoal ? "Saving..." : "Update"}</button>
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Focus time is recorded when you explicitly log a focus session.</p>
        </div>
      </section>

      {/* Study Plans */}
      <section className={panel}>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div><h2 className="text-lg font-bold text-white tracking-tight">Your Study Plans</h2><p className="text-xs sm:text-sm text-slate-400 mt-1">A quick view of your current learning progress.</p></div>
          <Link to="/user/study-plan" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View all <FiArrowRight /></Link>
        </div>

        {plans.length ? (
          <div className="space-y-3">
            {plans.slice(0, 5).map((plan) => {
              const progress = getProgress(plan);
              return (
                <div key={plan.id} className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    <div className="min-w-0 flex-1"><p className="font-medium text-sm text-slate-200 truncate">{plan.title}</p><p className="text-xs text-slate-500 mt-1">{progress.completed} / {progress.total} steps completed</p></div>
                    <div className="w-full sm:w-44"><div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress.percentage}%` }} /></div></div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-32"><span className={`text-xs font-semibold ${plan.is_completed ? "text-emerald-400" : "text-indigo-400"}`}>{plan.is_completed ? "Completed" : `${progress.percentage}%`}</span><Link to="/user/study-plan" className="text-xs text-slate-400 hover:text-white transition-colors">{plan.is_completed ? "View" : "Continue"} <FiArrowRight className="inline" /></Link></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center rounded-xl border border-dashed border-slate-800">
            <FiBook className="text-3xl text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No study plans yet</p>
            <p className="text-xs text-slate-500 mt-1">Create your first roadmap to start learning.</p>
          </div>
        )}
      </section>

      {/* Quick Actions + Recently Completed */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={panel}>
          <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-5">Jump straight into your workspace.</p>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/user/study-plan" className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 hover:bg-slate-800/50 transition-colors"><FiPlus className="text-indigo-400 text-lg mb-3" /><p className="text-sm font-semibold text-slate-200">New Study Plan</p><p className="text-xs text-slate-500 mt-1">Build a roadmap</p></Link>
            <Link to="/user/ai-tutor" className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 hover:bg-slate-800/50 transition-colors"><FiMessageSquare className="text-cyan-400 text-lg mb-3" /><p className="text-sm font-semibold text-slate-200">AI Tutor</p><p className="text-xs text-slate-500 mt-1">Ask and learn</p></Link>
            <button
              onClick={() => navigate("/user/resources")}
              className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
            >
              <FiBook className="text-emerald-400 text-lg mb-3" />
              <p className="text-sm font-semibold text-slate-200">View Saved Resources</p>
              <p className="text-xs text-slate-500 mt-1">Open your resource library</p>
            </button>

            <button
              onClick={() => navigate("/user/resources", { state: { focusSearch: true } })}
              className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
            >
              <FiSearch className="text-cyan-400 text-lg mb-3" />
              <p className="text-sm font-semibold text-slate-200">Browse New Resources</p>
              <p className="text-xs text-slate-500 mt-1">Find new learning material</p>
            </button>
            <Link to="/user/audit" className="group rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 hover:bg-slate-800/50 transition-colors"><FiShield className="text-amber-400 text-lg mb-3" /><p className="text-sm font-semibold text-slate-200">AI Activity</p><p className="text-xs text-slate-500 mt-1">Review AI usage</p></Link>
          </div>
        </div>

        <div className={panel}>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div><h2 className="text-lg font-bold text-white tracking-tight">Recently Completed</h2><p className="text-xs sm:text-sm text-slate-400 mt-1">Your latest completed roadmaps.</p></div>
            <FiAward className="text-xl text-emerald-400" />
          </div>
          {completedPlans.length ? (
            <div className="space-y-3">
              {completedPlans.slice(0, 4).map((plan) => (
                <div key={plan.id} className="flex items-center gap-3 rounded-xl bg-slate-950/40 border border-slate-800/60 p-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0"><FiAward className="text-emerald-400" /></div>
                  <div className="min-w-0"><p className="text-sm font-medium text-slate-200 truncate">{plan.title}</p><p className="text-xs text-slate-500 mt-0.5">Completed {new Date(plan.created_at).toLocaleDateString()}</p></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <FiAward className="text-3xl text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No completed plans yet</p>
              <p className="text-xs text-slate-500 mt-1">Complete a study plan to see it here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}