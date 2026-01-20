import { motion } from "framer-motion";
import { Timer, Check, X, Zap } from "lucide-react";

const ScoreBoard = ({ correct, incorrect, wpm, elapsedTime, totalWords }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const accuracy =
    correct + incorrect > 0
      ? Math.round((correct / (correct + incorrect)) * 100)
      : 100;

  const progress = totalWords > 0 ? ((correct + incorrect) / totalWords) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      {/* Progress Bar */}
      <div className="h-1 bg-[#1a1a1a] rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-[#e2b714] to-[#2dd4bf]"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Time */}
        <div className="flex flex-col items-center gap-1 p-3 bg-[#1a1a1a] rounded-lg">
          <Timer size={18} className="text-[#7a7a7a]" />
          <span className="text-2xl font-bold text-[#e8e8e8]">
            {formatTime(elapsedTime)}
          </span>
          <span className="text-xs text-[#4a4a4a]">Süre</span>
        </div>

        {/* Correct */}
        <div className="flex flex-col items-center gap-1 p-3 bg-[#1a1a1a] rounded-lg">
          <Check size={18} className="text-[#22c55e]" />
          <span className="text-2xl font-bold text-[#22c55e]">{correct}</span>
          <span className="text-xs text-[#4a4a4a]">Doğru</span>
        </div>

        {/* Incorrect */}
        <div className="flex flex-col items-center gap-1 p-3 bg-[#1a1a1a] rounded-lg">
          <X size={18} className="text-[#ef4444]" />
          <span className="text-2xl font-bold text-[#ef4444]">{incorrect}</span>
          <span className="text-xs text-[#4a4a4a]">Yanlış</span>
        </div>

        {/* WPM */}
        <div className="flex flex-col items-center gap-1 p-3 bg-[#1a1a1a] rounded-lg">
          <Zap size={18} className="text-[#e2b714]" />
          <span className="text-2xl font-bold text-[#e2b714]">{wpm}</span>
          <span className="text-xs text-[#4a4a4a]">WPM</span>
        </div>
      </div>

      {/* Accuracy Bar */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-[#4a4a4a]">Doğruluk</span>
        <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              accuracy >= 80
                ? "bg-[#22c55e]"
                : accuracy >= 50
                ? "bg-[#e2b714]"
                : "bg-[#ef4444]"
            }`}
          />
        </div>
        <span className="text-sm font-medium text-[#e8e8e8]">{accuracy}%</span>
      </div>
    </motion.div>
  );
};

export default ScoreBoard;
