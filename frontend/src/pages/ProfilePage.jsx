import { useEffect, useRef, useState } from "react";
import { FiCamera, FiKey, FiSave, FiTrash2, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../utils/api";
import { useGeminiKey } from "../context/GeminiKeyContext";

const ProfilePage = () => {
  const { geminiKey, saveGeminiKey, clearGeminiKey } = useGeminiKey();

  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/user/profile/");
        setProfile(data);
        setDisplayName(data.display_name || "");
        setUsername(data.username || "");
        setPreview(data.avatar || "");
      } catch (error) {
        console.error("Failed to load profile:", error);
        setMessage("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

const handleChangePassword = async () => {
  if (changingPassword) return;

  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordMessage("Please fill in all password fields.");
    setPasswordMessageType("error");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordMessage("New passwords do not match.");
    setPasswordMessageType("error");
    return;
  }

  setChangingPassword(true);
  setPasswordMessage("");
  setPasswordMessageType("");

  try {
    await api.post("/user/change-password/", {
      current_password: currentPassword,
      new_password: newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage("Password changed successfully.");
    setPasswordMessageType("success");
  } catch (error) {
    console.error("Failed to change password:", error);

    setPasswordMessage(
      error.response?.data?.error || "Unable to change your password."
    );
    setPasswordMessageType("error");
  } finally {
    setChangingPassword(false);
  }
};


  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const removeAvatar = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setAvatarFile(null);
    setPreview("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("display_name", displayName.trim());
      formData.append("username", username.trim());
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (!preview && profile?.avatar) {
        formData.append("avatar", "");
      }

      const { data } = await api.patch("/user/profile/", formData);

      setProfile(data);
      setDisplayName(data.display_name || "");
      setAvatarFile(null);
      setPreview(data.avatar || "");
      setUsername(data.username || "");

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeminiKey = () => {
    if (!geminiKey.trim()) {
      clearGeminiKey();
      setMessage("Gemini API key removed.");
      return;
    }

    saveGeminiKey(geminiKey);
    setMessage("Gemini API key saved in this browser session.");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">

      {/* Profile Section */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Profile
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Customize how you appear in ProLearn.
          </p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

            {/* Avatar Upload Container */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-indigo-600/20 border-2 border-slate-700/80 flex items-center justify-center text-indigo-400 shadow-inner">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-4xl" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-slate-200 transition-all shadow-sm"
              >
                <FiCamera className="text-indigo-400" />
                Change photo
              </button>

              {preview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <FiTrash2 />
                  Remove photo
                </button>
              )}
            </div>

            {/* Profile Inputs */}
            <div className="flex-1 w-full space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={150}
                  placeholder="Choose a username"
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display name
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={100}
                  placeholder="How should we call you?"
                  className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
              >
                <FiSave />
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Security
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Change your ProLearn account password.
          </p>
        </div>

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current password
            </label>

            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="current-password"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={
                  showCurrentPassword ? "Hide current password" : "Show current password"
                }
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New password
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm new password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`text-sm font-medium ${
                passwordMessageType === "success"
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {passwordMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
          >
            <FiSave />
            {changingPassword ? "Changing..." : "Change password"}
          </button>
        </div>
      </section>

      {/* Gemini Section */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
            <FiKey className="text-xl" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Gemini API Key
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Bring your own Gemini API key to unlock full AI capabilities.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <input
            type="password"
            value={geminiKey}
            onChange={(e) => saveGeminiKey(e.target.value)}
            placeholder="Paste your Gemini API key"
            autoComplete="off"
            className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 max-w-sm">
              Your key is kept locally in this browser session and is never stored on the ProLearn backend servers.
            </p>

            <div className="flex gap-2.5 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearGeminiKey}
                disabled={!geminiKey}
                className="px-4 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-slate-200 disabled:opacity-40 transition-all"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleSaveGeminiKey}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                <FiKey />
                Save key
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <p className="text-xs text-amber-300/90 font-medium">
              🔒 BYOK Security: ProLearn does not receive or log your Gemini API key. All generations execute securely from your client browser session.
            </p>
          </div>
        </div>
      </section>

      {/* Status Message Banner */}
      {message && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md px-5 py-4 text-sm text-slate-200 shadow-xl flex items-center justify-between animate-fadeIn">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;