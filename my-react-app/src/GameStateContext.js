import React, { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <GameStateContext.Provider
      value={{ grid, setGrid, isRunning, setIsRunning }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
