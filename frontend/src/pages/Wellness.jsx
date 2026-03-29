// 💜 Person 4 (Wellness Engine) — build your mood tracker + Claude API UI here
export default function Wellness() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div
        className="w-full max-w-xl rounded-2xl p-8 text-center"
        style={{
          background: "rgba(109,40,217,0.07)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        <div className="text-4xl mb-4">♡</div>
        <h2 className="text-2xl font-bold text-violet-200 mb-2">Wellness Dashboard</h2>
        <p style={{ color: "rgba(196,181,253,0.5)" }} className="text-sm">
          Person 4 — Mood tracker + Claude AI nudge + chart goes here
        </p>
      </div>
    </div>
  );
}
