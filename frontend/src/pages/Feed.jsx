// 🛡️ Person 2 (Toxicity Shield) — build your feed + Perspective API UI here
export default function Feed() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div
        className="w-full max-w-2xl rounded-2xl p-8 text-center"
        style={{
          background: "rgba(109,40,217,0.07)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        <div className="text-4xl mb-4">◈</div>
        <h2 className="text-2xl font-bold text-violet-200 mb-2">Safe Feed</h2>
        <p style={{ color: "rgba(196,181,253,0.5)" }} className="text-sm">
          Person 2 — Toxicity detection feed + post UI goes here (Perspective API)
        </p>
      </div>
    </div>
  );
}
