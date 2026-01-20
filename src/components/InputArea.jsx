import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const InputArea = ({
  value,
  onChange,
  onSubmit,
  onHint,
  isError,
  disabled,
}) => {
  const inputRef = useRef(null);

  // Auto-focus on mount and after each word
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      onHint();
    }
  };

  return (
    <motion.div
      animate={isError ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-xl"
    >
      <div
        className={`relative border-b-2 transition-colors duration-200 ${
          isError
            ? "border-[#ef4444]"
            : "border-[#4a4a4a] focus-within:border-[#e2b714]"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={`w-full text-center text-3xl md:text-4xl py-4 bg-transparent placeholder-[#3a3a3a] transition-colors duration-200 ${
            isError ? "text-[#ef4444]" : "text-[#e8e8e8]"
          }`}
        />

        {/* Cursor Indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#4a4a4a] text-xs">
          <kbd className="px-2 py-1 bg-[#252525] rounded text-[#7a7a7a]">
            ENTER
          </kbd>
        </div>
      </div>

      {/* Error Message */}
      {isError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#ef4444] text-sm mt-3 text-center"
        >
          Yanlış! Tekrar dene.
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputArea;
