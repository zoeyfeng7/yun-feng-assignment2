import React, { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);

  return (
    <GameStateContext.Provider value={{ grid, setGrid }}>
      {children}
    </GameStateContext.Provider>
  );
};
