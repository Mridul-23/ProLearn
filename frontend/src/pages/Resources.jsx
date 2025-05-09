import React, { useState } from "react";
import { FiArchive, FiSearch } from "react-icons/fi";
import axios from "axios";

const THEME = {
  text: { primary: "#f8fafc", secondary: "#e2e8f0" },
  bg: { secondary: "#1e293b" },
};
const storedResourcesMock = [
  {
    id: 1,
    title: "React Hooks Guide",
    url: "https://www.youtube.com/results?search_query=react+hooks+guide",
  },
  {
    id: 2,
    title: "DRF Tutorial",
    url: "https://www.youtube.com/results?search_query=DRF+tutorial",
  },
];

const Resources = () => {
  const [activeTab, setActiveTab] = useState("storage");
  const [storageQuery, setStorageQuery] = useState("");
  const [browseQuery, setBrowseQuery] = useState("");
  const [storedResources] = useState(storedResourcesMock);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [mediumResults, setMediumResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredResources = storedResources.filter((res) =>
    res.title.toLowerCase().includes(storageQuery.toLowerCase())
  );

  const handleBrowse = async () => {
    if (!browseQuery) return;
    setLoading(true);
    try {
      const [ytRes, mdRes] = await Promise.all([
        axios.get("/api/browse/youtube", {
          params: { q: browseQuery, maxResults: 5 },
        }),
        axios.get("/api/browse/medium", {
          params: { q: browseQuery, limit: 5 },
        }),
      ]);
      setYoutubeResults(ytRes.data.items || []);
      setMediumResults(mdRes.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-xl border"
      style={{ backgroundColor: THEME.bg.secondary, borderColor: "#334155" }}
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("storage")}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            activeTab === "storage"
              ? "bg-indigo-500/50 border border-indigo-500"
              : "hover:bg-slate-700/20"
          }`}
          style={{ color: THEME.text.primary }}
        >
          <FiArchive className="text-xl mr-2" /> Stored Resources
        </button>
        <button
          onClick={() => setActiveTab("browse")}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            activeTab === "browse"
              ? "bg-indigo-500/50 border border-indigo-500"
              : "hover:bg-slate-700/20"
          }`}
          style={{ color: THEME.text.primary }}
        >
          <FiSearch className="text-xl mr-2" /> Browse
        </button>
      </div>
      {activeTab === "storage" && (
        <div>
          <input
            type="text"
            placeholder="Search stored resources..."
            value={storageQuery}
            onChange={(e) => setStorageQuery(e.target.value)}
            className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-700/20"
            style={{ color: THEME.text.primary, borderColor: "#334155" }}
          />
          <ul className="space-y-2">
            {filteredResources.map((res) => (
              <li key={res.id}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-slate-700/20"
                  style={{
                    color: THEME.text.secondary,
                    backgroundColor: THEME.bg.secondary,
                  }}
                >
                  {res.title}
                </a>
              </li>
            ))}
            {filteredResources.length === 0 && (
              <p style={{ color: THEME.text.primary }}>No resources found.</p>
            )}
          </ul>
        </div>
      )}
      {activeTab === "browse" && (
        <div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search tutorials..."
              value={browseQuery}
              onChange={(e) => setBrowseQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-l-lg bg-slate-700/20"
              style={{ color: THEME.text.primary, borderColor: "#334155" }}
            />
            <button
              onClick={handleBrowse}
              className="px-4 py-2 rounded-r-lg bg-indigo-600 hover:bg-indigo-700"
              style={{ color: THEME.text.primary }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {!loading && (
            <>
              <h3
                className="mb-2 text-lg"
                style={{ color: THEME.text.primary }}
              >
                YouTube Videos
              </h3>
              <ul className="mb-6 space-y-2">
                {youtubeResults.map((item) => (
                  <li key={item.id.videoId}>
                    <a
                      href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg hover:bg-slate-700/20"
                      style={{ color: THEME.text.secondary }}
                    >
                      {item.snippet.title}
                    </a>
                  </li>
                ))}
                {youtubeResults.length === 0 && (
                  <p style={{ color: THEME.text.primary }}>No videos found.</p>
                )}
              </ul>
              <h3
                className="mb-2 text-lg"
                style={{ color: THEME.text.primary }}
              >
                Medium Articles
              </h3>
              <ul className="space-y-2">
                {mediumResults.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg hover:bg-slate-700/20"
                      style={{ color: THEME.text.secondary }}
                    >
                      {item.title || item.name}
                    </a>
                  </li>
                ))}
                {mediumResults.length === 0 && (
                  <p style={{ color: THEME.text.primary }}>
                    No articles found.
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default Resources;
