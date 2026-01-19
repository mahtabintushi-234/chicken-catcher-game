/*
  File: script.js
  Student: Mahtabin Tushi
  Student Number: 000952184
  Date: 2025-07-24

  Description:
  Core game logic for the "Happy Chicken Catcher" project.
  This script manages:
  - SVG rendering for chickens and basket
  - Random chicken spawning
  - Falling animation and movement updates
  - Collision detection between chickens and basket
  - Score and life tracking
  - Game loop timing and game-over handling
*/


// ---------------------------------------------------------
// Global Game Variables
// ---------------------------------------------------------

// Reference to the SVG game area
const svg = document.getElementById("gameArea");

// Game state
let score = 0;
let lives = 10;

// Basket and chicken tracking
let basket;
let chickens = [];        // Stores all active chickens
let gameInterval;         // Controls the main game loop timer

// Basket dimensions and starting position
const basketWidth = 100;
const basketHeight = 20;
let basketX = 160;


// ---------------------------------------------------------
// Basket Creation
// ---------------------------------------------------------

/**
 * Creates the basket as an SVG <rect> element and places it
 * near the bottom of the game area. The basket is used to
 * catch falling chickens.
 */
function createBasket() {
  basket = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  basket.setAttribute("x", basketX);
  basket.setAttribute("y", 460);
  basket.setAttribute("width", basketWidth);
  basket.setAttribute("height", basketHeight);
  basket.setAttribute("fill", "#e17055");
  svg.appendChild(basket);
}


// ---------------------------------------------------------
// Chicken Spawning
// ---------------------------------------------------------

/**
 * Creates a new chicken using SVG shapes (ellipse, circle,
 * polygon). Each chicken is placed at a random horizontal
 * position and begins falling from the top of the screen.
 */
function spawnChicken() {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const x = Math.random() * (400 - 30); // Random X position
  g.setAttribute("transform", `translate(${x}, 0)`);

  // Chicken body
  const body = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  body.setAttribute("cx", 15);
  body.setAttribute("cy", 15);
  body.setAttribute("rx", 15);
  body.setAttribute("ry", 10);
  body.setAttribute("fill", "yellow");

  // Chicken eye
  const eye = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  eye.setAttribute("cx", 22);
  eye.setAttribute("cy", 12);
  eye.setAttribute("r", 2);
  eye.setAttribute("fill", "black");

  // Chicken beak
  const beak = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  beak.setAttribute("points", "30,15 25,13 25,17");
  beak.setAttribute("fill", "orange");

  // Assemble chicken
  g.appendChild(body);
  g.appendChild(eye);
  g.appendChild(beak);

  // Add to SVG and tracking array
  svg.appendChild(g);
  chickens.push({ element: g, x: x, y: 0 });
}


// ---------------------------------------------------------
// Chicken Movement & Collision Detection
// ---------------------------------------------------------

/**
 * Moves all active chickens downward, updates their position
 * on screen, and checks whether they are caught by the basket
 * or missed by the player.
 */
function moveChickens() {
  chickens.forEach((chicken, index) => {
    // Move chicken downward
    chicken.y += 2;
    chicken.element.setAttribute("transform", `translate(${chicken.x}, ${chicken.y})`);

    // Collision: chicken caught by basket
    if (
      chicken.y >= 460 &&
      chicken.x + 15 >= basketX &&
      chicken.x + 15 <= basketX + basketWidth
    ) {
      score++;
      updateScore();
      svg.removeChild(chicken.element);
      chickens.splice(index, 1);
    }

    // Chicken missed (falls off screen)
    else if (chicken.y > 500) {
      lives--;
      updateLives();
      svg.removeChild(chicken.element);
      chickens.splice(index, 1);

      if (lives <= 0) endGame();
    }
  });
}


// ---------------------------------------------------------
// UI Updates
// ---------------------------------------------------------

/**
 * Updates the score display in the DOM.
 */
function updateScore() {
  document.getElementById("score").textContent = score;
}

/**
 * Updates the lives display in the DOM.
 */
function updateLives() {
  document.getElementById("lives").textContent = lives;
}


// ---------------------------------------------------------
// Basket Movement
// ---------------------------------------------------------

/**
 * Moves the basket left, ensuring it stays within bounds.
 */
function moveBasketLeft() {
  if (basketX > 0) {
    basketX -= 10;
    basket.setAttribute("x", basketX);
  }
}

/**
 * Moves the basket right, ensuring it stays within bounds.
 */
function moveBasketRight() {
  if (basketX < 400 - basketWidth) {
    basketX += 40;
    basket.setAttribute("x", basketX);
  }
}


// ---------------------------------------------------------
// Game Loop
// ---------------------------------------------------------

/**
 * Main game loop. Runs repeatedly to spawn chickens and
 * update their movement. This function is executed every
 * 50ms to simulate animation.
 */
function gameLoop() {
  if (Math.random() < 0.02) {
    spawnChicken();
  }
  moveChickens();
}


// ---------------------------------------------------------
// Game Over Handling
// ---------------------------------------------------------

/**
 * Stops the game and displays the final score. Prompts the
 * player to restart the game.
 */
function endGame() {
  clearInterval(gameInterval);
  if (confirm("Game Over! Final Score: " + score + "\nPlay again?")) {
    location.reload();
  }
}


// ---------------------------------------------------------
// Game Initialization
// ---------------------------------------------------------

// Create basket and start the game loop
createBasket();
gameInterval = setInterval(gameLoop, 50);

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") moveBasketLeft();
  if (e.key === "ArrowRight") moveBasketRight();
});
