import React, { useState, useContext } from "react";
import "./App.css";

import Mascot from "./assets/Mascot.png";

import clickerIcon from "./assets/Doom.png";
import galleryIcon from "./assets/Tetris.png";
import scoreIcon from "./assets/quiz.png";
import pinballIcon from "./assets/pinball.png";
import listenIcon from "./assets/puyo_puyo.png";

import clickSoundFile from "./assets/michael-dont-leave-me-here.mp3";

import { AuthContext } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";

import Doom from "./Doom";
import Tetris from "./Tetris";
import Quiz from "./Quiz";
import Pinball from "./Pinball";
import Puyo_puyo from "./Puyo_Puyo";

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

      ) : (
        <>

          <div className="icon-grid">

            <div
              className="game-icon"
              onClick={() => handlePageChange("Doom")}
            >
              <img src={clickerIcon} alt="Doom" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Tetris")}
            >
              <img src={galleryIcon} alt="Tetris" />
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
              <img src={scoreIcon} alt="Quiz" />
            </div>

            <div
              className="game-icon"
              onClick={() => handlePageChange("Puyo_Puyo")}
            >
              <img src={listenIcon} alt="Puyo Puyo" />
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