import { useEffect, useMemo, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FiActivity,
  FiAward,
  FiClock,
  FiPlus,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import api from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#14b8a6",
];
const panel =
  "rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-6 shadow-sm shadow-slate-950/50";

const weekDays = () =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [goal, setGoal] = useState("10");
  const [savingGoal, setSavingGoal] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState(() =>
    JSON.parse(localStorage.getItem("prolearn-topics") || "[]"),
  );

  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const load = async () => {
    const [profileResponse, planResponse] = await Promise.all([
      api.get("/user/profile/"),
      api.get("/api/study-plans/"),
    ]);
    setProfile(profileResponse.data);
    setGoal(String(profileResponse.data.weekly_goal));
    setPlans(planResponse.data);
  };

  useEffect(() => {
    load().catch((error) => console.error("Unable to load dashboard", error));
  }, []);
  useEffect(() => {
    localStorage.setItem("prolearn-topics", JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    let interval;
    if (stopwatchRunning) {
      interval = setInterval(() => setStopwatchSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const handleStopwatch = async () => {
    if (stopwatchRunning) {
      setStopwatchRunning(false);
      if (stopwatchSeconds > 0) {
        try {
          const { data } = await api.post("/user/focus/", {
            seconds: stopwatchSeconds,
          });
          setProfile(data);
        } catch (error) {
          console.error("Failed to post focus time", error);
        }
      }
      setStopwatchSeconds(0);
    } else {
      setStopwatchRunning(true);
    }
  };

  const formatStopwatch = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const days = useMemo(weekDays, []);
  const focusByDay = Object.fromEntries(
    (profile?.focus_history || []).map((item) => [item.date, item.minutes]),
  );
  const focusValues = days.map((day) => focusByDay[day.key] || 0);
  const weeklyMinutes = focusValues.reduce(
    (total, minutes) => total + minutes,
    0,
  );

  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  const weeklyGoalMinutes = Math.max(Number(profile?.weekly_goal || 0) * 60, 1);

  const goalProgress = Math.min(
    100,
    Math.round((weeklyMinutes / weeklyGoalMinutes) * 100),
  );
  const completedPlans = plans
    .filter((plan) => plan.is_completed)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Poppins" } } },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", font: { family: "Poppins" } },
        grid: { color: "rgba(51, 65, 85, 0.4)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#94a3b8", font: { family: "Poppins" } },
        grid: { color: "rgba(51, 65, 85, 0.4)" },
      },
    },
  };

  const engagementData = {
    labels: days.map((day) => day.label),
    datasets: [
      {
        label: "Focus time (minutes)",
        data: focusValues,
        borderColor: "#818cf8",
        backgroundColor: "rgba(129, 140, 248, 0.1)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const topicData = {
    labels: topics,
    datasets: [
      {
        data: topics.map(() => 1),
        backgroundColor: topics.map(
          (_, index) => COLORS[index % COLORS.length],
        ),
        borderWidth: 0,
      },
    ],
  };

  const saveGoal = async () => {
    const weeklyGoal = Number(goal);
    if (!Number.isFinite(weeklyGoal) || weeklyGoal <= 0) return;
    setSavingGoal(true);
    try {
      const { data } = await api.patch("/user/profile/", {
        weekly_goal: weeklyGoal,
      });
      setProfile(data);
    } finally {
      setSavingGoal(false);
    }
  };

  const addTopic = (event) => {
    event.preventDefault();
    const topic = topicInput.trim();
    if (!topic || topics.length >= 10 || topics.includes(topic)) return;
    setTopics([...topics, topic]);
    setTopicInput("");
  };

  const updateTopic = (index, value) =>
    setTopics(
      topics
        .map((topic, topicIndex) => (topicIndex === index ? value : topic))
        .filter(Boolean),
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Metric Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={panel}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                Today&apos;s Focus
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                {profile?.daily_focus || 0} min
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-mono text-indigo-400 mb-2">
                {formatStopwatch(stopwatchSeconds)}
              </div>
              <button
                onClick={handleStopwatch}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${stopwatchRunning ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"}`}
              >
                {stopwatchRunning ? "Stop Focus" : "Start Focus"}
              </button>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <FiActivity className="text-indigo-400" /> Focus time accumulates
            dynamically for today.
          </p>
        </div>

        <div className={panel}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Weekly Goal</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                {weeklyHours} / {profile?.weekly_goal || 0} hrs
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <FiStar className="text-xl text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              aria-label="Weekly goal in hours"
              className="w-28 rounded-xl bg-slate-950/60 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              type="number"
              min="1"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
            <button
              onClick={saveGoal}
              disabled={savingGoal}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              {savingGoal ? "Saving..." : "Save hours"}
            </button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/60 border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {goalProgress}% of this week&apos;s goal achieved
          </p>
        </div>
      </section>

      {/* Analytics Chart Section */}
      <section className={panel}>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Learning Engagement
        </h2>
        <p className="mb-5 text-xs sm:text-sm text-slate-400">
          Focus time distribution over the last seven days
        </p>
        <div className="h-80 w-full">
          <Line data={engagementData} options={chartOptions} />
        </div>
      </section>

      {/* Recent Achievements */}
      <div className={panel}>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Recent Achievements
        </h2>
        <p className="mb-5 text-xs sm:text-sm text-slate-400">
          Study plans you have successfully completed
        </p>

        <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {completedPlans.length ? (
            completedPlans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center gap-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 p-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <FiAward className="text-lg text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-200">
                    {plan.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Completed &bull;{" "}
                    {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <FiAward className="text-4xl text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">
                No completed roadmaps yet
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Complete a study plan to unlock achievements here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
