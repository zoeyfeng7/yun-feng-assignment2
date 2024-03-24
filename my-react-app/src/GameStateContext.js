import React, { createContext, useContext, useState } from "react";

const GameStateContext = createContext();

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);
  const [iteration, setIteration] = useState(0);

  return (
    <GameStateContext.Provider
      value={{ grid, setGrid /*, 其他共享的状态和函数 */ }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
