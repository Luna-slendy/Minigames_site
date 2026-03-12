import React, { useState, useContext } from "react";
import "./App.css";

import Mascot from "./assets/Mascot.png";

import DoomIcon from "./assets/Doom.png";
import TetrisIcon from "./assets/Tetris.png";
import QuizIcon from "./assets/quiz.png";
import pinballIcon from "./assets/pinball.png";
import Puyo_PuyoIcon from "./assets/puyo_puyo.png";

import clickSoundFile from "./assets/click.mp3";

import { AuthContext } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";

import Quiz from "./Quiz";
import Pinball from "./Pinball";
import Puyo_puyo from "./Puyo_Puyo";
import Doom from "./Doom";
import Tetris from "./Tetris";


function App() {

  const [page, setPage] = useState("main");
  const [authMode, setAuthMode] = useState("login");

  const { isAuthenticated, logout } = useContext(AuthContext);

  const playSound = () => {
    const audio = new Audio(clickSoundFile);
    audio.play();
  };

  const handlePageChange = (newPage) => {
    playSound();
    setPage(newPage);
  };

  const protectedPages = ["Doom", "Tetris", "Quiz", "Pinball", "Puyo_Puyo"];

  // Protection
  if (!isAuthenticated && protectedPages.includes(page)) {
    return authMode === "login" ? (
      <Login
        onSuccess={() => setPage(page)}
        goToSignup={() => setAuthMode("signup")}
      />
    ) : (
      <Signup
        onSuccess={() => setPage(page)}
        goToLogin={() => setAuthMode("login")}
      />
    );
  }

  return (
    <div className="App crt">

      {page === "Doom" ? (
        <Doom goBack={() => setPage("main")} />

      ) : page === "Tetris" ? (
        <Tetris goBack={() => setPage("main")} />

      ) : page === "Pinball" ? (
        <Pinball goBack={() => setPage("main")} />

      ) : page === "Quiz" ? (
        <Quiz goBack={() => setPage("main")} />

      ) : page === "Puyo_Puyo" ? (
        <Puyo_puyo goBack={() => setPage("main")} />

      ) :
       (
        <>

          <div className="icon-grid">

            <div
              className="game-icon"
              onClick={() => handlePageChange("Doom")}
            >
              <img src={DoomIcon} alt="Doom" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Tetris")}
            >
              <img src={TetrisIcon} alt="Tetris" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Pinball")}
            >
              <img src={pinballIcon} alt="Pinball" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Quiz")}
            >
              <img src={QuizIcon} alt="Quiz" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Puyo_Puyo")}
            >
              <img src={Puyo_PuyoIcon} alt="Puyo Puyo" />
            </div>

          </div>


          <h1 className="arcade-title">
            ARCADE GAMES
          </h1>


          {isAuthenticated && (
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          )}


          <div className="side-image">
            <img src={Mascot} alt="decor" />
          </div>
        </>
      )}

    </div>
  );
}

export default App;