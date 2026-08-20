import React, { useState, useEffect } from "react";
import { FiArchive, FiSearch, FiPlus, FiExternalLink, FiTrash2 } from "react-icons/fi";
import api from "../utils/api";

const THEME = {
  text: { primary: "#f8fafc", secondary: "#e2e8f0" },
  bg: { secondary: "#1e293b" },
};

const Resources = () => {
  const [activeTab, setActiveTab] = useState("storage");
  const [storageQuery, setStorageQuery] = useState("");
  const [browseQuery, setBrowseQuery] = useState("");
  const [storedResources, setStoredResources] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [mediumResults, setMediumResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ id: null, message: "" });

  useEffect(() => {
    fetchStoredResources();
  }, []);

  const fetchStoredResources = async () => {
    try {
      const res = await api.get("/api/resources/");
      setStoredResources(res.data);
    } catch (error) {
      console.error("Failed to fetch resources", error);
    }
  };

  const handleSaveResource = async (resource, type) => {
    // Optimistic ID for notification
    const itemId = resource.id?.videoId || resource.id;
    
    try {
        const payload = {
            title: resource.title || resource.snippet?.title || "Untitled",
            url: resource.url || (type === 'video' ? `https://www.youtube.com/watch?v=${resource.id?.videoId}` : resource.url),
            resource_type: type,
            description: resource.description || resource.snippet?.description || ""
        };
        
        await api.post("/api/resources/", payload);
        
        // Show notification
        setNotification({ id: itemId, message: "Saved!" });
        
        // Clear after 4s
        setTimeout(() => {
            setNotification({ id: null, message: "" });
        }, 4000);

        fetchStoredResources(); 
    } catch (error) {
        console.error("Failed to save resource", error);
        alert("Failed to save resource.");
    }
  };

  const handleDeleteResource = async (id) => {
    try {
        await api.delete(`/api/resources/${id}/`);
        
        // Show notification (for delete we might need to be clever since item disappears, 
        // but let's just show a global toast or use a similar mechanism if item stays for animation)
        // For simplicity we'll assume we can't show it ON the button easily if the button disappears immediately.
        // But if we want it "similar styling", we can put it where the button was? 
        // Or actually, simply not removing it from local state immediately would allow showing the notification.
        // Let's do that: show notification THEN remove from state.
        
        setNotification({ id: id, message: "Removed!" });
        
        // Wait for notification to be seen before updating list
        setTimeout(() => {
           setNotification({ id: null, message: "" });
           fetchStoredResources(); 
        }, 1500); // Shorter for delete so user doesn't wait too long to see it gone

    } catch (error) {
        console.error("Failed to delete resource", error);
        alert("Failed to delete resource.");
    }
  };

  const filteredResources = storedResources.filter((res) =>
    res.title.toLowerCase().includes(storageQuery.toLowerCase())
  );

  const handleBrowse = async () => {
    if (!browseQuery) return;
    setLoading(true);
    try {
      const [ytRes, mdRes] = await Promise.all([
        api.get("/api/browse/youtube/", {
          params: { q: browseQuery, maxResults: 5 },
        }),
        api.get("/api/browse/medium/", {
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
      className="p-6 rounded-xl border min-h-[80vh]"
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
            className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-700/20 focus:outline-none focus:border-indigo-500 border border-transparent"
            style={{ color: THEME.text.primary, borderColor: "#334155" }}
          />
          <ul className="space-y-3">
            {filteredResources.map((res) => (
              <li key={res.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                    <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-indigo-400 transition-colors flex items-center gap-2"
                    style={{ color: THEME.text.primary }}
                    >
                    {res.title} <FiExternalLink />
                    </a>
                    <span className="text-xs uppercase tracking-wider text-slate-500 mt-1 block">{res.resource_type}</span>
                </div>
                <div className="relative ml-4">
                    {notification.id === res.id && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap animate-fade-in-up md:z-50 z-20">
                            {notification.message}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                        </div>
                    )}
                    <button 
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-2 rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all relative"
                        title="Remove Resource"
                    >
                        <FiTrash2 className="text-lg" />
                    </button>
                </div>
              </li>
            ))}
            {filteredResources.length === 0 && (
              <p className="text-center py-8" style={{ color: THEME.text.secondary }}>No resources found. Try browsing and adding some!</p>
            )}
          </ul>
        </div>
      )}
      
      {activeTab === "browse" && (
        <div>
          <div className="flex items-center mb-6 gap-2">
            <input
              type="text"
              placeholder="Topic to search (e.g. React Patterns)..."
              value={browseQuery}
              onChange={(e) => setBrowseQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-700/20 border border-slate-700 focus:outline-none focus:border-indigo-500"
              style={{ color: THEME.text.primary }}
              onKeyDown={(e) => e.key === 'Enter' && handleBrowse()}
            />
            <button
              onClick={handleBrowse}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-medium transition-colors"
              style={{ color: THEME.text.primary }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          
          {!loading && (
            <div className="space-y-8">
              {/* Youtube Results */}
              {youtubeResults.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold flex items-center gap-2" style={{ color: THEME.text.primary }}>
                       Videos
                    </h3>
                    <div className="grid gap-3">
                        {youtubeResults.map((item) => (
                        <div key={item.id.videoId} className="flex justify-between items-center p-4 rounded-lg bg-slate-800 border border-slate-700">
                             <div className="flex-1">
                                <a
                                    href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block font-medium hover:text-indigo-400 mb-1"
                                    style={{ color: THEME.text.primary }}
                                >
                                    {item.snippet.title}
                                </a>
                                <p className="text-sm text-slate-400">{item.snippet.channelTitle}</p>
                             </div>
                             <div className="relative ml-4">
                                {notification.id === item.id.videoId && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap animate-fade-in-up md:z-50 z-20">
                                        {notification.message}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rotate-45"></div>
                                    </div>
                                )}
                                <button 
                                    onClick={() => handleSaveResource(item, 'video')}
                                    className="p-2 rounded-full bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all relative"
                                    title="Save to Resources"
                                >
                                    <FiPlus className="text-lg" />
                                </button>
                             </div>
                        </div>
                        ))}
                    </div>
                  </div>
              )}

              {/* Medium Results */}
              {mediumResults.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold" style={{ color: THEME.text.primary }}>
                       Articles
                    </h3>
                    <div className="grid gap-3">
                        {mediumResults.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-800 border border-slate-700">
                             <div className="flex-1">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block font-medium hover:text-indigo-400 mb-1"
                                    style={{ color: THEME.text.primary }}
                                >
                                    {item.title}
                                </a>
                                <p className="text-sm text-slate-400">{item.author}</p>
                             </div>
                             <button 
                                onClick={() => handleSaveResource(item, 'article')}
                                className="ml-4 p-2 rounded-full bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all"
                                title="Save to Resources"
                             >
                                <FiPlus className="text-lg" />
                             </button>
                        </div>
                        ))}
                    </div>
                  </div>
              )}
              
              {youtubeResults.length === 0 && mediumResults.length === 0 && !loading && browseQuery && (
                  <div className="text-center py-10 opacity-60">
                      <p>No results found. Try a different query.</p>
                  </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;
