import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_WRONG = 6;
const TIMER_SECONDS = 120;

function ScoreScreen({ score, won, word, timeLeft, attemptsLeft, onPlayAgain }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg animate-slide-up">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 80,
            color: won ? "var(--vault-green)" : "var(--vault-red)",
            lineHeight: 1,
            marginBottom: 8,
          }}
          className="animate-flicker"
        >
          {won ? "CRACKED" : "LOCKED OUT"}
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            color: "var(--vault-muted)",
            marginBottom: 32,
            letterSpacing: "0.1em",
          }}
        >
          THE WORD WAS:{" "}
          <span style={{ color: "var(--vault-amber)", fontFamily: "var(--font-display)", fontSize: 24 }}>{word}</span>
        </div>

        {/* Score box */}
        <div
          style={{
            border: `1px solid ${won ? "var(--vault-green)" : "var(--vault-red)"}`,
            padding: 32,
            marginBottom: 32,
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 72, color: won ? "var(--vault-green)" : "var(--vault-red)" }}>
            {score}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.2em" }}>
            PERFORMANCE SCORE
          </div>

          {won && (
            <div className="flex justify-center gap-8 mt-6">
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--vault-text)" }}>{timeLeft}s</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>TIME LEFT</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--vault-text)" }}>{attemptsLeft}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--vault-muted)" }}>LIVES LEFT</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            style={{
              background: "var(--vault-amber)",
              color: "#0a0a0f",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.12em",
              padding: "12px 32px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            BROWSE MORE →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlayGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [shakeTrigger, setShakeTrigger] = useState(null);
  const [revealTrigger, setRevealTrigger] = useState(null);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const timerRef = useRef(null);

  // Load game
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/games/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGame(data);
      } catch {
        navigate("/browse");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!game || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          endGame(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [game, gameOver]);

  const endGame = useCallback(
    async (didWin, finalGuessed = null, finalWrong = null) => {
      clearInterval(timerRef.current);
      setGameOver(true);
      setWon(didWin);

      const usedTimeLeft = TIMER_SECONDS - (TIMER_SECONDS - timeLeft);
      const attLeft = MAX_WRONG - (finalWrong ?? wrongGuesses);
      const computedScore = didWin ? Math.round(1000 + usedTimeLeft * 5 + attLeft * 100) : 0;
      setScore(computedScore);

      if (!scoreSubmitted) {
        setScoreSubmitted(true);
        try {
          const token = await getToken();
          await axios.post(
            "/api/scores",
            {
              gameId: id,
              word: game?.word,
              won: didWin,
              timeLeft: usedTimeLeft,
              attemptsLeft: attLeft,
              timeTaken: TIMER_SECONDS - usedTimeLeft,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Score submission failed", err);
        }
      }
    },
    [timeLeft, wrongGuesses, game, id, scoreSubmitted]
  );

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.has(letter)) return;

    const newGuessed = new Set([...guessedLetters, letter]);
    setGuessedLetters(newGuessed);

    const word = game.word.toUpperCase();
    const isCorrect = word.includes(letter);

    if (isCorrect) {
      setRevealTrigger(letter);
      setTimeout(() => setRevealTrigger(null), 400);

      // Check win: Remove spaces before validating if all letters are revealed
      const lettersOnly = word.replace(/\s/g, "").split("");
      const allRevealed = lettersOnly.every((l) => newGuessed.has(l));
      
      if (allRevealed) {
        endGame(true, newGuessed, wrongGuesses);
      }
    } else {
      setShakeTrigger(Date.now());
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= MAX_WRONG) {
        endGame(false, newGuessed, newWrong);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--vault-amber)" }} className="animate-flicker">
          DECRYPTING...
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <ScoreScreen
        score={score}
        won={won}
        word={game?.word}
        timeLeft={timeLeft}
        attemptsLeft={MAX_WRONG - wrongGuesses}
        onPlayAgain={() => navigate("/browse")}
      />
    );
  }

  const word = game?.word?.toUpperCase() || "";
  const remainingLives = MAX_WRONG - wrongGuesses;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 60 ? "var(--vault-green)" : timeLeft > 30 ? "var(--vault-amber)" : "var(--vault-red)";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.15em" }}>
            CREATED BY {game?.creatorName?.toUpperCase()}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {Array(MAX_WRONG).fill(null).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: i < remainingLives ? "var(--vault-red)" : "var(--vault-border)",
                  transition: "background 0.3s",
                }}
              />
            ))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", marginLeft: 6 }}>
              {remainingLives} LIVES
            </span>
          </div>

          {/* Timer */}
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: timerColor, minWidth: 60, textAlign: "right" }}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div style={{ height: 3, background: "var(--vault-border)", marginBottom: 32 }}>
        <div
          style={{
            height: "100%",
            width: `${timerPct}%`,
            background: timerColor,
            transition: "width 1s linear, background 0.3s",
          }}
        />
      </div>

      {/* Hint */}
      <div
        style={{
          background: "var(--vault-surface)",
          border: "1px solid var(--vault-border)",
          padding: "16px 20px",
          marginBottom: 40,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-amber)", letterSpacing: "0.12em" }}>
          HINT:{" "}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--vault-text)" }}>{game?.hint}</span>
      </div>

      {/* Word display - Now broken into distinct words to prevent bad wrapping */}
      <div
        className={shakeTrigger ? "animate-shake" : ""}
        key={shakeTrigger}
        style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}
      >
        {word.split(" ").map((wordSegment, wordIndex) => (
          <div key={wordIndex} style={{ display: "flex", gap: 10 }}>
            {wordSegment.split("").map((letter, i) => {
              const revealed = guessedLetters.has(letter);
              return (
                <div
                  key={i}
                  style={{
                    width: 52,
                    height: 64,
                    border: revealed ? "1px solid var(--vault-amber)" : "none",
                    borderBottom: "2px solid " + (revealed ? "var(--vault-amber)" : "var(--vault-muted)"),
                    background: revealed ? "rgba(245,166,35,0.08)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    color: "var(--vault-amber)",
                    transition: "all 0.2s",
                    animation: revealed && revealTrigger === letter ? "reveal-letter 0.35s ease forwards" : "none",
                  }}
                >
                  {revealed ? letter : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed}
              style={{
                width: 44,
                height: 44,
                background: isCorrect
                  ? "var(--vault-green)"
                  : isWrong
                  ? "var(--vault-surface)"
                  : "var(--vault-card)",
                border: isCorrect
                  ? "1px solid var(--vault-green)"
                  : isWrong
                  ? "1px solid var(--vault-border)"
                  : "1px solid var(--vault-border)",
                color: isCorrect
                  ? "#0a0a0f"
                  : isWrong
                  ? "var(--vault-border)"
                  : "var(--vault-text)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 600,
                cursor: isGuessed ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                transform: isGuessed ? "scale(0.95)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!isGuessed) {
                  e.target.style.background = "var(--vault-amber)";
                  e.target.style.color = "#0a0a0f";
                  e.target.style.borderColor = "var(--vault-amber)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isGuessed) {
                  e.target.style.background = "var(--vault-card)";
                  e.target.style.color = "var(--vault-text)";
                  e.target.style.borderColor = "var(--vault-border)";
                }
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Wrong guesses */}
      {wrongGuesses > 0 && (
        <div className="mt-8 text-center">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--vault-muted)", letterSpacing: "0.1em" }}>
            WRONG GUESSES:{" "}
          </span>
          {Array.from(guessedLetters)
            .filter((l) => !word.includes(l))
            .map((l) => (
              <span
                key={l}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--vault-red)",
                  marginLeft: 6,
                  textDecoration: "line-through",
                }}
              >
                {l}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}