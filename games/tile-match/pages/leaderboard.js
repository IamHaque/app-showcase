import { useState } from "react";

import { mapRange } from "games/tile-match/shared/utils";

import Leaderboard from "games/tile-match/components/leaderboard";
import GridSelectButton from "games/tile-match/components/grid-selection-button";

export default function TileMatchLeaderboard({ username, homeClickHandler }) {
  const GRID_SIZES = [2, 4, 6, 8];

  const [isBusy, setIsBusy] = useState(false);
  const [gridSize, setGridSize] = useState(undefined);
  const [onMainScreen, setOnMainScreen] = useState(true);
  const [leaderboardData, setLeaderBoardData] = useState([]);

  const resetState = () => {
    setIsBusy(false);
    setOnMainScreen(true);
    setGridSize(undefined);
    setLeaderBoardData([]);
  };

  const gridSelectionButtonClickHandler = async (selectedGridSize) => {
    if (isBusy) return;

    setIsBusy(true);

    await getLeaderboardData(selectedGridSize);
    setGridSize(selectedGridSize);
    setOnMainScreen(false);

    setIsBusy(false);
  };

  const getLeaderboardData = async (selectedGridSize) => {
    if (!selectedGridSize || !GRID_SIZES.includes(selectedGridSize)) return;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(
      "/api/games/tile-match/leaderboard/" + selectedGridSize,
      requestOptions
    );
    const data = await response.json();

    if (data && data.leaderboard) {
      setLeaderBoardData(data.leaderboard);
    }
  };

  let GameHeaderContent = (
    <>
      <p className="title">Tile Match</p>
      <p className="description">
        {onMainScreen
          ? "Select the grid size to show its leaderboard."
          : `Leaderboard of ${gridSize}x${gridSize} game mode.`}
      </p>
    </>
  );

  let GameMainContent;
  if (onMainScreen) {
    GameMainContent = (
      <>
        <div className="gridSelection main">
          {GRID_SIZES.map((item, index) => (
            <GridSelectButton
              key={index}
              isBusy={isBusy}
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
        <div className="main leaderboardMain">
          <Leaderboard
            minDataLength={-1}
            currentUser={username}
            data={leaderboardData}
            minLeaderboardUsers={10}
          />
        </div>

        <div className="bottomButton" onClick={resetState}>
          <span>Back to Grid Selection Screen</span>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <div className="header">{GameHeaderContent}</div>
      {GameMainContent}
    </div>
  );
}
