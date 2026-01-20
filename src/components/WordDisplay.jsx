import { motion } from "framer-motion";

const WordDisplay = ({ word, isSuccess, isError, hintText }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Turkish Word */}
      <motion.div
        key={word?.tr}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative"
      >
        <h1
          className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-colors duration-200 ${
            isSuccess
              ? "text-[#22c55e]"
              : isError
              ? "text-[#ef4444]"
              : "text-[#e8e8e8]"
          }`}
        >
          {word?.tr}
        </h1>

        {/* Success Glow Effect */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.4] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-[#22c55e] blur-3xl -z-10"
          />
        )}
      </motion.div>

      {/* Hint Display */}
      {hintText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#7a7a7a] text-xl tracking-wider"
        >
          <span className="text-[#e2b714]">{hintText}</span>
          <span className="opacity-30">
            {"_".repeat(Math.max(0, (word?.en?.length || 0) - hintText.length))}
          </span>
        </motion.div>
      )}

      {/* Instruction */}
      <p className="text-[#4a4a4a] text-sm mt-2">
        İngilizce karşılığını yaz • <span className="text-[#e2b714]">TAB</span>{" "}
        ipucu al
      </p>
    </div>
  );
};

export default WordDisplay;
