import React, { useEffect, useState } from "react";
import "./Tetris.css";
import clearSoundFile from "./assets/Clear.mp3";

const ROWS = 20;
const COLS = 10;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  L: [[1, 0, 0], [1, 1, 1]],
  J: [[0, 0, 1], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]]
};

const randomShape = () => {
  const keys = Object.keys(SHAPES);
  return SHAPES[keys[Math.floor(Math.random() * keys.length)]];
};

const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export default function Tetris({ goBack }) {
  const [board, setBoard] = useState(createBoard());
  const [piece, setPiece] = useState(randomShape());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [heldPiece, setHeldPiece] = useState(null);
  const [holdUsed, setHoldUsed] = useState(false);
  const [paused, setPaused] = useState(false);

const lineClearSound = new Audio(clearSoundFile);

  const collide = (p, position) =>
    p.some((row, y) =>
      row.some((value, x) => {
        if (!value) return false;
        const newY = y + position.y;
        const newX = x + position.x;
        return newY >= ROWS || newX < 0 || newX >= COLS || board[newY]?.[newX];
      })
    );

  const merge = (p, position) => {
    const newBoard = board.map(r => [...r]);
    p.forEach((row, y) =>
      row.forEach((value, x) => {
        if (value) newBoard[y + position.y][x + position.x] = 1;
      })
    );
    return newBoard;
  };

  const rotate = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

const clearLines = (b) => {
  let cleared = 0;
  const newBoard = b.map((row) => [...row]);

  b.forEach((row, i) => {
    if (row.every(cell => cell)) {
      cleared++;
      row.forEach((_, j) => {
        const el = document.querySelector(`.tetris-board > div:nth-child(${i * COLS + j + 1})`);
        if (el) {
          el.classList.add("clearing");
          el.addEventListener("animationend", () => {
            el.classList.remove("clearing");
          }, { once: true });
        }
      });
    }
  });

  if (cleared) {
    lineClearSound.currentTime = 0;
    lineClearSound.play();
  }


  const filtered = b.filter(row => row.some(cell => cell === 0));
  return [...Array.from({ length: cleared }, () => Array(COLS).fill(0)), ...filtered];
};

  const drop = () => {
    const newPos = { ...pos, y: pos.y + 1 };
    if (!collide(piece, newPos)) {
      setPos(newPos);
    } else {
      const merged = merge(piece, pos);
      const cleared = clearLines(merged);
      const newPiece = randomShape();
      const newStart = { x: 3, y: 0 };

      if (collide(newPiece, newStart)) {
        setGameOver(true);
        return;
      }

      setBoard(cleared);
      setPiece(newPiece);
      setPos(newStart);
      setHoldUsed(false);
    }
  };

  const move = (dir) => {
    const newPos = { ...pos, x: pos.x + dir };
    if (!collide(piece, newPos)) setPos(newPos);
  };

  const rotatePiece = () => {
    const rotated = rotate(piece);
    if (!collide(rotated, pos)) setPiece(rotated);
  };

  const forceDown = () => {
    let newPos = { ...pos };
    while (!collide(piece, { ...newPos, y: newPos.y + 1 })) newPos.y += 1;

    const merged = merge(piece, newPos);
    const cleared = clearLines(merged);
    const newPiece = randomShape();
    const newStart = { x: 3, y: 0 };

    if (collide(newPiece, newStart)) {
      setGameOver(true);
      return;
    }

    setBoard(cleared);
    setPiece(newPiece);
    setPos(newStart);
    setHoldUsed(false);
  };

  const hold = () => {
    if (holdUsed) return;
    if (!heldPiece) {
      setHeldPiece(piece);
      setPiece(randomShape());
    } else {
      const temp = piece;
      setPiece(heldPiece);
      setHeldPiece(temp);
    }
    setPos({ x: 3, y: 0 });
    setHoldUsed(true);
  };

  const togglePause = () => setPaused(!paused);

  const restart = () => {
    setBoard(createBoard());
    setPiece(randomShape());
    setPos({ x: 3, y: 0 });
    setHeldPiece(null);
    setHoldUsed(false);
    setGameOver(false);
    setPaused(false);
  };

  const normalizePiece = (p) => {
    const size = 4;
    const newP = Array.from({ length: size }, () => Array(size).fill(0));
    p.forEach((row, y) => row.forEach((v, x) => { newP[y][x] = v; }));
    return newP;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver || paused) return;
      const keysToBlock = ["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"," ","PageUp","PageDown","Home","End","Shift"];
      if (keysToBlock.includes(e.key)) e.preventDefault();

      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowDown") drop();
      if (e.key === "ArrowUp") rotatePiece();
      if (e.key === " ") forceDown();
      if (e.key === "Shift") hold();
      if (e.key === "Escape") togglePause();
    };
    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, pos, piece, heldPiece, holdUsed, paused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver && !paused) drop();
    }, 600);
    return () => clearInterval(interval);
  }, [gameOver, paused, pos, piece]);

  const display = board.map(r => [...r]);
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value && display[y + pos.y]) display[y + pos.y][x + pos.x] = 1;
    });
  });

  return (
    <div className="tetris-container">
      {heldPiece && (
        <div className="tetris-hold">
          <h3>Held</h3>
          <div className="tetris-mini-board">
            {normalizePiece(heldPiece).map((row, y) =>
              row.map((cell, x) => (
                <div key={`${y}-${x}`} className={`tetris-cell ${cell ? "filled" : ""}`} />
              ))
            )}
          </div>
        </div>
      )}

      <div>
        <h1>TETRIS</h1>
        <div className="tetris-ui">
          <button onClick={goBack}>Back</button>
          <button onClick={forceDown}>Hard Drop</button>
          <button onClick={hold}>Hold</button>
          <button onClick={togglePause}>{paused ? "Resume" : "Pause"}</button>
          <button onClick={restart}>Restart</button>
          {gameOver && <h2 className="tetris-gameover">GAME OVER</h2>}
        </div>

        <div className="tetris-board">
          {display.flat().map((cell, i) => (
            <div key={i} className={`tetris-cell ${cell ? "filled" : ""}`} />
          ))}
          {paused && !gameOver && (
            <div className="paused-overlay">PAUSED</div>
          )}
        </div>
      </div>
    </div>
  );
}