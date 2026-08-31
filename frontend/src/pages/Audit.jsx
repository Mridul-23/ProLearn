import { useEffect, useState } from "react";
import {
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiCpu,
  FiClock,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../utils/api";

const SOURCE_LABELS = {
  ai_tutor: "AI Tutor",
  study_plan: "Study Plan",
  unknown: "Unknown",
};

const Audit = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const { data } = await api.get("/user/audit/");
        setAudits(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch audit history:", error);
        setError("Unable to load your AI activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  const toggleAudit = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-[80vh] bg-slate-950 text-slate-100 font-poppins">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <FiActivity className="text-xl text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              AI Activity
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review your recent AI interactions in ProLearn.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-indigo-400 mt-0.5 shrink-0" />

          <p className="text-xs leading-relaxed text-slate-400">
            Your recent AI activity is shown here for transparency.
            ProLearn keeps only the latest 20 audit records for your
            account.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-400">
            <FiCpu className="animate-pulse text-indigo-400" />
            <span className="text-sm">Loading AI activity...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-center">
          <FiAlertCircle className="mx-auto mb-2 text-rose-400 text-xl" />

          <p className="text-sm text-rose-300">
            {error}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && audits.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <FiMessageSquare className="mx-auto mb-4 text-3xl text-slate-600" />

          <h2 className="text-lg font-semibold text-slate-300">
            No AI activity yet
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Your recent AI interactions will appear here.
          </p>
        </div>
      )}

      {/* Audit list */}
      {!loading && !error && audits.length > 0 && (
        <div className="space-y-3">
          {audits.map((audit) => {
            const isExpanded = expandedId === audit.id;

            return (
              <div
                key={audit.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg"
              >
                {/* Summary */}
                <button
                  type="button"
                  onClick={() => toggleAudit(audit.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                      <FiCpu className="text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">
                          {SOURCE_LABELS[audit.source] || "Unknown"}
                        </span>

                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          AI Request
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                        <FiClock />
                        <span>
                          {formatTimestamp(audit.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-500 shrink-0">
                    {isExpanded ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </div>
                </button>

                {/* Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800 px-5 py-5 space-y-5">
                    {/* Prompt */}
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageSquare className="text-indigo-400 text-sm" />

                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Prompt
                        </h3>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                          {audit.prompt}
                        </p>
                      </div>
                    </section>

                    {/* Response */}
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <FiCpu className="text-emerald-400 text-sm" />

                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          AI Response
                        </h3>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                          {audit.ai_response}
                        </p>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Audit;