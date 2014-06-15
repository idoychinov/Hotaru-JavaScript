/*global Kinetic, GameObject, playerModule, animationManager */
/*jslint plusplus: true */
/*jslint browser:true */
var GameEngine = (function () {
    'use strict';
    var bullets = [],
        enemyPlanes = [],
        i,
        j,
        animFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        player,
        handle,
        movementDrections = { left: false, right: false, up: false, down: false },
        playerIsShooting = false;


    // FOR testing only, will be fixed after
    //plane = new GameObject.MovingObject(100, 100, 'model', 1);
    //playerPlane = new GameObject.Plane(100, 100, 'model', 1);

    //function updatePlanePosition(plane, direction) {
    //    plane.move(direction);
    //}



    function performMovement() {
        //TODO refactor for cleaner code and performance and locate bug with 3 direction keys pressed
        clearInterval(handle);
        handle = setInterval(planeMove, 5);

        function planeMove() {
            var movement = '',
                movementX = '',
                movementY = '';

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

            if (movementX === 'left' && player.plane.x - player.plane.model.speed < 0) {
                movementX = '';
            }
            if (movementX === "right" && player.plane.x + player.plane.model.width - player.plane.model.speed > canvas.width) {
                movementX = '';
            }
            if (movementY === "up" && player.plane.y - player.plane.model.speed < 0) {
                movementY = '';
            }
            if (movementY === "down" && player.plane.y + player.plane.model.height - player.plane.model.speed > canvas.height) {
                movementY = '';
            }

            movement = movementY + movementX;
            if (movement) {
                player.plane.move(movement, player.plane.model.speed);
            }
        }
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
                playerIsShooting = true;
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
            case 32:
                playerIsShooting = false;
                break;
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

    function updateBullets() {
        var bulletsLength = bullets.length,
            i;

        for (i = bulletsLength - 1; i >= 0; i--) {
            if (bullets[i].direction === GameObject.bulletDirectionsEnum.up) {
                if (bullets[i].y - bullets[i].model.speed < 0) {
                    bullets.splice(i, 1);
                } else {
                    bullets[i].y -= bullets[i].model.speed;
                }
            } else if (bullets[i].direction === GameObject.bulletDirectionsEnum.down) {
                if (bullets[i].y + bullets[i].model.speed > canvas.height) {
                    bullets.splice(i, 1);
                } else {
                    bullets[i].y += bullets[i].model.speed;
                }
            } else {
                console.error("Unrecognized bullet direction", bullets[i]);
            }
        }
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
                    if (currentBullet.y <= currentEnemyPlane.y + player.plane.model.height &&
                        currentBullet.x + currentBullet.model.width >= currentEnemyPlane.x &&
                        currentBullet.x <= currentEnemyPlane.x + player.plane.model.width) {
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
                    if (currentBullet.y + currentBullet.model.height >= player.y &&
                        currentBullet.x + currentBullet.model.width >= player.x &&
                        currentBullet.x <= player.x + player.plane.model.width) {
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
    function updateEnemyUnits() {
        var enemiesLength = enemyPlanes.length,
            random,
			movespeed = GameObject.planesEnum.F16.speed,
            unit;// = new GameObject.Plane(0, 0);

        for (i = enemiesLength - 1; i >= 0 ; i--) {
            unit = enemyPlanes[i];

            //AI for moving at players direction
            if (i > 0 && detectImminentCollisionBetweenEnemies(unit, enemyPlanes, movespeed * 3)) {
                unit.steeringDirection = "neutral";
            } else {

                if (unit.x > player.plane.x) {
                    unit.steeringDirection = "left";
                    unit.x -= unit.model.speed;
                } else if (unit.x < player.plane.x) {
                    unit.steeringDirection = "right";
                    unit.x += unit.model.speed;
                } else {
                    unit.steeringDirection = "neutral";

                }
            }
            unit.y += unit.model.speed;


            //Check if still in canvas
            if (unit.y < -unit.model.height || unit.x < -unit.model.width || unit.y > canvas.height || unit.x > canvas.width) {
                enemyPlanes.splice(i, 1);
            }

            if (unit.shotCooldown > 0) {
                unit.shotCooldown--;
            }
            if (unit.shotCooldown == 0) {
                random = (Math.random() * 6) | 0;
                bullets.push(unit.fireBullet(GameObject.bulletDirectionsEnum.down));
                unit.shotCooldown = unit.currentBulletType.rateOfFire * (5 + random);
            }
        }
        //if (!unit.lastMove) {
        //    unit.lastMove = 'right';
        //}

        //random = Math.random();
        //if (unit.isAlive === false) {
        //    enemyPlanes.splice(i, 1);
        //    i--;
        //    enemiesLength--;
        //} else {
        //    random = Math.random();
        //    //Update position X
        //    //if (random < 0.9) {
        //    random = Math.random();
        //    // move on same direction if random < 0.98
        //    if (random < 0.98) {
        //        // move
        //        if (unit.lastMove === 'left') {
        //            unit.x -= movespeed;
        //        } else {
        //            unit.x += movespeed;
        //        }
        //    } else {
        //        if (unit.lastMove === 'left') {
        //            unit.x += movespeed;
        //            unit.lastMove = 'right';
        //        } else {
        //            unit.x -= movespeed;
        //            unit.lastMove = 'left';
        //        }
        //    }
        //}

        //Update position Y
        //unit.y += unit.ySpeed;
        //var testEnemy = new GameObject.Plane((Math.random() * 400) | 0, (-(Math.random() * 300) - 100) | 0, GameObject.planesEnum.F16);
        //testEnemy.ySpeed = ((Math.random() * 4) + 1) | 0;
        //enemyPlanes.push(testEnemy);

    }

    // UNFINISHED
    function detectImminentCollisionBetweenEnemies(enemy, enemyList, detectionDistance) {

        for (var i = 0; i < enemyList.length; i++) {
            if (enemy !== enemyList[i]) {
                if (enemy.x + detectionDistance >= enemyList[i].x || enemy.x - detectionDistance <= enemyList[i].x) {
                    return true;
                }
            }
        }
        return false;
    }

    function respawnEnemies() {
        var enemyX,
            enemyY,
            enemyModel = GameObject.planesEnum.F16,
            spawnedEnemy,
            enemiesLength = enemyPlanes.length,
            spawnChanceTreshhold = Math.floor((Math.random() * 10000) + 1),  // determins the chance for spawn.
            enemySpawnChanceRates = [1000, 200, 50]; // determins the chance for spawning new enemy based on how many enemyies are currently on the field

        // check if there is defined spawn rate for the current numer of enemies and if there is compere it to the treshhold for spawning new enemy
        if (!isNaN(enemySpawnChanceRates[enemiesLength])) {
            if (enemySpawnChanceRates[enemiesLength] > spawnChanceTreshhold) {
                enemyX = (Math.random() * canvas.width + 1) | 0;
                if (enemyX > canvas.width - enemyModel.width) {
                    enemyX = canvas.width - enemyModel.width;
                }
                enemyY = -enemyModel.height;

                spawnedEnemy = new GameObject.Plane(enemyX, enemyY, enemyModel);
                spawnedEnemy.currentBulletType = GameObject.bulletsEnum.enemyBullet;
                enemyPlanes.push(spawnedEnemy)
            }
        }
    }

    function updatePlayerPlane() {
        if (player.plane.shotCooldown > 0) {
            player.plane.shotCooldown--;
        }
        if (playerIsShooting && player.plane.shotCooldown == 0) {
            bullets.push(player.plane.fireBullet(GameObject.bulletDirectionsEnum.up));
            player.plane.shotCooldown = player.plane.currentBulletType.rateOfFire;
        }


    }

    function getPlayer() {
        return player;
    }

    function getEnemies() {
        return enemyPlanes;
    }

    function getBullets() {
        return bullets;
    }

    function init() {
        var playerPlane = new GameObject.Plane(300, 400, GameObject.planesEnum.T50);
        player = new playerModule.Player("Stamat", playerPlane);

        //for (var i = 0; i < 3; i += 1) {
        //    var testEnemy = new GameObject.Plane((Math.random() * 400) | 0, (-(Math.random() * 300) - 100) | 0, GameObject.planesEnum.F16);
        //    testEnemy.ySpeed = ((Math.random() * 4) + 1) | 0;
        //    enemyPlanes.push(testEnemy);
        //}

        animFrame(gameLoop);
    }

    // Idea - Game loop with timestamp for runing the game more smothly
    // var now,delta, last = timestamp()
    // Timer - used for making the game loop run smoothly.
    //function timestamp() {
    //    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    //}
    //function gameLoop() {
    //    now = timestamp();
    //    delta = Math.min(1,(now - last) / 1000); // capping delta to 1 sec if for example the browser loses focus.

    //    update(delta);
    //    render(delta);
    //    last = now;

    //    animFrame(gameLoop);
    //}

    // Game logic
    function gameLoop() {
        update();
        render();
        animFrame(gameLoop);
    }

    function update() {
        updatePlayerPlane();
        updateEnemyUnits();
        //moveEnemyUnits();
        updateBullets();
        respawnEnemies();
        //checkForCollisions();
    }

    function render() {
        animationManager.render();
    }



    return {
        init: init,
        getPlayer: getPlayer,
        getEnemies: getEnemies,
        getBullets: getBullets
    };
}());