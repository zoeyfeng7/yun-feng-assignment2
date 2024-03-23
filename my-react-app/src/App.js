import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import GameOfLife from "./GameOfLife";
import CreditsPage from "./CreditsPage";
import { GameStateProvider } from "./GameStateContext";

function App() {
  return (
    <GameStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gameoflife" element={<GameOfLife />} />
          <Route path="/credits" element={<CreditsPage />} />
        </Routes>
      </Router>
    </GameStateProvider>
  );
}

export default App;
