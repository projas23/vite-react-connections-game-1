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
      name: "TEXTING ABBREVIATIONS",
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
        keys
