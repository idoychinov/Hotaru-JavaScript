/*global Kinetic, GameObject */
/*jslint plusplus: true */
/*jslint browser:true */
var GameEngine = (function () {
    'use strict';
    var bullets = [],
        i,
    // FOR testing only, will be fixed after
        //plane = new GameObject.MovingObject(100, 100, 'model', 1);
        playerPlane = new GameObject.MovingObject(100, 100, 'model', 1);

    //function updatePlanePosition(plane, direction) {
    //    plane.move(direction);
    //}

    document.body.addEventListener("keydown", function (e) {
        if (!e) {
            e = window.event;
        }
        switch (e.keyCode) {
            //Space -> pausing the game
            case 32:
                //isPaused = !isPaused;
                // left
                break;
            case 37:
                playerPlane.move('left');
                //updatePlanePosition(player, 'left')
                break;
                // up
            case 38:
                playerPlane.move('up');
                //updatePlanePosition(player, 'up')
                break;
                // right
            case 39:
                playerPlane.move('right');
                //updatePlanePosition(player, 'right')
                break;
                // down
            case 40:
                playerPlane.move('down');
                //updatePlanePosition(player, 'down')
                break;
        }
    });

    function updateBullets() {
        var bulletListLength = bullets.length,
            currentBullet;

        for (i = 0; i < bulletListLength; i++) {
            currentBullet = arguments[i];
            // Test if the bullet is inside the canvas
            if (currentBullet.y < -currentBullet.model.height || currentBullet.y > canvas.height || currentBullet.hasHitAPlane) {
                i--;
                bullets.splice(i, 1);
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
    }


}());