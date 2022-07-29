import dynamic from "next/dynamic";

import { useRef, useEffect } from "react";

import Environment from "../classes/environment";
import Bird from "../classes/bird";
import Pipe from "../classes/pipe";

import * as API from "apps/peskyBird/utils/API";

import styles from "../styles/home.module.scss";

const Sketch = dynamic(
  () =>
    import("react-p5").then((mod) => {
      return mod.default;
    }),
  {
    ssr: false,
  }
);

export default function PeskyBirdHome({ username }) {
  // Game static references
  const TIMEOUT_REF = useRef();
  const CANVAS_WIDTH_REF = useRef(100);
  const CANVAS_HEIGHT_REF = useRef(100);

  let FLY_SOUND_REF = useRef();
  let HIT_SOUND_REF = useRef();
  let DEATH_SOUND_REF = useRef();
  let POINT_SOUND_REF = useRef();
  let SWOOSH_SOUND_REF = useRef();

  const HIGHSCORE_REF = useRef();
  const IS_BUSY_REF = useRef();

  useEffect(() => {
    CANVAS_HEIGHT_REF.current = window.innerHeight;
    CANVAS_WIDTH_REF.current =
      window.innerWidth > 520 ? 520 : window.innerWidth;

    FLY_SOUND_REF.current = new Audio("/PeskyBirds/SoundFX/fly.mp3");
    HIT_SOUND_REF.current = new Audio("/PeskyBirds/SoundFX/hit.mp3");
    DEATH_SOUND_REF.current = new Audio("/PeskyBirds/SoundFX/death.mp3");
    POINT_SOUND_REF.current = new Audio("/PeskyBirds/SoundFX/point.mp3");
    SWOOSH_SOUND_REF.current = new Audio("/PeskyBirds/SoundFX/swoosh.mp3");

    const fetchLeaderboard = async () => {
      const data = await API.getLeaderboardData();
      HIGHSCORE_REF.current =
        data.filter((item) => item.username === username)[0]?.score || 0;
      IS_BUSY_REF.current = false;
    };

    fetchLeaderboard().catch(console.error);
  }, []);

  function playSound(sound) {
    if (!sound.current.paused) return;

    if (sound === HIT_SOUND_REF) {
      sound.current.play().then((_) => DEATH_SOUND_REF.current.play());
    } else {
      sound.current.play();
    }
  }

  async function updateLeaderboard(score) {
    if (IS_BUSY_REF.current === true) return;

    IS_BUSY_REF.current = true;
    if (HIGHSCORE_REF.current < score) {
      await API.updateLeaderboard(username, score);
      HIGHSCORE_REF.current = score;
    }
    IS_BUSY_REF.current = false;
  }

  const BIRD_RATIO = 83 / 61;
  let BIRD;
  let BIRD_SIZE;
  let FONT = {};
  let PIPES = [];
  let GAME_STATE;
  const ASSETS = {};
  const LOG_ASSETS = {};
  const BIRD_ASSETS = [];
  let CURRENT_BIRD_INDEX = 0;
  const ENVIRONMENT_IMAGES = {};
  const ENVIRONMENT_SPEEDS = {
    sky: 0.4,
    clouds: 0.55,
    buildings: 0.7,
    trees: 1,
    grass: 3.1,
  };

  // P5 Preload
  const preload = (p5) => {
    if (Object.keys(ASSETS).length <= 0) {
      ASSETS["buildings"] = p5.loadImage(`/PeskyBirds/Buildings.png`);
      ASSETS["clouds"] = p5.loadImage(`/PeskyBirds/Clouds.png`);
      ASSETS["grass"] = p5.loadImage(`/PeskyBirds/Grass.png`);
      ASSETS["trees"] = p5.loadImage(`/PeskyBirds/Trees.png`);
      ASSETS["sky"] = p5.loadImage(`/PeskyBirds/Sky.png`);

      ASSETS["buildingsFlipped"] = p5.loadImage(
        `/PeskyBirds/BuildingsFlipped.png`
      );
      ASSETS["cloudsFlipped"] = p5.loadImage(`/PeskyBirds/CloudsFlipped.png`);
      ASSETS["grassFlipped"] = p5.loadImage(`/PeskyBirds/GrassFlipped.png`);
      ASSETS["treesFlipped"] = p5.loadImage(`/PeskyBirds/TreesFlipped.png`);
      ASSETS["skyFlipped"] = p5.loadImage(`/PeskyBirds/SkyFlipped.png`);
    }

    LOG_ASSETS["tl1"] = p5.loadImage(`/PeskyBirds/TL1.png`);
    LOG_ASSETS["tl2"] = p5.loadImage(`/PeskyBirds/TL2.png`);
    LOG_ASSETS["bl1"] = p5.loadImage(`/PeskyBirds/BL1.png`);
    LOG_ASSETS["bl2"] = p5.loadImage(`/PeskyBirds/BL2.png`);

    for (let i = 0; i < 14; i++) {
      BIRD_ASSETS.push(p5.loadImage(`/PeskyBirds/BirdImages/${i}.png`));
    }

    FONT["family"] = p5.loadFont(`/PeskyBirds/flappyBird.ttf`);
  };

  // P5 Setup
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(CANVAS_WIDTH_REF.current, CANVAS_HEIGHT_REF.current).parent(
      canvasParentRef
    );
    p5.frameRate(60);

    BIRD_SIZE = {
      w: Math.floor(CANVAS_HEIGHT_REF.current / 15),
      h: Math.floor(CANVAS_HEIGHT_REF.current / 15 / BIRD_RATIO),
    };

    resetGameState(p5);

    setupAssets();

    setupFont(p5);
  };

  // P5 Draw
  const draw = (p5) => {
    p5.clear();
    // BG
    drawBackground(p5);

    if (!GAME_STATE.gameStarted && !GAME_STATE.gameOver) {
      drawStartMenu(p5);
    }

    if (GAME_STATE.gameStarted && GAME_STATE.gameOver) {
      drawGameOverMenu(p5);
    }

    if (GAME_STATE.gameStarted && !GAME_STATE.gameOver) {
      for (let pipe of PIPES) {
        pipe.draw(p5, LOG_ASSETS);
      }

      if (!GAME_STATE.dying) {
        BIRD.draw(p5, BIRD_ASSETS[CURRENT_BIRD_INDEX]);

        if (p5.frameCount % 20 === 0) {
          CURRENT_BIRD_INDEX += 1;
          CURRENT_BIRD_INDEX =
            CURRENT_BIRD_INDEX >= 13 ? 0 : CURRENT_BIRD_INDEX;
        }
      } else {
        BIRD.draw(p5, BIRD_ASSETS[13], true);
        BIRD.update(p5);

        if (BIRD.isOnFloor()) {
          TIMEOUT_REF.current = setTimeout(() => {
            GAME_STATE.dying = false;
            GAME_STATE.gameOver = true;

            clearTimeout(TIMEOUT_REF.current);
          }, 500);
        }
      }

      if (!GAME_STATE.dying) {
        drawScore(p5);
      }

      // FG
      drawForeground(p5);

      // Update
      if (!GAME_STATE.dying) {
        updateBackground();

        BIRD.update(p5);

        for (let i = PIPES.length - 1; i >= 0; i -= 1) {
          PIPES[i].update(GAME_STATE.speed);

          if (PIPES[i].isOffScreen()) {
            PIPES.splice(i, 1);
          }

          if (PIPES[i].collidesWith(BIRD) || BIRD.isOnFloor()) {
            playSound(HIT_SOUND_REF);
            GAME_STATE.dying = true;
            BIRD.fly();
            updateLeaderboard(GAME_STATE.score);
          }

          // Increase score if pipe passed without collision
          if (PIPES[i].hasPassed(BIRD)) {
            GAME_STATE.score += 1;
            playSound(POINT_SOUND_REF);
          }
        }

        // Increase game seed with score
        if (
          GAME_STATE.score !== 0 &&
          GAME_STATE.score % GAME_STATE.increaseSpeedAtScore === 0
        ) {
          GAME_STATE.speed += 2;
          ENVIRONMENT_SPEEDS["grass"] += 2;
          ENVIRONMENT_IMAGES["grass"].speed += 2;
          ENVIRONMENT_IMAGES["grassFlipped"].speed += 2;
          GAME_STATE.increaseSpeedAtScore += GAME_STATE.increaseSpeedSteps;
          playSound(SWOOSH_SOUND_REF);
        }

        // Add new pipe if last pipe reached 40% width
        if (PIPES[PIPES.length - 1].x < GAME_STATE.canvasWidth * 0.4) {
          addPipe(p5);
        }
      }
    }
  };

  // P5 MouseClicked
  const mouseClicked = ({ _setupDone }) => {
    if (!_setupDone) return;

    actOnInput();
  };

  const keyPressed = ({ _setupDone, keyCode }) => {
    if (!_setupDone) return;
    if (keyCode !== 32) return;

    actOnInput();
  };

  function actOnInput() {
    if (GAME_STATE.dying) return;

    if (!GAME_STATE.gameStarted) {
      GAME_STATE.gameStarted = true;
    }

    if (GAME_STATE.gameOver) {
      resetGameState(p5);
      return;
    }

    BIRD.fly();
    playSound(FLY_SOUND_REF);
  }

  function setupFont() {
    let size = 48;
    let strokeWeight = 6;
    if (GAME_STATE.canvasHeight < 280) {
      strokeWeight = 3;
      size = 28;
    } else if (GAME_STATE.canvasHeight < 360) {
      strokeWeight = 4;
      size = 32;
    } else if (GAME_STATE.canvasHeight < 480) {
      strokeWeight = 5;
      size = 36;
    }

    FONT = {
      ...FONT,
      strokeWeight,
      fill: 255,
      stroke: 0,
      size,
    };
  }

  function setupAssets() {
    const scaleRatio = GAME_STATE.canvasHeight / GAME_STATE.assetHeight;
    for (let env of Object.keys(ENVIRONMENT_SPEEDS)) {
      const speed = ENVIRONMENT_SPEEDS[env];

      ASSETS[env].resize(
        GAME_STATE.assetWidth * scaleRatio,
        GAME_STATE.assetHeight * scaleRatio
      );

      ASSETS[`${env}Flipped`].resize(
        GAME_STATE.assetWidth * scaleRatio,
        GAME_STATE.assetHeight * scaleRatio
      );

      ENVIRONMENT_IMAGES[env] = new Environment(0, speed);
      ENVIRONMENT_IMAGES[`${env}Flipped`] = new Environment(
        ASSETS[`${env}Flipped`].width,
        speed
      );
    }

    for (let logAsset of Object.keys(LOG_ASSETS)) {
      LOG_ASSETS[logAsset].resize(
        GAME_STATE.assetWidth * GAME_STATE.logScale,
        GAME_STATE.assetHeight * GAME_STATE.logScale
      );
    }

    if (BIRD_ASSETS.length > 14) {
      BIRD_ASSETS.splice(14);
    }
    for (let birdAsset of BIRD_ASSETS) {
      birdAsset.resize(BIRD_SIZE.w, BIRD_SIZE.h);
    }
  }

  function resetGameState(p5) {
    GAME_STATE = {
      logScale: 0.6,
      logWidth: 132,
      logHeight: 546,
      assetWidth: 1125,
      assetHeight: 700,
      canvasWidth: CANVAS_WIDTH_REF.current,
      canvasHeight: CANVAS_HEIGHT_REF.current,

      lives: 3,
      score: 0,
      dying: false,
      gameOver: false,
      gameStarted: false,
      increaseSpeedSteps: 15,
      increaseSpeedAtScore: 15,
      speed: Math.ceil(CANVAS_WIDTH_REF.current / (40 * 4)),
    };

    // (x, y, w, h)
    BIRD = new Bird(
      GAME_STATE.canvasWidth * 0.2,
      GAME_STATE.canvasHeight * 0.45,
      BIRD_SIZE.w,
      BIRD_SIZE.h,
      GAME_STATE.canvasHeight * 0.911
    );
    CURRENT_BIRD_INDEX = 0;

    PIPES = [];
    addPipe(p5);
  }

  function drawScore(p5) {
    p5.push();

    p5.strokeWeight(FONT.strokeWeight);
    p5.textFont(FONT.family);
    p5.textAlign(p5.CENTER);
    p5.textSize(FONT.size);
    p5.stroke(FONT.stroke);
    p5.fill(FONT.fill);
    p5.text(
      GAME_STATE.score,
      0,
      GAME_STATE.canvasHeight * 0.1,
      GAME_STATE.canvasWidth,
      FONT.size
    );

    p5.pop();
  }

  function drawGameOverMenu(p5) {
    const width = GAME_STATE.canvasWidth;
    const height = GAME_STATE.canvasHeight;
    const centerX = GAME_STATE.canvasWidth / 2;
    const centerY = GAME_STATE.canvasHeight / 2;

    p5.stroke("#3b4048");
    p5.strokeWeight(4);
    p5.fill("#e0d695");
    p5.rect(
      centerX * 0.45,
      centerY - FONT.size,
      centerX * 1.1,
      FONT.size * 2.7,
      FONT.size * 0.3
    );

    // TOP TEXT
    p5.textSize(FONT.size * 0.4);
    p5.textFont(FONT.family);
    p5.fill("#d38a5a");
    p5.strokeWeight(1);
    p5.stroke(255);

    p5.textAlign(p5.RIGHT);
    p5.text("SCORE", centerX * 1.4, centerY);

    p5.textAlign(p5.LEFT);
    p5.text("BEST", centerX * 0.59, centerY);

    // SCORES
    p5.strokeWeight(FONT.strokeWeight * 0.5);
    p5.textSize(FONT.size * 0.8);
    p5.stroke(0);
    p5.fill(255);

    p5.textAlign(p5.RIGHT);
    p5.text(GAME_STATE.score, centerX * 1.4, centerY + FONT.size * 1);

    p5.textAlign(p5.LEFT);

    p5.text(HIGHSCORE_REF.current, centerX * 0.6, centerY + FONT.size * 1);

    // GAME OVER text
    p5.strokeWeight(FONT.strokeWeight);
    p5.textFont(FONT.family);
    p5.textAlign(p5.CENTER);
    p5.textSize(FONT.size);
    p5.fill("#fca146");
    p5.stroke("#fee7d0");

    p5.text("Game Over", FONT.size * 0.25, FONT.size * 2, width, FONT.size);

    // Start again text
    if (!GAME_STATE.dying) {
      p5.textSize(FONT.size * 0.6);
      p5.stroke("#5d4150");
      p5.fill(FONT.fill);
      p5.text(
        "Tap to Start",
        0,
        GAME_STATE.canvasHeight - 2 * FONT.size * 0.6,
        GAME_STATE.canvasWidth,
        FONT.size * 0.6
      );
    }
  }

  function drawStartMenu(p5) {
    BIRD.draw(p5, BIRD_ASSETS[CURRENT_BIRD_INDEX]);

    p5.push();

    p5.strokeWeight(FONT.strokeWeight);
    p5.textFont(FONT.family);
    p5.textAlign(p5.CENTER);
    p5.textSize(FONT.size);
    p5.fill("#57d957");
    p5.stroke(255);

    p5.text("PESKY BIRD", 0, FONT.size, GAME_STATE.canvasWidth, FONT.size);

    p5.stroke("#5d4150");
    p5.fill(FONT.fill);

    p5.textSize(FONT.size * 0.6);
    p5.text(
      "Tap to Start",
      0,
      GAME_STATE.canvasHeight - 1.5 * FONT.size,
      GAME_STATE.canvasWidth,
      FONT.size * 0.6
    );

    p5.textSize(FONT.size * 0.8);
    p5.text(
      "Get Ready!",
      0,
      3 * FONT.size,
      GAME_STATE.canvasWidth,
      FONT.size * 0.8
    );

    p5.pop();
  }

  function drawForeground(p5) {
    ENVIRONMENT_IMAGES["grass"].draw(p5, ASSETS["grass"]);
    ENVIRONMENT_IMAGES["grassFlipped"].draw(p5, ASSETS["grassFlipped"]);
  }

  function drawBackground(p5) {
    ENVIRONMENT_IMAGES["sky"].draw(p5, ASSETS["sky"]);
    ENVIRONMENT_IMAGES["skyFlipped"].draw(p5, ASSETS["skyFlipped"]);

    ENVIRONMENT_IMAGES["clouds"].draw(p5, ASSETS["clouds"]);
    ENVIRONMENT_IMAGES["cloudsFlipped"].draw(p5, ASSETS["cloudsFlipped"]);

    ENVIRONMENT_IMAGES["buildings"].draw(p5, ASSETS["buildings"]);
    ENVIRONMENT_IMAGES["buildingsFlipped"].draw(p5, ASSETS["buildingsFlipped"]);

    ENVIRONMENT_IMAGES["trees"].draw(p5, ASSETS["trees"]);
    ENVIRONMENT_IMAGES["treesFlipped"].draw(p5, ASSETS["treesFlipped"]);
  }

  function updateBackground() {
    for (let env of Object.keys(ENVIRONMENT_SPEEDS)) {
      ENVIRONMENT_IMAGES[env].update(ASSETS[env]);
      ENVIRONMENT_IMAGES[`${env}Flipped`].update(ASSETS[`${env}Flipped`]);
    }
  }

  function addPipe() {
    PIPES.push(
      // (maxHeight, x, w, h, bh)
      new Pipe(
        GAME_STATE.canvasHeight,
        GAME_STATE.canvasWidth * 1.1,
        GAME_STATE.logWidth * GAME_STATE.logScale,
        GAME_STATE.logHeight * GAME_STATE.logScale,
        BIRD.h
      )
    );
  }

  return (
    <Sketch
      draw={draw}
      setup={setup}
      preload={preload}
      keyPressed={keyPressed}
      className={styles.canvas}
      mouseClicked={mouseClicked}
      disableFriendlyErrors={true}
    />
  );
}
