import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWords, shuffleArray } from "./data/words";
import "./index.css";

// Game States
const GAME_STATE = {
  MENU: "menu",
  PLAYING: "playing",
  FINISHED: "finished",
};

// Level Data
const levels = [
  { id: "A1", label: "A1", desc: "Başlangıç", difficulty: 1 },
  { id: "A2", label: "A2", desc: "Temel", difficulty: 2 },
  { id: "B1", label: "B1", desc: "Orta", difficulty: 3 },
  { id: "B2", label: "B2", desc: "Orta Üstü", difficulty: 4 },
];

// Motivational Slogans - English Learning Focused
const slogans = [
  "Kelime hazineni genişletmeye hazır mısın?",
  "Her gün yeni bir İngilizce kelime öğren.",
  "İngilizce reflekslerini güçlendir.",
  "Pratik yap, kelimeleri kalıcı hale getir.",
  "Kelimeler senin süper gücün olsun!",
  "Her kelime yeni bir kapı açar.",
  "Düşün Türkçe, yaz İngilizce.",
  "İngilizce öğrenmek hiç bu kadar kolay olmamıştı!",
];

function App() {
  // Game State
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Word State
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // Feedback State
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hintText, setHintText] = useState("");

  // Score State
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Timer State
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Current Word
  const currentWord = words[currentIndex];

  // Timer Effect
  useEffect(() => {
    let interval;
    if (gameState === GAME_STATE.PLAYING && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  // Calculate WPM
  const calculateWPM = useCallback(() => {
    if (elapsedTime === 0) return 0;
    return Math.round((correct / elapsedTime) * 60);
  }, [correct, elapsedTime]);

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start Game
  const handleStart = () => {
    if (!selectedLevel) return;

    const levelWords = shuffleArray(getWords(selectedLevel));
    setWords(levelWords);
    setCurrentIndex(0);
    setInputValue("");
    setCorrect(0);
    setIncorrect(0);
    setMistakes([]);
    setHintsUsed(0);
    setHintText("");
    setIsSuccess(false);
    setIsError(false);
    setElapsedTime(0);
    setStartTime(Date.now());
    setGameState(GAME_STATE.PLAYING);
  };

  // Submit Answer
  const handleSubmit = () => {
    if (!currentWord || !inputValue.trim()) return;

    const answer = inputValue.trim().toLowerCase();
    const correctAnswer = currentWord.en.toLowerCase();

    if (answer === correctAnswer) {
      setIsSuccess(true);
      setIsError(false);
      setCorrect((prev) => prev + 1);

      setTimeout(() => {
        setIsSuccess(false);
        setInputValue("");
        setHintText("");

        if (currentIndex + 1 >= words.length) {
          setGameState(GAME_STATE.FINISHED);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 300);
    } else {
      setIsError(true);
      setIncorrect((prev) => prev + 1);

      if (!mistakes.find((m) => m.tr === currentWord.tr)) {
        setMistakes((prev) => [...prev, currentWord]);
      }

      setTimeout(() => {
        setIsError(false);
        setInputValue("");
      }, 400);
    }
  };

  // Hint System
  const handleHint = () => {
    if (!currentWord) return;

    const nextHintLength = hintText.length + 1;
    if (nextHintLength <= currentWord.en.length) {
      setHintText(currentWord.en.slice(0, nextHintLength));
      setHintsUsed((prev) => prev + 1);
    }
  };

  // Handle Key Down
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleHint();
    } else if (e.key === "Escape") {
      handleBackToMenu();
    }
  };

  // Back to Menu
  const handleBackToMenu = () => {
    setGameState(GAME_STATE.MENU);
    setSelectedLevel(null);
  };

  // Accuracy
  const accuracy =
    correct + incorrect > 0
      ? Math.round((correct / (correct + incorrect)) * 100)
      : 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          GEOMETRIC BACKGROUND
          ═══════════════════════════════════════════════════════════ */}
      <div className="geometric-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-pattern" />
        <div className="diagonal-lines" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════
              MENU STATE
              ═══════════════════════════════════════════════════════════ */}
          {gameState === GAME_STATE.MENU && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-between min-h-[80vh] py-8"
            >
              {/* ═══ LOGO ═══ */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <h1
                  className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <span className="neon-coral">En</span>
                  <span className="neon-cyan">TR</span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-2 text-lg md:text-xl tracking-[0.3em] uppercase shimmer-text"
                  style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 300 }}
                >
                  Refleks İngilizce
                </motion.p>
              </motion.div>

              {/* ═══ SLOGAN ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center mt-12 mb-12"
              >
                <p
                  className="text-xl md:text-2xl lg:text-3xl slogan-text font-medium"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {slogans[Math.floor(Math.random() * slogans.length)]}
                </p>
              </motion.div>

              {/* ═══ LEVEL SELECTOR ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16"
              >
                {levels.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`glass-card group relative w-28 h-36 md:w-32 md:h-40 flex flex-col items-center justify-center cursor-pointer ${
                      selectedLevel === level.id ? "selected" : ""
                    }`}
                  >
                    <span
                      className={`text-4xl md:text-5xl font-bold tracking-tight transition-all duration-300 ${
                        selectedLevel === level.id
                          ? "text-[#4ECDC4]"
                          : "text-[#8b9cb5] group-hover:text-[#f0f0f0]"
                      }`}
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {level.label}
                    </span>

                    <span
                      className={`mt-2 text-sm tracking-wider uppercase transition-all duration-300 ${
                        selectedLevel === level.id
                          ? "text-[#4ECDC4]/80"
                          : "text-[#4a5568] group-hover:text-[#8b9cb5]"
                      }`}
                    >
                      {level.desc}
                    </span>

                    <div className="flex gap-1 mt-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i < level.difficulty
                              ? selectedLevel === level.id
                                ? "bg-[#4ECDC4]"
                                : "bg-[#FF6B6B]/60 group-hover:bg-[#FF6B6B]"
                              : "bg-[#2a3441]"
                          }`}
                        />
                      ))}
                    </div>

                    {selectedLevel === level.id && (
                      <motion.div
                        layoutId="selection-ring"
                        className="absolute inset-0 rounded-2xl border-2 border-[#4ECDC4]/50 pointer-events-none"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ boxShadow: "0 0 30px rgba(78, 205, 196, 0.2)" }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>

              {/* ═══ HERO START BUTTON ═══ */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 150 }}
                className="w-full max-w-xl mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  disabled={!selectedLevel}
                  className={`w-full py-7 text-3xl md:text-4xl font-black tracking-wider uppercase ${
                    selectedLevel
                      ? "hero-button text-white cursor-pointer"
                      : "hero-button-disabled text-[#4a5568] rounded-2xl"
                  }`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <span className="relative z-10">
                    {selectedLevel ? "BAŞLA" : "Seviye Seç"}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              PLAYING STATE - Neon Game Screen
              ═══════════════════════════════════════════════════════════ */}
          {gameState === GAME_STATE.PLAYING && currentWord && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-3xl min-h-[70vh] justify-between py-8"
            >
              {/* ═══ NEON SCOREBOARD ═══ */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-4 md:gap-6 w-full"
              >
                {/* SÜRE - Red */}
                <div className="neon-box neon-box-red text-center min-w-[90px]">
                  <p className="box-label text-xs uppercase tracking-wider font-bold mb-1">Süre</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {formatTime(elapsedTime)}
                  </p>
                </div>

                {/* DOĞRU - Green */}
                <div className="neon-box neon-box-green text-center min-w-[90px]">
                  <p className="box-label text-xs uppercase tracking-wider font-bold mb-1">Doğru</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {correct}
                  </p>
                </div>

                {/* YANLIŞ - Orange */}
                <div className="neon-box neon-box-orange text-center min-w-[90px]">
                  <p className="box-label text-xs uppercase tracking-wider font-bold mb-1">Yanlış</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {incorrect}
                  </p>
                </div>

                {/* WPM - Blue */}
                <div className="neon-box neon-box-blue text-center min-w-[90px]">
                  <p className="box-label text-xs uppercase tracking-wider font-bold mb-1">WPM</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {calculateWPM()}
                  </p>
                </div>
              </motion.div>

              {/* ═══ GIANT WORD DISPLAY ═══ */}
              <motion.div
                key={currentWord.tr}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-center my-12"
              >
                <h2
                  className={`text-7xl md:text-8xl lg:text-9xl font-black tracking-tight ${
                    isSuccess ? "neon-cyan" : isError ? "" : "giant-word"
                  }`}
                  style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    ...(isError && {
                      color: '#FF6B6B',
                      animation: 'none'
                    })
                  }}
                >
                  {currentWord.tr}
                </h2>

                {/* Hint Display */}
                {hintText && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-2xl"
                    style={{ fontFamily: "'Fira Code', monospace" }}
                  >
                    <span className="text-[#4ECDC4]">{hintText}</span>
                    <span className="text-[#3a4556]">{"_".repeat(Math.max(0, currentWord.en.length - hintText.length))}</span>
                  </motion.p>
                )}

                {/* Progress Indicator */}
                <p className="mt-4 text-[#4a5568] text-sm">
                  {currentIndex + 1} / {words.length}
                </p>
              </motion.div>

              {/* ═══ NEON INPUT BOX ═══ */}
              <motion.div
                animate={isError ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="İngilizce yaz..."
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full text-center text-3xl py-5 px-6 outline-none ${
                    isError
                      ? "neon-input neon-input-error"
                      : isSuccess
                      ? "neon-input neon-input-success"
                      : "neon-input"
                  }`}
                  style={{ fontFamily: "'Fira Code', 'Rajdhani', monospace" }}
                />
              </motion.div>

              {/* ═══ KEYBOARD SHORTCUTS ═══ */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-6 md:gap-10 mt-8"
              >
                <div className="flex items-center gap-2">
                  <span className="kbd kbd-blue">ENTER</span>
                  <span className="text-[#6b7280] text-sm">onayla</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="kbd kbd-yellow">TAB</span>
                  <span className="text-[#6b7280] text-sm">ipucu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="kbd kbd-red">ESC</span>
                  <span className="text-[#6b7280] text-sm">çık</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              FINISHED STATE
              ═══════════════════════════════════════════════════════════ */}
          {gameState === GAME_STATE.FINISHED && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8 w-full max-w-xl"
            >
              {/* Result Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "⭐" : "💪"}
                </motion.div>
                <h2
                  className={`text-4xl font-bold ${
                    accuracy >= 80 ? "text-[#4ECDC4]" : accuracy >= 50 ? "text-[#FFE66D]" : "text-[#FF6B6B]"
                  }`}
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {accuracy >= 80 ? "Mükemmel!" : accuracy >= 50 ? "İyi!" : "Pratik Yap!"}
                </h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="glass-card p-5 rounded-xl text-center">
                  <p className="text-3xl font-bold text-[#FFE66D]" style={{ fontFamily: "'Orbitron', sans-serif" }}>{calculateWPM()}</p>
                  <p className="text-sm text-[#8b9cb5]">WPM</p>
                </div>
                <div className="glass-card p-5 rounded-xl text-center">
                  <p className="text-3xl font-bold text-[#4ECDC4]" style={{ fontFamily: "'Orbitron', sans-serif" }}>{accuracy}%</p>
                  <p className="text-sm text-[#8b9cb5]">Doğruluk</p>
                </div>
                <div className="glass-card p-5 rounded-xl text-center">
                  <p className="text-3xl font-bold text-[#f0f0f0]" style={{ fontFamily: "'Orbitron', sans-serif" }}>{formatTime(elapsedTime)}</p>
                  <p className="text-sm text-[#8b9cb5]">Süre</p>
                </div>
                <div className="glass-card p-5 rounded-xl text-center">
                  <p className="text-3xl font-bold text-[#f0f0f0]" style={{ fontFamily: "'Orbitron', sans-serif" }}>{correct}/{correct + incorrect}</p>
                  <p className="text-sm text-[#8b9cb5]">Doğru/Toplam</p>
                </div>
              </div>

              {/* Mistake List */}
              {mistakes.length > 0 && (
                <div className="w-full glass-card p-4 rounded-xl max-h-48 overflow-y-auto">
                  <p className="text-[#FF6B6B] text-sm mb-3">Hata yapılan kelimeler:</p>
                  <div className="space-y-2">
                    {mistakes.map((m, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-[#f0f0f0]">{m.tr}</span>
                        <span className="text-[#4ECDC4]">{m.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBackToMenu}
                  className="px-8 py-3 glass-card rounded-xl text-[#f0f0f0] font-medium hover:bg-[rgba(255,255,255,0.08)] transition-all"
                >
                  Menü
                </button>
                <button
                  onClick={handleStart}
                  className="px-8 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-xl text-white font-bold hover:shadow-lg hover:shadow-[#4ECDC4]/25 transition-all"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Tekrar Oyna
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
