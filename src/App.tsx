import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

function App() {
  const categories = {
    love: {
      name: "THE ACTUAL LOVE OF MY LIFE",
      words: ["MADISON", "LOML", "ILYSM", "ROYGBABE"],
      color: "bg-purple-500",
      difficulty: "Hardest"
    },
    breakTime: {
      name: "BREAK TIME",
      words: ["CONNECTIONS", "COUCH", "IPAD", "LOUNGE"],
      color: "bg-blue-500",
      difficulty: "Hard"
    },
    nicknames: {
      name: "WHAT YOU CALL ME",
      words: ["PEDRO", "PRINCESS", "DIVA", "DL"],
      color: "bg-green-500",
      difficulty: "Medium"
    },
    abbreviations: {
      name: "TEXT ABBREVIATIONS",
      words: ["NGL", "LMAO", "WTF", "SMH"],
      color: "bg-yellow-500",
      difficulty: "Easy"
    }
  };

  const allWords = Object.values(categories).flatMap(cat => cat.words);

  const [words, setWords] = useState(shuffleArray([...allWords]));
  const [selected, setSelected] = useState<string[]>([]);
  const [solved, setSolved] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("");
  const [gameState, setGameState] = useState("loading");
  const [isLoading, setIsLoading] = useState(true);

  function shuffleArray(array: string[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  useEffect(() => {
    checkGameState();

    const keysPressed = new Set<string>();
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.key.toLowerCase());
      if (
        e.shiftKey &&
        keysPressed.has("r") &&
        keysPressed.has("e") &&
        keysPressed.has("s") &&
        keysPressed.has("t")
      ) {
        resetGameCompletely();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const checkGameState = () => {
    try {
      const savedState = localStorage.getItem("connections-game-state");
      if (savedState) {
        const state = JSON.parse(savedState);
        setGameState(state.status);
        if (state.status === "won") {
          setSolved(Object.values(categories));
          setMessage("🎉 Congrats, you solved it! I love you... what? who typed that? 🎉");
        }
      } else {
        setGameState("playing");
      }
    } catch {
      setGameState("playing");
    }
    setIsLoading(false);
  };

  const saveGameState = (status: string) => {
    try {
      localStorage.setItem("connections-game-state", JSON.stringify({ status }));
    } catch {}
  };

  const resetGameCompletely = () => {
    try {
      localStorage.removeItem("connections-game-state");
      setWords(shuffleArray([...allWords]));
      setSelected([]);
      setSolved([]);
      setMistakes(0);
      setMessage("");
      setGameState("playing");
    } catch {}
  };

  const handleWordClick = (word: string) => {
    if (gameState !== "playing") return;
    if (solved.some(cat => cat.words.includes(word))) return;

    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
    } else if (selected.length < 4) {
      setSelected([...selected, word]);
    }
  };

  const handleShuffle = () => {
    if (gameState !== "playing") return;
    const remaining = words.filter(w => !solved.some(cat => cat.words.includes(w)));
    const solvedWords = words.filter(w => solved.some(cat => cat.words.includes(w)));
    setWords([...solvedWords, ...shuffleArray(remaining)]);
  };

  const handleDeselectAll = () => {
    if (gameState !== "playing") return;
    setSelected([]);
    setMessage("");
  };

  const handleSubmit = () => {
    if (gameState !== "playing") return;
    if (selected.length !== 4) return;

    const foundCategory = Object.entries(categories).find(([, cat]) =>
      selected.every(word => cat.words.includes(word))
    );

    if (foundCategory) {
      const [, category] = foundCategory;
      const newSolved = [...solved, category];
      setSolved(newSolved);
      setSelected([]);
      setMessage(`✨ ${category.name}! ✨`);

      const remainingWords = words.filter(w => !category.words.includes(w));
      setWords([...category.words, ...remainingWords]);

      if (newSolved.length === 4) {
        setGameState("won");
        setMessage("🎉 Congrats, you solved it! I love you... what? who typed that? 🎉");
        saveGameState("won");
      }
    } else {
      const oneAway = Object.values(categories).some(cat => {
        const matches = selected.filter(word => cat.words.includes(word));
        return matches.length === 3;
      });

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= 4) {
        setGameState("lost");
        saveGameState("lost");
      } else {
        setMessage(oneAway ? "One away! 🤏" : "Not quite! Try again 💜");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 text-black">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">😔</div>
          <h1 className="text-3xl font-bold mb-4">Thank you for playing, friend.</h1>
          <p className="text-xl mb-2">We're all done.</p>
          <p className="text-lg text-gray-600">Better luck next time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-1">Connections</h1>
          <p className="text-gray-600 italic">A game made just for you 💜✨</p>
          <p className="text-sm text-gray-500 mt-1">Create four groups of four!</p>
        </div>

        {gameState === "playing" && (
          <div className="mb-4 flex justify-between items-center text-black">
            <div className="text-sm font-medium">
              Mistakes remaining: {4 - mistakes}
            </div>
            {message && (
              <div className="text-sm font-bold animate-pulse">{message}</div>
            )}
          </div>
        )}

        {solved.map((category, index) => (
          <div key={index} className={`${category.color} text-white p-4 rounded-lg mb-2 text-center`}>
            <div className="font-bold mb-1">{category.name}</div>
            <div className="text-sm">{category.words.join(", ")}</div>
          </div>
        ))}

        {gameState === "won" && (
          <div className="text-center mt-8">
            <p className="text-2xl font-bold animate-pulse">{message}</p>
          </div>
        )}

        {gameState === "playing" && (
          <>
            {/* Word Grid */}
           <div className="grid grid-cols-4 gap-2 mb-6 sm:grid-cols-4 xs:grid-cols-2">
  {words.map((word, index) => {
    const isSolved = solved.some(cat => cat.words.includes(word));
    const isSelected = selected.includes(word);
    if (isSolved) return null;

    // Auto-fit font size: smaller for longer words
    const maxChars = 10; // approximate chars that fit without shrinking
    const fontSize = word.length > maxChars ? `${Math.max(12, 16 - (word.length - maxChars))}px` : '16px';

    return (
      <button
        key={index}
        onClick={() => handleWordClick(word)}
        style={{ fontSize, lineHeight: 1.1 }}
        className={`
          w-full aspect-square p-2 rounded-lg font-semibold text-center flex items-center justify-center
          border-2 transition-transform transform hover:scale-105
          ${isSelected
            ? "bg-black text-white border-black"
            : "bg-white text-black border-gray-400 hover:border-black"
          }
        `}
      >
        {word}
      </button>
    );
  })}
</div>

            {/* Buttons */}
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={handleShuffle}
                className="px-6 py-2 bg-white border-2 border-black rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2"
              >
                <Shuffle size={16} />
                Shuffle
              </button>

              <button
                onClick={handleDeselectAll}
                className="px-6 py-2 bg-white border-2 border-black rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Deselect
              </button>

              <button
                onClick={handleSubmit}
                disabled={selected.length !== 4}
                className={`px-6 py-2 rounded-full font-semibold border-2 transition
                  ${
                    selected.length === 4
                      ? "bg-black text-white border-black hover:bg-gray-900"
                      : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Submit
              </button>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Made with love for the ACTUAL LOML 💜</p>
        </div>
      </div>
    </div>
  );
}

export default App;
