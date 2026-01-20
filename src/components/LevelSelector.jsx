import { motion } from "framer-motion";
import { Zap, BookOpen, Brain, Award } from "lucide-react";

const levels = [
  { id: "A1", label: "A1", desc: "Başlangıç", icon: Zap, color: "#22c55e" },
  { id: "A2", label: "A2", desc: "Temel", icon: BookOpen, color: "#3b82f6" },
  { id: "B1", label: "B1", desc: "Orta", icon: Brain, color: "#e2b714" },
  { id: "B2", label: "B2", desc: "İleri", icon: Award, color: "#ef4444" },
  { id: "mixed", label: "MIX", desc: "Karışık", icon: null, color: "#2dd4bf" },
];

const LevelSelector = ({ selectedLevel, onSelectLevel, onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-8"
    >
      {/* Title */}
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#e8e8e8] tracking-tight mb-2">
          En<span className="text-[#e2b714]">TR</span>
        </h1>
        <p className="text-[#7a7a7a] text-lg">
          Türkçe → İngilizce • Hızlı Yazma
        </p>
      </div>

      {/* Level Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-2xl">
        {levels.map((level, index) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === level.id;

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelectLevel(level.id)}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "bg-[#252525] border-[#e2b714]"
                  : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#4a4a4a] hover:bg-[#202020]"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {Icon ? (
                  <Icon
                    size={24}
                    style={{ color: isSelected ? level.color : "#7a7a7a" }}
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, #22c55e, #3b82f6, #e2b714, #ef4444)`
                        : "#7a7a7a",
                    }}
                  />
                )}
                <span
                  className={`text-xl font-bold ${
                    isSelected ? "text-[#e8e8e8]" : "text-[#7a7a7a]"
                  }`}
                >
                  {level.label}
                </span>
                <span className="text-xs text-[#4a4a4a]">{level.desc}</span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  layoutId="levelIndicator"
                  className="absolute inset-0 rounded-lg border-2 border-[#e2b714]"
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        disabled={!selectedLevel}
        className={`px-12 py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
          selectedLevel
            ? "bg-[#e2b714] text-[#0d0d0d] hover:bg-[#d4a912]"
            : "bg-[#2a2a2a] text-[#4a4a4a] cursor-not-allowed"
        }`}
      >
        Başla
      </motion.button>

      {/* Instructions */}
      <div className="text-center text-[#4a4a4a] text-sm max-w-md">
        <p>
          Ekranda gösterilen Türkçe kelimenin İngilizce karşılığını yaz.
          <br />
          <span className="text-[#e2b714]">ENTER</span> veya{" "}
          <span className="text-[#e2b714]">SPACE</span> ile onayla,{" "}
          <span className="text-[#e2b714]">TAB</span> ile ipucu al.
        </p>
      </div>
    </motion.div>
  );
};

export default LevelSelector;
