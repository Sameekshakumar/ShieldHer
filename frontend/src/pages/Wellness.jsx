// WellnessTrigger.jsx
// Reusable popup for Person 2 (Feed) to trigger after a message is blocked.
// Usage: <WellnessTrigger isVisible={true} onClose={() => {}} onMoodSelected={(score) => {}} />

const EMOJIS = [
  { score: 1, emoji: "😢", label: "Very distressed" },
  { score: 2, emoji: "😟", label: "Struggling" },
  { score: 3, emoji: "😐", label: "Neutral" },
  { score: 4, emoji: "🙂", label: "Okay" },
  { score: 5, emoji: "😊", label: "Feeling good" },
];

export default function WellnessTrigger({ isVisible, onClose, onMoodSelected }) {
  if (!isVisible) return null;

  function handleEmojiClick(score) {
    onMoodSelected(score);
    onClose();
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal card */}
      <div className="bg-[#11112a] border border-purple-500/50 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(168,85,247,0.3)]">

        {/* Shield icon + title */}
        <div className="text-center mb-4">
          <span className="text-4xl">🛡️</span>
          <h2 className="text-lg font-bold text-purple-300 mt-2">
            ShieldHer protected you
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            A harmful message was blocked before it reached you.
            <br />How are you feeling?
          </p>
        </div>

        {/* Emoji row */}
        <div className="flex justify-center gap-3 mt-4">
          {EMOJIS.map(({ score, emoji, label }) => (
            <button
              key={score}
              onClick={() => handleEmojiClick(score)}
              title={label}
              className="flex flex-col items-center gap-1 p-3 rounded-xl text-3xl
                hover:bg-purple-900/50 hover:scale-110 transition-all duration-150
                active:scale-95"
            >
              {emoji}
              <span className="text-xs text-gray-500">{score}</span>
            </button>
          ))}
        </div>

        {/* Skip button */}
        <div className="text-center mt-5">
          <button
            onClick={onClose}
            className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}