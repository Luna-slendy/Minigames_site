import React, { useState, useEffect, useRef } from "react";
import "./PuyoPuyo.css";
import clearSoundFile from "./assets/clear.mp3";
import comboSoundFile from "./assets/combo.mp3";

const ROWS = 12;
const COLS = 6;
const COLORS = ["red", "blue", "green", "yellow", "purple"];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const randomPair = () => [randomColor(), randomColor()];

export default function PuyoPuyo() {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [pair, setPair] = useState(randomPair());
  const [pos, setPos] = useState({ x: 2, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const clearSound = useRef(new Audio(clearSoundFile));
  const comboSound = useRef(new Audio(comboSoundFile));

  const getPairBlocks = (pair, pos, rot) => {
    const [top, bottom] = pair;
    const { x, y } = pos;
    switch (rot % 4) {
      case 0: return [{ x, y }, { x, y: y + 1 }];
      case 1: return [{ x, y }, { x: x + 1, y }];
      case 2: return [{ x, y }, { x, y: y - 1 }];
      case 3: return [{ x, y }, { x: x - 1, y }];
    }
  };

  const collide = (pair, pos, rot) => {
    const blocks = getPairBlocks(pair, pos, rot);
    return blocks.some(({ x, y }) => y >= ROWS || x < 0 || x >= COLS || board[y]?.[x]);
  };

  const merge = (pair, pos, rot) => {
    const newBoard = board.map(r => [...r]);
    const blocks = getPairBlocks(pair, pos, rot);
    blocks.forEach((b, i) => { newBoard[b.y][b.x] = pair[i]; });
    return newBoard;
  };

  const applyGravity = (b) => {
    const newBoard = b.map(r => [...r]);
    for (let x = 0; x < COLS; x++) {
      let pointer = ROWS - 1;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (newBoard[y][x]) {
          if (pointer !== y) {
            newBoard[pointer][x] = newBoard[y][x];
            newBoard[y][x] = null;
          }
          pointer--;
        }
      }
    }
    return newBoard;
  };

  const findGroups = (b) => {
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const groups = [];

    const dfs = (x, y, color, group) => {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      if (visited[y][x] || b[y][x] !== color) return;
      visited[y][x] = true;
      group.push({ x, y });
      dfs(x + 1, y, color, group);
      dfs(x - 1, y, color, group);
      dfs(x, y + 1, color, group);
      dfs(x, y - 1, color, group);
    };

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!b[y][x] || visited[y][x]) continue;
        const group = [];
        dfs(x, y, b[y][x], group);
        if (group.length >= 4) groups.push(group);
      }
    }
    return groups;
  };

  const clearGroups = (b) => {
    let newBoard = b;
    let comboCounter = 0;
    while (true) {
      const groups = findGroups(newBoard);
      if (!groups.length) break;
      comboCounter++;
      groups.forEach(group => group.forEach(({ x, y }) => { newBoard[y][x] = null; }));
      newBoard = applyGravity(newBoard);
    }

    // Play sound
    if (comboCounter === 1) clearSound.current.play();
    else if (comboCounter > 1) comboSound.current.play();

    if (comboCounter > 1) {
      setComboCount(comboCounter);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1000);
    }

    return newBoard;
  };

  const dropPair = () => {
    const newPos = { ...pos, y: pos.y + 1 };
    if (!collide(pair, newPos, rotation)) {
      setPos(newPos);
    } else {
      const merged = merge(pair, pos, rotation);
      const cleared = clearGroups(merged);
      const newPair = randomPair();
      const start = { x: 2, y: 0 };
      if (collide(newPair, start, 0)) {
        setGameOver(true);
        return;
      }
      setBoard(cleared);
      setPair(newPair);
      setPos(start);
      setRotation(0);
    }
  };

  const move = (dir) => {
    const newPos = { ...pos, x: pos.x + dir };
    if (!collide(pair, newPos, rotation)) setPos(newPos);
  };

  const rotatePair = () => {
    const newRot = (rotation + 1) % 4;
    if (!collide(pair, pos, newRot)) setRotation(newRot);
  };

  const forceDrop = () => {
    let newPos = { ...pos };
    while (!collide(pair, { ...newPos, y: newPos.y + 1 }, rotation)) newPos.y += 1;
    const merged = merge(pair, newPos, rotation);
    const cleared = clearGroups(merged);
    const newPair = randomPair();
    const start = { x: 2, y: 0 };
    if (collide(newPair, start, 0)) {
      setGameOver(true);
      return;
    }
    setBoard(cleared);
    setPair(newPair);
    setPos(start);
    setRotation(0);
  };

  const restart = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setPair(randomPair());
    setPos({ x: 2, y: 0 });
    setRotation(0);
    setGameOver(false);
    setPaused(false);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver || paused) return;
      if (["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," "].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowDown") dropPair();
      if (e.key === "ArrowUp") rotatePair();
      if (e.key === " ") forceDrop();
      if (e.key === "Escape") setPaused(!paused);
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [pair, pos, rotation, gameOver, paused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && !paused) {
        setBoard(prev => applyGravity(prev));
        dropPair(); 
      }
    }, 500);
    return () => clearInterval(interval);
  }, [gameOver, paused, pos, pair, rotation]);

  const display = board.map(r => [...r]);
  getPairBlocks(pair, pos, rotation).forEach((b, i) => {
    if (display[b.y]) display[b.y][b.x] = pair[i];
  });

  return (
    <div className="puyo-container">
      <h1>Puyo Puyo</h1>
      <div className="puyo-ui">
        <button onClick={restart}>Restart</button>
        {gameOver && <h2 className="gameover">GAME OVER</h2>}
        {paused && !gameOver && <h2 className="paused">PAUSED</h2>}
      </div>

      <div className="puyo-board">
        {display.flat().map((cell, i) => (
          <div key={i} className={`puyo-cell ${cell ? cell : ""}`} />
        ))}
        {showCombo && (
          <div className="combo-text">
            {comboCount} COMBO!
          </div>
        )}
      </div>

      <p>Controls: Arrow keys = move, Up = rotate, Down = soft drop, Space = hard drop, Esc = pause</p>
    </div>
  );
}