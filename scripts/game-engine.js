/*global Kinetic, GameObject, playerModule, animationManager */
/*jslint plusplus: true */
/*jslint browser:true */
var GameEngine = (function () {
    'use strict';
    var bullets = [],
        enemyPlanes = [],
        i,
        j,
        PLANE_MODEL_HEIGHT = 20, //TODO Have to be changed with variable according to the height of the specific plane image
        PLANE_MODEL_WIDTH = 20,
        BULLET_MODEL_HEIGHT = 40,
        BULLET_MODEL_WIDTH = 10,
        player;

    // FOR testing only, will be fixed after
    //plane = new GameObject.MovingObject(100, 100, 'model', 1);
    //playerPlane = new GameObject.Plane(100, 100, 'model', 1);

    //function updatePlanePosition(plane, direction) {
    //    plane.move(direction);
    //}
        
    var handle,
        down = false;
    
    function performMovement(direction) {
        if (!down) {
            down = true;
            handle = setInterval(function() {
                player.plane.move(direction);
                direction==='left'?player.plane.steeringDirection = 'left':direction==='right'?player.plane.steeringDirection = 'right':'neutral';
            }, 5);
        }
    }
    document.body.addEventListener("keyup", function (e) {
        player.plane.steeringDirection = 'neutral';
    });

        document.body.addEventListener("keydown", function (e) {
        if (!e) {
            e = window.event;
        }
                switch (e.keyCode) {
            //Space -> pausing the game
            case 32:
                //isPaused = !isPaused;
                //left
                break;
            case 37:
                performMovement('left');
                break;
            case 38:
                performMovement('up');
                break;
            case 39:
                performMovement('right');
                break;
            case 40:
                performMovement('down');
                break;
        }
    });
    
    document.body.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 37: case 38: case 39: case 40:          
                clearInterval(handle);
                down = false;
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
            unit = new GameObject.Plane(0, 0);

        for (i = 0; i < enemiesLength; i++) {
            unit = enemyPlanes[i];
            random = Math.random();
            if (unit.isAlive === false) {
                enemyPlanes.splice(i, 1);
                i--;
                enemiesLength--;
            } else {
                //Update position
                if (random < 0.20) {
                    unit.x -= 1;
                } else if (random < 0.30) {
                    unit.x -= 1;
                    unit.y += 1;
                } else if (random < 0.40) {
                    unit.x += 1;
                    unit.y += 1;
                }
                if (random < 0.80) {
                    unit.y += 1;
                } else {
                    unit.x += 1;
                }

                //Check if still in canvas
                if (unit.y < -unit.model.height || unit.x < -unit.model.width || unit.y > canvas.height || unit.x > canvas.width) {
                    enemyPlanes.splice(i, 1);
                    i--;
                    enemiesLength--;
                }
            }
        }
    }

    function getPlayer(){
        return player;
    }

    function init() {
        var playerPlane = new GameObject.Plane(100, 100, GameObject.planesEnum.T50);
        player = new playerModule.Player("Stamat", playerPlane);
        animationManager.init();
    }

    // Game logic
    function gameLoop() {

    }

    return {
        init: init,
        getPlayer: getPlayer
    };
}());