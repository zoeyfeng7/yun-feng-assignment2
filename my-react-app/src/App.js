import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import GameOfLife from "./GameOfLife";
import CreditsPage from "./CreditsPage";
import HeatMapPage from "./HeatMapPage";
import { GameStateProvider } from "./GameStateContext";

function App() {
  return (
    <GameStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gameoflife" element={<GameOfLife />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/heatmap" element={<HeatMapPage />} />
        </Routes>
      </Router>
    </GameStateProvider>
  );
}

export default App;
