import React, { useEffect, useState } from "react";
import "./Tetris.css"; 

const ROWS = 20;
const COLS = 10;

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export default function Arkanoid({ goBack }) {
  const [board, setBoard] = useState(createBoard());
  const [ball, setBall] = useState({ x: 4, y: 15, dx: 1, dy: -1 });
  const [paddle, setPaddle] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const newBoard = createBoard();
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < COLS; x++) {
        newBoard[y][x] = 1;
      }
    }
    setBoard(newBoard);
  }, []);

  const moveBall = () => {
    if (gameOver || paused) return;

    let { x, y, dx, dy } = ball;
    let newX = x + dx;
    let newY = y + dy;

    if (newX < 0 || newX >= COLS) {
      dx *= -1;
      newX = x + dx;
    }
    if (newY < 0) {
      dy *= -1;
      newY = y + dy;
    }

    if (newY === ROWS - 1 && newX >= paddle && newX < paddle + 3) {
      dy = -1;
    }

    if (newY >= ROWS) {
      setGameOver(true);
      return;
    }

    if (board[newY]?.[newX]) {
      const newBoard = board.map(r => [...r]);
      newBoard[newY][newX] = 0;
      setBoard(newBoard);
      dy *= -1;
      newY = y + dy;
    }

    setBall({ x: newX, y: newY, dx, dy });
  };

  const movePaddle = (dir) => {
    setPaddle((p) => {
      const newPos = p + dir;
      if (newPos < 0 || newPos + 3 > COLS) return p;
      return newPos;
    });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (paused || gameOver) return;

      if (e.key === "ArrowLeft") movePaddle(-1);
      if (e.key === "ArrowRight") movePaddle(1);
      if (e.key === "Escape") setPaused(p => !p);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paused, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveBall, 120);
    return () => clearInterval(interval);
  }, [ball, board, paused, gameOver]);

  const display = board.map(r => [...r]);

  for (let i = 0; i < 3; i++) {
    display[ROWS - 1][paddle + i] = 1;
  }

  if (display[ball.y]) {
    display[ball.y][ball.x] = 1;
  }

  const restart = () => {
    const newBoard = createBoard();
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < COLS; x++) {
        newBoard[y][x] = 1;
      }
    }

    setBoard(newBoard);
    setBall({ x: 4, y: 15, dx: 1, dy: -1 });
    setPaddle(3);
    setGameOver(false);
    setPaused(false);
  };

  return (
    <div className="tetris-container">
      <div>
        <h1>ARKANOID</h1>

        <div className="tetris-ui">
          <button onClick={goBack}>Back</button>
          <button onClick={() => setPaused(p => !p)}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={restart}>Restart</button>
          {gameOver && <h2 className="tetris-gameover">GAME OVER</h2>}
        </div>

        <div className="tetris-board">
          {display.flat().map((cell, i) => (
            <div
              key={i}
              className={`tetris-cell ${cell ? "filled" : ""}`}
            />
          ))}

          {paused && !gameOver && (
            <div className="paused-overlay">PAUSED</div>
          )}
        </div>
      </div>
    </div>
  );
}