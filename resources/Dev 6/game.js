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
let gameOver = false;
let head_x = 1;
let head_y = 0;
let GRID_X = 9;
let GRID_Y = 9;
let snake_length = 2;
let fruit_x = 5;
let fruit_y = 5;
let fruitCounter = 0;
let snakeSegments = []; //this variable will be a FILO queue
                        //position 0 in the array is always the snake head


PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize( GRID_X, GRID_Y );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.

    PS.color(1, 0, PS.COLOR_GREEN); //snake head
    snakeSegments[0] = [1,0];
    PS.color(0, 0, PS.COLOR_GREEN);
    snakeSegments[1] = [0,0];
    collectFruit();

    PS.color(fruit_x,fruit_y, PS.COLOR_RED);
};


/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

    //PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

    switch (key) {
        case PS.KEY_ARROW_UP:
            moveSnake(0, -1);
            break;
        case PS.KEY_ARROW_DOWN:
            moveSnake(0, 1);
            break;
        case PS.KEY_ARROW_LEFT:
            moveSnake(-1, 0);
            break;
        case PS.KEY_ARROW_RIGHT:
            moveSnake(1, 0);
            break;
        //case PS.KEY_SPACE:
        //    handleGameOver();
        //    break;
    }

	// Add code here for when a key is pressed.
};

function moveSnake(change_x, change_y)
{
    //check for game over
    if (gameOver)
    {
        handleGameOver();
        //TODO: handle any game over things
        return;
    }

    //process head move
    //calculate new proposed x and y
    let nx = head_x + change_x;
    let ny = head_y + change_y;

    //check if going off grid?
    if ( ( nx < 0 ) || ( nx >= GRID_X ) || ( ny < 0 ) || ( ny >= GRID_Y ) ) {
        gameOver = true;
        handleGameOver();
        return;
    }

    for (let i = 0; i < snakeSegments.length; i++) {
        if (nx === snakeSegments[i][0] && ny === snakeSegments[i][1]) {
            gameOver = true; // colliding with body = game over
            //PS.debug("Self collide");
            handleGameOver();
            return;
        }
    }

    //check if head overlaps with fruit
    let collectedFruit = false;
    if (nx == fruit_x && ny == fruit_y)
    {
        //PS.debug("fruit collected!");
        //we collected a fruit
        collectFruit(fruit_x, fruit_y);
        collectedFruit = true;
        const clickSounds = ["fx_bloop", "fx_blip", "fx_pop"];

        const randomIndex = Math.floor(Math.random() * clickSounds.length);
        const audioFile = clickSounds[randomIndex];

        PS.audioPlay(audioFile);
        fruitCounter ++;
        PS.statusText("NOM NOM: " + fruitCounter);

        //TODO: handle random fruit moving here
        //fruit_x = -1;
        //fruit_y = -1;
    }


    //if we got here, move is valid. move the snake head
    head_x = nx;
    head_y = ny;
    snakeSegments.unshift([head_x, head_y]); //add the new snake head location to the beginning of the array

    PS.color(nx, ny, PS.COLOR_GREEN);

    //process tail move
    if(collectedFruit)
    {
        //fruit collected; don't move the tail and grow the snake
        snakeSegments.push(); //add a new snake segment to the end of the array
    }
    else
    {
        //fruit not collected; just move the tail normally
        let coordToErase = snakeSegments.pop(); // remove the last segment from the end of the array
        PS.color(coordToErase[0], coordToErase[1], PS.COLOR_WHITE);
    }

}


//handles fruit collection behavior
function collectFruit()
{
    let newFruit_x = PS.random(GRID_X - 1); // Generates a random number between 0 and GRID_X-1
    let newFruit_y = PS.random(GRID_Y - 1); // Generates a random number between 0 and GRID_Y-1

    while (isSnakeSegment(newFruit_x, newFruit_y))
    {
        newFruit_x = PS.random(GRID_X - 1);
        newFruit_y = PS.random(GRID_Y - 1);
    }
    fruit_x = newFruit_x;
    fruit_y = newFruit_y;
    PS.color(fruit_x, fruit_y, PS.COLOR_RED);
}

function isSnakeSegment(x,y)
{
    for (let i = 0; i < snakeSegments.length; i++)
    {
        if (snakeSegments[i][0] === x && snakeSegments[i][1] === y)
        {
            return true;
        }
    }
    return false;
}

function resetGame() {
    gameOver = false;
    head_x = 1;
    head_y = 0;
    snake_length = 2;
    snakeSegments = [];
    snakeSegments[0] = [1, 0];
    snakeSegments[1] = [0, 0];
    fruit_x = 5;
    fruit_y = 5;
    fruitCounter = 0;
    PS.gridColor(PS.COLOR_BLACK); // Reset grid color
    PS.statusText("Try Again >:)"); // Clear status text
    PS.audioPlay("fx_bloink");
    PS.gridPlane(0); // Reset grid plane
    PS.gridSize(GRID_X, GRID_Y); // Reset grid size

    for (let i = 0; i < GRID_X; i++) {
        for (let j = 0; j < GRID_Y; j++) {
            PS.color(i, j, PS.COLOR_WHITE);
        }
    }

    // Reset snake head color
    PS.color(head_x, head_y, PS.COLOR_GREEN);

    // Reset initial snake segments color
    PS.color(0, 0, PS.COLOR_GREEN);
    PS.color(1, 0, PS.COLOR_GREEN);

    // Place initial fruit
    collectFruit();
}

function handleGameOver() {
    gameOver = true;
    PS.statusText("Game Over");

    resetGame();
}



/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

