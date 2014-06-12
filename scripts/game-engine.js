/*global Kinetic, GameObject, playerModule, animationManager */
/*jslint plusplus: true */
/*jslint browser:true */
var GameEngine = (function () {
    'use strict';
    var bullets = [],
        enemyPlanes = [],
        i,
        j,
        PLANE_MODEL_HEIGHT = 74, //TODO Have to be changed with variable according to the height of the specific plane image
        PLANE_MODEL_WIDTH = 50, //TODO Have to be changed with variable according to the width of the specific plane image
        BULLET_MODEL_HEIGHT = 40,
        BULLET_MODEL_WIDTH = 10,
        DIRECTION_DELTA = 1,
        player;


    // FOR testing only, will be fixed after
    //plane = new GameObject.MovingObject(100, 100, 'model', 1);
    //playerPlane = new GameObject.Plane(100, 100, 'model', 1);

    //function updatePlanePosition(plane, direction) {
    //    plane.move(direction);
    //}

    var handle,
        movementDrections = { left: false, right: false, up: false, down: false };

    function performMovement() {
        //TODO refactor for cleaner code and performance and locate bug with 3 direction keys pressed
        clearInterval(handle);
        handle = setInterval(planeMove, 5)

        function planeMove() {
            var movement = '',
                movementX = '',
                movementY = '',
                isInPlayField = true;

            player.plane.steeringDirection = 'neutral';
            if (movementDrections.up) {
                movementY = "up";
            }
            if (movementDrections.down) {
                if (movementDrections.up) {
                    movementY = '';
                } else {
                    movementY = 'down';
                }
            }

            if (movementDrections.left) {
                movementX = "left";
                player.plane.steeringDirection = 'left';
            }
            if (movementDrections.right) {
                if (movementDrections.left) {
                    movementX = '';
                } else {
                    movementX = 'right';
                    player.plane.steeringDirection = 'right';
                }
            }

            if (movementX === 'left' && player.plane.x - DIRECTION_DELTA < 0) {
                movementX = '';
            }
            if (movementX === "right" && player.plane.x + PLANE_MODEL_WIDTH - DIRECTION_DELTA > 700) {
                movementX = '';
            }
            if (movementY === "up" && player.plane.y - DIRECTION_DELTA < 0) {
                movementY = '';
            }
            if (movementY === "down" && player.plane.y + PLANE_MODEL_HEIGHT - DIRECTION_DELTA > 500) {
                movementY = '';
            }

            movement = movementY + movementX;
            if(movement){
                player.plane.move(movement, DIRECTION_DELTA);
            }
        }

        ;
    }

    document.body.addEventListener("keydown", function (e) {
        if (!e) {
            e = window.event;
        }
        switch (e.keyCode) {

            //Space -> pausing the game
            case 27:
                //isPaused = !isPaused;
                //left
                break;
                // Space -> shoot TODO
            case 32:

                break;
                // Ctrl -> special (bomb limited uses) TODO
            case 17:

                break;
            case 37:
                movementDrections.left = true;
                performMovement();
                break;
            case 38:
                movementDrections.up = true;
                performMovement();
                break;
            case 39:
                movementDrections.right = true;
                performMovement();
                break;
            case 40:
                movementDrections.down = true;
                performMovement();
                break;
        }
    });

    document.body.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37:
                movementDrections.left = false;
                performMovement();
                break;
            case 38:
                movementDrections.up = false;
                performMovement();
                break;
            case 39:
                movementDrections.right = false;
                performMovement();
                break;
            case 40:
                movementDrections.down = false;
                performMovement();
                break;
        }
    });

    function generateUnit(unitType, unitModel, x, y) {
        if (unitType === 'plane') {
            return new GameObject.Plane(x, y, unitModel);
        }

        throw new Error('Unknown unit type');

    }

    // Checks for every bullet it's position and if it's outside the canvas
    // It deletes it
    function updateBullets() {
        var bulletListLength = bullets.length,
            currentBullet;

        for (i = 0; i < bulletListLength; i++) {
            currentBullet = arguments[i];
            // Test if the bullet is inside the canvas
            if (currentBullet.y < -currentBullet.model.height || currentBullet.y > canvas.height || currentBullet.hasHitAPlane) {
                bullets.splice(i, 1);
                i--;
                bulletListLength = bullets.length;
            } else {
                // If the bullet is inside we are changing it's position
                if (currentBullet.direction === 'up') {
                    currentBullet.y -= 1;
                } else if (currentBullet.direction === 'down') {
                    currentBullet.y += 1;
                } else {
                    throw new Error('Problem with the bullet direction');
                }
            }
        }

        return bullets;
    }

    function checkForBulletHit() {
        var bulletListLength = bullets.length,
            currentBullet,
            enemyPlanesListLength = enemyPlanes.lenth,
            currentEnemyPlane;

        for (i = 0; i < bulletListLength; i++) {
            currentBullet = arguments[i];
            if (currentBullet.direction === 'up') {
                for (j = 0; j < enemyPlanesListLength; j++) {
                    currentEnemyPlane = arguments[j];
                    if (currentBullet.y <= currentEnemyPlane.y + PLANE_MODEL_HEIGHT &&
                        currentBullet.x + BULLET_MODEL_WIDTH >= currentEnemyPlane.x &&
                        currentBullet.x <= currentEnemyPlane.x + PLANE_MODEL_WIDTH) {
                        bullets.splice(i, 1);
                        i--;
                        bulletListLength = bullets.length;
                        enemyPlanes.splice(j, 1);
                        j--;
                        enemyPlanesListLength = enemyPlanes.length;

                        // TODO LOGIC FOR EXPLOSION
                    }
                }
            } else {
                if (currentBullet.direction === 'down') {
                    if (currentBullet.y + BULLET_MODEL_HEIGHT >= player.y &&
                        currentBullet.x + BULLET_MODEL_WIDTH >= player.x &&
                        currentBullet.x <= player.x + PLANE_MODEL_WIDTH) {
                        bullets.splice(i, 1);
                        i--;
                        bulletListLength = bullets.length;
                        player.plane.isAlive = false; //TODO Maybe has to be changed with other game logic
                    }
                }
            }
        }
    }

    // Moving all of the enemy units. At this time only planes
    function moveEnemyUnits() {
        var enemiesLength = enemyPlanes.length,
            random,
			movespeed = 2,
            unit;// = new GameObject.Plane(0, 0);

        for (i = 0; i < enemiesLength; i++) {
            unit = enemyPlanes[i];
			
			if(!unit.lastMove) {
				unit.lastMove = 'right';
			}
			
            random = Math.random();
            if (unit.isAlive === false) {
                enemyPlanes.splice(i, 1);
                i--;
                enemiesLength--;
            } else {
				random = Math.random();
                //Update position X
                if (random < 0.5) {
					random = Math.random();
					// move on same direction if random < 0.98
					if (random < 0.98) {
						// move
						if(unit.lastMove === 'left') {
							unit.x -= movespeed;
						} else {
							unit.x += movespeed;
						}
					} else {
						if(unit.lastMove === 'left') {
							unit.x += movespeed;
							unit.lastMove = 'right';
						} else {
							unit.x -= movespeed;
							unit.lastMove = 'left';
						}
					}
                }
				
				//Update position Y
				unit.y += 1;
				
                //Check if still in canvas
                if (unit.y < -unit.model.height || unit.x < -unit.model.width || unit.y > canvas.height || unit.x > canvas.width) {
                    enemyPlanes.splice(i, 1);
                    i--;
                    enemiesLength--;
                }
            }
        }
    }

    function getPlayer() {
        return player;
    }

    function getEnemies() {
        return enemyPlanes;
    }

    function init() {
        var playerPlane = new GameObject.Plane(200, 200, GameObject.planesEnum.T50);
        player = new playerModule.Player("Stamat", playerPlane);
        var testEnemy = new GameObject.Plane(0, 0, GameObject.planesEnum.F16);
        enemyPlanes.push(testEnemy);
        animationManager.init();
    }

    // Game logic
    function gameLoop() {

    }

    return {
        init: init,
        getPlayer: getPlayer,
        getEnemies: getEnemies,
        moveEnemyUnits: moveEnemyUnits

    };
}());