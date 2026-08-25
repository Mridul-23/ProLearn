import { useEffect, useState } from "react";
import {
  FiArchive,
  FiSearch,
  FiPlus,
  FiExternalLink,
  FiTrash2,
  FiBookOpen,
  FiX,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import api from "../utils/api";

const Resources = () => {
  const [activeTab, setActiveTab] = useState("storage");
  const [storageQuery, setStorageQuery] = useState("");
  const [browseQuery, setBrowseQuery] = useState("");
  const [storedResources, setStoredResources] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [mediumResults, setMediumResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    id: null,
    message: "",
  });
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchStoredResources();
  }, []);

  const fetchStoredResources = async () => {
    try {
      const { data } = await api.get("/api/resources/");
      setStoredResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const showNotification = (id, message) => {
    setNotification({ id, message });

    setTimeout(() => {
      setNotification({
        id: null,
        message: "",
      });
    }, 1500);
  };

  const handleSaveResource = async (resource, type) => {
    const isVideo = type === "video";

    const payload = {
      title: isVideo
        ? resource.snippet.title
        : resource.title,

      url: isVideo
        ? `https://www.youtube.com/watch?v=${resource.id.videoId}`
        : resource.url,

      resource_type: type,

      description: isVideo
        ? resource.snippet.description || ""
        : "",
    };

    try {
      await api.post("/api/resources/", payload);

      showNotification(
        isVideo ? resource.id.videoId : resource.id,
        "Saved!"
      );

      fetchStoredResources();
    } catch (error) {
      console.error("Failed to save resource:", error);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await api.delete(`/api/resources/${id}/`);

      setStoredResources((prev) =>
        prev.filter((resource) => resource.id !== id)
      );

      showNotification(id, "Removed!");
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  const handleBrowse = async () => {
    if (!browseQuery.trim()) return;

    setLoading(true);

    try {
      const [youtube, medium] = await Promise.all([
        api.get("/api/browse/youtube/", {
          params: {
            q: browseQuery,
          },
        }),

        api.get("/api/browse/medium/", {
          params: {
            q: browseQuery,
          },
        }),
      ]);

      setYoutubeResults(youtube.data.items || []);
      setMediumResults(medium.data.items || []);
    } catch (error) {
      console.error("Browse failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = storedResources.filter((resource) =>
    resource.title
      ?.toLowerCase()
      .includes(storageQuery.toLowerCase())
  );

  // --------------------------------------------------
  // Resource type badge
  // --------------------------------------------------

  const getTypeClass = (type) => {
    const classes = {
      video:
        "bg-red-500/8 text-red-300/80 border-red-400/15",

      article:
        "bg-sky-500/8 text-sky-300/80 border-sky-400/15",

      ai_note:
        "bg-violet-500/8 text-violet-300/80 border-violet-400/15",
    };

    return (
      classes[type] ||
      "bg-slate-500/8 text-slate-400 border-slate-700"
    );
  };

  return (
    <div
      className="
        min-h-[80vh]
        rounded-2xl
        border border-slate-800
        bg-slate-900
        p-6
        sm:p-7
        font-poppins
      "
    >
      {/* ==================================================
          Header
      ================================================== */}

      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-100">
          Resources
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Save useful videos, articles, and AI notes for later.
        </p>
      </div>

      {/* ==================================================
          Tabs
      ================================================== */}

      <div className="flex items-center gap-1 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab("storage")}
          className={`
            flex items-center gap-2
            px-4 py-3
            text-sm font-medium
            border-b-2
            transition-colors
            ${
              activeTab === "storage"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }
          `}
        >
          <FiArchive size={15} />
          Stored Resources
        </button>

        <button
          onClick={() => setActiveTab("browse")}
          className={`
            flex items-center gap-2
            px-4 py-3
            text-sm font-medium
            border-b-2
            transition-colors
            ${
              activeTab === "browse"
                ? "border-indigo-400 text-indigo-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }
          `}
        >
          <FiSearch size={15} />
          Browse
        </button>
      </div>

      {/* ==================================================
          STORAGE
      ================================================== */}

      {activeTab === "storage" && (
        <div className="space-y-5">

          {/* Search */}

          <div className="relative">
            <FiSearch
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
              size={16}
            />

            <input
              type="text"
              placeholder="Search your library..."
              value={storageQuery}
              onChange={(e) =>
                setStorageQuery(e.target.value)
              }
              className="
                w-full
                pl-10
                pr-4
                py-3
                rounded-xl
                bg-slate-950
                border border-slate-800
                text-slate-200
                placeholder-slate-600
                text-sm
                focus:outline-none
                focus:border-slate-700
                focus:ring-1
                focus:ring-indigo-500/20
                transition-all
              "
            />
          </div>

          {/* Resource list */}

          <div className="space-y-2">

            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-4
                  py-3.5
                  rounded-xl
                  bg-slate-950/50
                  border border-slate-800/70
                  hover:border-slate-700
                  hover:bg-slate-950
                  transition-colors
                "
              >
                <div className="min-w-0">

                  {/* Title */}

                  {resource.resource_type === "ai_note" ? (
                    <button
                      onClick={() =>
                        setSelectedNote(resource)
                      }
                      className="
                        max-w-full
                        font-medium
                        text-slate-200
                        hover:text-indigo-300
                        flex
                        items-center
                        gap-2
                        transition-colors
                        text-left
                      "
                    >
                      <span className="truncate">
                        {resource.title}
                      </span>

                      <FiBookOpen
                        size={14}
                        className="flex-shrink-0 text-slate-500"
                      />
                    </button>
                  ) : (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        max-w-full
                        font-medium
                        text-slate-200
                        hover:text-indigo-300
                        flex
                        items-center
                        gap-2
                        transition-colors
                      "
                    >
                      <span className="truncate">
                        {resource.title}
                      </span>

                      <FiExternalLink
                        size={14}
                        className="
                          flex-shrink-0
                          text-slate-500
                        "
                      />
                    </a>
                  )}

                  {/* Type */}

                  <span
                    className={`
                      inline-flex
                      mt-2
                      px-2
                      py-0.5
                      rounded-md
                      border
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      ${getTypeClass(
                        resource.resource_type
                      )}
                    `}
                  >
                    {resource.resource_type.replace(
                      "_",
                      " "
                    )}
                  </span>
                </div>

                {/* Delete */}

                <button
                  onClick={() =>
                    handleDeleteResource(resource.id)
                  }
                  className="
                    flex-shrink-0
                    p-2
                    rounded-lg
                    text-slate-600
                    hover:text-red-400
                    hover:bg-red-500/10
                    transition-colors
                  "
                  title="Remove resource"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}

            {/* Empty */}

            {filteredResources.length === 0 && (
              <div
                className="
                  py-14
                  text-center
                  rounded-xl
                  border border-dashed border-slate-800
                  bg-slate-950/30
                "
              >
                <FiArchive
                  className="
                    mx-auto
                    mb-3
                    text-slate-600
                  "
                  size={22}
                />

                <p className="text-sm text-slate-400">
                  No resources found.
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  Browse for something useful and save it here.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================================================
          BROWSE
      ================================================== */}

      {activeTab === "browse" && (
        <div className="space-y-7">

          <div className="flex flex-col sm:flex-row gap-2">

            <div className="relative flex-1">
              <FiSearch
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
                size={16}
              />

              <input
                type="text"
                placeholder="Search for a topic..."
                value={browseQuery}
                onChange={(e) =>
                  setBrowseQuery(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleBrowse();
                  }
                }}
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  rounded-xl
                  bg-slate-950
                  border border-slate-800
                  text-slate-200
                  placeholder-slate-600
                  text-sm
                  focus:outline-none
                  focus:border-slate-700
                  focus:ring-1
                  focus:ring-indigo-500/20
                  transition-all
                "
              />
            </div>

            <button
              onClick={handleBrowse}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-500
                disabled:bg-indigo-600/40
                disabled:cursor-not-allowed
                text-white
                text-sm
                font-medium
                transition-colors
              "
            >
              <FiSearch size={15} />

              {loading
                ? "Searching..."
                : "Search"}
            </button>
          </div>

          {/* ==================================================
              YouTube
          ================================================== */}

          {youtubeResults.length > 0 && (
            <section>

              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-slate-300">
                  Videos
                </h2>

                <span className="text-xs text-slate-600">
                  {youtubeResults.length}
                </span>
              </div>

              <div className="space-y-2">

                {youtubeResults.map((item) => (
                  <div
                    key={item.id.videoId}
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-xl
                      bg-slate-950/50
                      border border-slate-800/70
                      hover:border-slate-700
                      transition-colors
                    "
                  >
                    <div className="min-w-0 flex-1">

                      <a
                        href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          block
                          text-sm
                          font-medium
                          text-slate-200
                          hover:text-indigo-300
                          truncate
                          transition-colors
                        "
                      >
                        {item.snippet.title}
                      </a>

                      <p className="text-xs text-slate-500 mt-1">
                        {item.snippet.channelTitle}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleSaveResource(
                          item,
                          "video"
                        )
                      }
                      className="
                        flex-shrink-0
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:text-indigo-300
                        hover:bg-indigo-500/10
                        transition-colors
                      "
                      title="Save resource"
                    >
                      <FiPlus size={17} />
                    </button>
                  </div>
                ))}

              </div>
            </section>
          )}

          {/* ==================================================
              Articles
          ================================================== */}

          {mediumResults.length > 0 && (
            <section>

              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-slate-300">
                  Articles
                </h2>

                <span className="text-xs text-slate-600">
                  {mediumResults.length}
                </span>
              </div>

              <div className="space-y-2">

                {mediumResults.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-xl
                      bg-slate-950/50
                      border border-slate-800/70
                      hover:border-slate-700
                      transition-colors
                    "
                  >
                    <div className="min-w-0 flex-1">

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          block
                          text-sm
                          font-medium
                          text-slate-200
                          hover:text-indigo-300
                          truncate
                          transition-colors
                        "
                      >
                        {item.title}
                      </a>

                      {item.author && (
                        <p className="text-xs text-slate-500 mt-1">
                          {item.author}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        handleSaveResource(
                          item,
                          "article"
                        )
                      }
                      className="
                        flex-shrink-0
                        p-2
                        rounded-lg
                        text-slate-500
                        hover:text-indigo-300
                        hover:bg-indigo-500/10
                        transition-colors
                      "
                      title="Save resource"
                    >
                      <FiPlus size={17} />
                    </button>
                  </div>
                ))}

              </div>
            </section>
          )}

          {/* No results */}

          {!loading &&
            browseQuery.trim() &&
            youtubeResults.length === 0 &&
            mediumResults.length === 0 && (
              <div className="py-14 text-center">
                <FiSearch
                  className="mx-auto mb-3 text-slate-600"
                  size={22}
                />

                <p className="text-sm text-slate-400">
                  No results found.
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  Try a different topic or search phrase.
                </p>
              </div>
            )}

        </div>
      )}

      {/* ==================================================
          AI NOTE MODAL
      ================================================== */}

      {selectedNote && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-slate-950/80
            backdrop-blur-sm
          "
          onClick={() => setSelectedNote(null)}
        >
          <div
            className="
              w-full
              max-w-3xl
              max-h-[75vh]
              bg-slate-900
              border border-slate-800
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal header */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                px-5
                py-4
                border-b border-slate-800
              "
            >
              <div className="min-w-0">

                <p className="text-[10px] uppercase tracking-wider text-violet-400/80 font-semibold mb-1">
                  AI Note
                </p>

                <h2 className="text-base font-semibold text-slate-100 truncate">
                  {selectedNote.title}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedNote(null)
                }
                className="
                  flex-shrink-0
                  p-2
                  rounded-lg
                  text-slate-500
                  hover:text-slate-200
                  hover:bg-slate-800
                  transition-colors
                "
                title="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal content */}

            <div
              className="
                p-6
                overflow-y-auto
                theme-scroll
                max-h-[60vh]
                prose
                prose-invert
                prose-sm
                prose-slate
                max-w-none
              "
            >
              <ReactMarkdown>
                {selectedNote.description}
              </ReactMarkdown>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;