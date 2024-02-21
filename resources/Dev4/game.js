/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

const gridSize = 10; // grid size
const snake = [{x: 2, y: 0}, {x: 1, y: 0}, {x:0, y: 0}]; //Initial snake position
let food = [{x: 6, y: 4}, {x: 3, y: 7}, {x: 8, y: 2}]; //Initial food positions
let direction = "down"; //Initial movement direction
let interval = 450; //Snake movement in intervals in millisecond
let gameOver = false;

PS.init = function( system, options ) {
    PS.gridSize(gridSize, gridSize);
    PS.gridColor(PS.COLOR_BLACK);
    PS.statusColor(PS.COLOR_WHITE);
    drawSnake();
    drawFood();
    PS.statusText("Navigate the snake to eat!");
    setInterval(moveSnake, interval);

    restartGame();
	// Add any other initialization code you need here.
};
//Function to draw out the snake
function drawSnake(){
    snake.forEach(segment => {
        PS.color(segment.x, segment.y, PS.COLOR_GREEN);
    });
}

function drawFood(){
    food.forEach(item => {
        PS.color(item.x, item.y, PS.COLOR_RED);
    });
}

function moveSnake() {
    if(gameOver){
        return;
    }
    const head = {x: snake[0].x, y: snake[0].y};
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    // Check for collision with walls or own tail
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        PS.statusText("Game Over! Press Space to restart.");
        return;
    }
    let ateFood = false;
    food.forEach((item, index) => {
        if (head.x === item.x && head.y === item.y) {
            food.splice(index, 1);
            ateFood = true;
            interval -= 20;
            PS.statusText("NOM");
        }
    });
    if (!ateFood) {
        snake.pop();
    }
    snake.unshift(head);
    PS.gridPlane();
    drawSnake();
    drawFood();
    if ( food.length === 0) {
        gameOver = true;
        PS.statusText(" Congrats! Game End ");
    }
}

PS.keyDown= function( key, shift, ctrl, options ) {
    if (gameOver){
        if ( key === PS.KEY_SPACE) {
            restartGame();
        }
        return;
    }
    switch (key) {
        case PS.KEY_ARROW_UP:
            if (direction !== "down") direction = "up";
            break;
        case PS.KEY_ARROW_DOWN:
            if (direction !== "up") direction = "down";
            break;
        case PS.KEY_ARROW_LEFT:
            if (direction !== "right") direction = "left";
            break;
        case PS.KEY_ARROW_RIGHT:
            if (direction !== "left") direction = "right";
            break;
        }
    }

function restartGame() {

    snake.splice(0, snake.length, {x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0});
    food = [{x: 6, y: 4}, {x: 3, y: 7}, {x: 8, y: 2}];
    direction = "down";
    gameOver = false;
    PS.statusText("Navigate the snake to eat!");
}


