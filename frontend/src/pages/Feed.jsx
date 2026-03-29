import { useState, useEffect } from "react";
import WellnessTrigger from "../components/WellnessTrigger"; // Person 4's component

const API = "http://localhost:5000";

export default function Feed() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [blocked, setBlocked] = useState(null); // { score } | null
  const [loading, setLoading] = useState(false);
  const [showWellness, setShowWellness] = useState(false);

  const token = localStorage.getItem("shieldher_token");
  const pseudonym = localStorage.getItem("shieldher_pseudonym");

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    try {
      const res = await fetch(`${API}/api/posts/feed`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Feed load error:", err);
    }
  }

  async function handleSend() {
    if (!content.trim()) return;
    setLoading(true);
    setBlocked(null);

    try {
      const res = await fetch(`${API}/api/posts/check-and-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (data.blocked) {
        setBlocked({ score: data.score });
        setShowWellness(true); // Trigger Person 4's wellness popup
      } else {
        setPosts((prev) => [data.post, ...prev]);
        setContent("");
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleMoodSelected(score) {
    // Person 4's WellnessTrigger calls this when a mood is picked
    console.log("Mood selected:", score);
    setShowWellness(false);
  }

  return (
    <div className="min-h-screen bg-[#0b0e1a] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-xl font-semibold text-purple-300">
            ShieldHer Feed
          </h1>
          {pseudonym && (
            <span className="ml-auto text-sm text-slate-400">
              Posting as <span className="text-teal-400">@{pseudonym}</span>
            </span>
          )}
        </div>

        {/* Composer */}
        <div className="bg-[#131929] border border-purple-900/40 rounded-2xl p-4 space-y-3">
          <textarea
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none text-sm leading-relaxed min-h-[80px]"
            placeholder="Express yourself..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={loading || !content.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {loading ? "Checking..." : "Send"}
            </button>
          </div>
        </div>

        {/* Blocked Alert */}
        {blocked && (
          <div className="bg-red-950/60 border border-red-700/50 rounded-2xl p-5 space-y-1">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <span>🛡️</span>
              <span>ShieldHer intercepted this message</span>
            </div>
            <p className="text-sm text-red-300/80">
              It contained harmful content and was not delivered.
            </p>
            <p className="text-xs text-red-400/60 mt-1">
              Toxicity score:{" "}
              <span className="font-mono">
                {Math.round(blocked.score * 100)}%
              </span>
            </p>
          </div>
        )}

        {/* Feed Posts */}
        <div className="space-y-3">
          {posts.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-10">
              No posts yet. Be the first to share safely.
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-[#131929] border border-slate-700/30 rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-teal-400">
                  🛡️ @{post.authorPseudonym}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-700/30">
                  ✓ Safe
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {post.content}
              </p>
              <p className="text-xs text-slate-500">
                {new Date(post.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Popup — from Person 4 */}
      <WellnessTrigger
        isVisible={showWellness}
        onClose={() => setShowWellness(false)}
        onMoodSelected={handleMoodSelected}
      />
    </div>
  );
}