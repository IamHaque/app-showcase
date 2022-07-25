import { useEffect, useState } from "react";

import { mapRange, initializeTiles, showElapsedTime } from "../shared/utils";

import { fetchWrapper } from "helpers";

import Tile from "apps/tile-match/components/tile";
import Leaderboard from "apps/tile-match/components/leaderboard";
import GridSelectButton from "apps/tile-match/components/grid-selection-button";
import { appService } from "services";

export default function TileMatchGame({ username, homeClickHandler }) {
  const GRID_SIZES = [2, 4, 6, 8];

  const [gameState, setGameState] = useState({
    tiles: [],
    newGame: true,
    gameOver: false,
    attempts: undefined,
    gridSize: undefined,
    highScores: undefined,
    uniqueTiles: undefined,
    matchedTiles: undefined,
  });

  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [score, setScore] = useState(0);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [currentUser, setCurrentUser] = useState(username);

  const [prevFlippedTileIndex, setPrevFlippedTileIndex] = useState(undefined);
  const [beingFlipped, setBeingFlipped] = useState(undefined);

  // Initialize game data on page load
  useEffect(() => {
    restartGame();
  }, []);

  // Update game state
  useEffect(() => {
    if (gameState.gameOver) {
      handleGameOver();
      return;
    }

    if (gameState.tiles.length <= 0) return;

    let hasWon = true;
    for (let tile of gameState.tiles) {
      if (tile.matched) continue;
      hasWon = false;
      break;
    }
    if (hasWon) setGameState({ ...gameState, gameOver: true });
  }, [gameState]);

  // Update timer every second
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((seconds) => seconds + 1);
      }, 1000);
    } else if (!isTimerActive && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer, isTimerActive]);

  // Initializes the game state
  const initializeGame = async (gridSize = 2, isNewGame = true) => {
    const uniqueTiles = (gridSize * gridSize) / 2;
    const generatedTiles = initializeTiles(uniqueTiles, gridSize);

    let remoteHighScores = await getRemoteHighScores();
    const highScores = remoteHighScores
      ? remoteHighScores
      : {
          2: 0,
          4: 0,
          6: 0,
          8: 0,
        };

    const newGameState = {
      attempts: 0,
      gameOver: false,
      matchedTiles: 0,
      gridSize: gridSize,
      newGame: isNewGame,
      tiles: generatedTiles,
      highScores: highScores,
      uniqueTiles: uniqueTiles,
    };

    // Reset timer
    setTimer(0);
    setIsTimerActive(true);

    setBeingFlipped(false);
    setGameState(newGameState);
    setPrevFlippedTileIndex(-1);
  };

  const getScore = () => {
    const minimumMoves = gameState.uniqueTiles;
    const minimumTime = gameState.uniqueTiles * 0.3;
    const highestScorePossible = gameState.gridSize * 500;

    const timeTaken = timer <= 0 ? 1 : timer;
    const attemptsTaken = gameState.attempts <= 0 ? 0 : gameState.attempts;

    const currentScore = Math.floor(
      (minimumTime / timeTaken) *
        (minimumMoves / attemptsTaken) *
        highestScorePossible
    );

    return currentScore;
  };

  // Reset game state
  const restartGame = () => {
    initializeGame();
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const tileClickHandler = (tileID) => {
    // Return if already being flipped
    if (beingFlipped) return;

    // Return if clicked on already matched tile
    if (gameState.tiles[tileID].matched) return;

    // Return if clicked on last flipped tile
    if (prevFlippedTileIndex >= 0 && prevFlippedTileIndex === tileID) return;

    setBeingFlipped(true);

    let isGameOver = false;
    let attempts = gameState.attempts;
    let state = { ...gameState };

    if (prevFlippedTileIndex >= 0) {
      // Increment attempt when valid tile is clicked
      attempts += 1;

      // Checks if last flipped tile and current tile match
      if (
        state.tiles[prevFlippedTileIndex].content ===
        state.tiles[tileID].content
      ) {
        setBeingFlipped(false);
        state.matchedTiles += 1;
        state.tiles[tileID].matched = true;
        state.tiles[prevFlippedTileIndex].matched = true;

        vibrate();
      } else {
        unFlipFlippedTiles(isGameOver, attempts);
      }

      setPrevFlippedTileIndex(-1);
    } else {
      setBeingFlipped(false);
      setPrevFlippedTileIndex(tileID);
    }

    // Flip tiles
    const flippedTiles = state.tiles.map((tile) => {
      return {
        ...tile,
        flipped: tile.matched
          ? true
          : tile.id === tileID ||
            (prevFlippedTileIndex >= 0 && tile.id === prevFlippedTileIndex)
          ? true
          : false,
      };
    });

    setGameState({
      ...gameState,
      attempts: attempts,
      gameOver: isGameOver,
      tiles: [...flippedTiles],
      matchedTiles: state.matchedTiles,
    });
  };

  const unFlipFlippedTiles = (gameOver, attempts) => {
    setTimeout(() => {
      const flippedTiles = gameState.tiles.map((tile) => {
        return {
          ...tile,
          flipped: tile.matched,
        };
      });
      setGameState({
        ...gameState,
        gameOver,
        attempts,
        tiles: [...flippedTiles],
      });
      setBeingFlipped(false);
    }, 800);
  };

  const gridSelectionButtonClickHandler = async (selectedGridSize) => {
    initializeGame(selectedGridSize, false);
    toggleTimer();
  };

  const updateDBData = async (score) => {
    try {
      await appService.updateScore("Tile Match", {
        score,
        username: currentUser,
        gridSize: gameState.gridSize,
      });
    } catch (_) {}
  };

  const getRemoteHighScores = async () => {
    try {
      const data = await appService.getUserScore("Tile Match", currentUser);
      return data.scores;
    } catch (_) {
      return;
    }
  };

  const getLeaderboardData = async () => {
    try {
      const data = await appService.getLeaderboard(
        "Tile Match",
        gameState.gridSize
      );

      if (data && data.leaderboard) {
        setLeaderBoard(data.leaderboard);
      }
    } catch (_) {}
  };

  const handleGameOver = async () => {
    const currentScore = getScore();
    setScore(currentScore);

    // Save high score to local storage
    if (currentScore > gameState.highScores[gameState.gridSize]) {
      await updateDBData(currentScore);

      const updatedHighScores = { ...gameState.highScores };
      updatedHighScores[gameState.gridSize] = currentScore;
      setGameState({ ...gameState, highScores: updatedHighScores });
    }

    await getLeaderboardData();
    toggleTimer();
  };

  const vibrate = () => {
    if (!window) {
      return;
    }

    if (!window.navigator) {
      return;
    }

    if (!window.navigator.vibrate) {
      return;
    }

    window.navigator.vibrate([200]);
  };

  // Show game-over overlay if game is over
  let GameEndOverlay = <></>;
  if (gameState.gameOver) {
    GameEndOverlay = (
      <div className="gameOverScreen center">
        <div className="top">
          <header>
            <p>Level Complete!</p>
          </header>

          <main>
            <p className="score">
              <span>Score</span>
              <span>{score}</span>
            </p>
            <p className="score highScore">
              <span>High Score</span>
              <span>{gameState.highScores[gameState.gridSize]}</span>
            </p>
          </main>

          <footer>
            <div
              className="restartGameButton"
              onClick={() => {
                restartGame();
              }}
            >
              <span>Restart</span>
            </div>
          </footer>
        </div>

        <div className="bottom">
          <Leaderboard
            minDataLength={0}
            data={leaderBoard}
            minLeaderboardUsers={5}
            currentUser={currentUser}
          />
        </div>
      </div>
    );
  }

  // Set game header based on new game or running game
  let GameHeaderContent;
  if (gameState.newGame) {
    GameHeaderContent = (
      <>
        <p className="title">Tile Match</p>
        <p className="description">
          Select a grid layout from the below options.
          <br />
          Each option scales exponentially in difficulty.
        </p>
      </>
    );
  } else {
    GameHeaderContent = (
      <>
        <p className="description">
          <span className="strong">Tap</span> or{" "}
          <span className="strong">Click</span> on a tile to flip it.
          <br />
          Match all the <span className="strong">tile pairs</span> to complete
          the game.
        </p>

        <div className="progressContainer">
          <div className="progressContainerTop">
            <p className="progressTitle">Time Elapsed</p>
            <p className="progressStatus">{showElapsedTime(timer)}</p>
          </div>

          <div className="progressContainerTop">
            <p className="progressTitle">Matched Tiles</p>
            <p className="progressStatus">
              {gameState.matchedTiles} / {gameState.uniqueTiles}
            </p>
          </div>
        </div>
      </>
    );
  }

  // Set game main content based on new game or running game
  let GameMainContent;
  if (gameState.newGame) {
    GameMainContent = (
      <>
        <div className="gridSelection main">
          {GRID_SIZES.map((item, index) => (
            <GridSelectButton
              key={index}
              gridSize={item}
              hue={mapRange(index, 0, 3, 180, 360) * -1}
              clickHandler={gridSelectionButtonClickHandler}
            />
          ))}
        </div>
        <div className="bottomButton">
          <a onClick={homeClickHandler}>Back to Main Menu</a>
        </div>
      </>
    );
  } else {
    GameMainContent = (
      <>
        <div
          className="main"
          style={{
            gap: `${mapRange(gameState.gridSize, 2, 8, 1.5, 0.3)}em`,
            gridTemplateRows: `repeat(${gameState.gridSize}, 1fr)`,
            gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)`,
          }}
        >
          {gameState.tiles.map((tile) => (
            <Tile
              id={tile.id}
              key={tile.id}
              content={tile.content}
              flipped={tile.flipped}
              clickHandler={tileClickHandler}
              fontSize={`${mapRange(gameState.gridSize, 2, 8, 3, 1.5)}rem`}
            />
          ))}
        </div>
        <div
          className="bottomButton"
          onClick={() => {
            restartGame();
          }}
        >
          <span>Restart Game</span>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      {GameEndOverlay}

      <div className="header">{GameHeaderContent}</div>

      {GameMainContent}
    </div>
  );
}
