import { motion } from "framer-motion";
import { Trophy, Target, Clock, ArrowRight, RotateCcw, XCircle } from "lucide-react";

const GameSummary = ({ stats, mistakes, onRestart, onBackToMenu }) => {
  const { correct, incorrect, wpm, elapsedTime, hintsUsed } = stats;
  const accuracy =
    correct + incorrect > 0
      ? Math.round((correct / (correct + incorrect)) * 100)
      : 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Performance rating
  const getRating = () => {
    if (accuracy >= 90 && wpm >= 30) return { label: "Mükemmel!", color: "#22c55e", emoji: "🏆" };
    if (accuracy >= 75 && wpm >= 20) return { label: "Harika!", color: "#3b82f6", emoji: "⭐" };
    if (accuracy >= 60) return { label: "İyi!", color: "#e2b714", emoji: "👍" };
    return { label: "Pratik Yap!", color: "#ef4444", emoji: "💪" };
  };

  const rating = getRating();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl flex flex-col items-center gap-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          {rating.emoji}
        </motion.div>
        <h2
          className="text-4xl font-bold mb-2"
          style={{ color: rating.color }}
        >
          {rating.label}
        </h2>
        <p className="text-[#7a7a7a]">Oyun tamamlandı</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-[#1a1a1a] rounded-xl p-5 flex flex-col items-center">
          <Trophy size={24} className="text-[#e2b714] mb-2" />
          <span className="text-3xl font-bold text-[#e8e8e8]">{wpm}</span>
          <span className="text-sm text-[#7a7a7a]">WPM</span>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 flex flex-col items-center">
          <Target size={24} className="text-[#22c55e] mb-2" />
          <span className="text-3xl font-bold text-[#e8e8e8]">{accuracy}%</span>
          <span className="text-sm text-[#7a7a7a]">Doğruluk</span>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 flex flex-col items-center">
          <Clock size={24} className="text-[#3b82f6] mb-2" />
          <span className="text-3xl font-bold text-[#e8e8e8]">
            {formatTime(elapsedTime)}
          </span>
          <span className="text-sm text-[#7a7a7a]">Süre</span>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <span className="text-[#22c55e] font-bold">{correct}</span>
            <span className="text-[#4a4a4a]">/</span>
            <span className="text-[#ef4444] font-bold">{incorrect}</span>
          </div>
          <span className="text-3xl font-bold text-[#e8e8e8]">
            {correct + incorrect}
          </span>
          <span className="text-sm text-[#7a7a7a]">Toplam Kelime</span>
        </div>
      </div>

      {/* Hints Used */}
      {hintsUsed > 0 && (
        <div className="text-[#7a7a7a] text-sm">
          İpucu kullanıldı: <span className="text-[#e2b714]">{hintsUsed}</span>
        </div>
      )}

      {/* Mistakes List */}
      {mistakes.length > 0 && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-[#ef4444]" />
            <span className="text-[#7a7a7a] text-sm">
              Hata yapılan kelimeler ({mistakes.length})
            </span>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 max-h-48 overflow-y-auto">
            <div className="grid gap-2">
              {mistakes.map((mistake, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2 px-3 bg-[#252525] rounded-lg"
                >
                  <span className="text-[#e8e8e8]">{mistake.tr}</span>
                  <ArrowRight size={14} className="text-[#4a4a4a]" />
                  <span className="text-[#22c55e]">{mistake.en}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBackToMenu}
          className="px-6 py-3 bg-[#252525] text-[#e8e8e8] rounded-lg font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          Menü
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="px-6 py-3 bg-[#e2b714] text-[#0d0d0d] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#d4a912] transition-colors"
        >
          <RotateCcw size={18} />
          Tekrar Oyna
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameSummary;
