/*global Kinetic, GameEngine, GameObject, playerModule */
/*jslint plusplus: true */
/*jslint browser:true */
var animationManager = (function () {


    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        animFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    function drawPlane(plane) {
        ctx.drawImage(plane.model, plane.x, plane.y, 50, 74)
    }


    function animLoop() {

        ctx.fillStyle = "#001000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.font = "18px Arial";
        //ctx.fillStyle = "red";
        //displayMessage = 'Score : ' + score.toString() + ", Level : " + level;
        //ctx.fillText(displayMessage, 10, canvas.height - 10);
        var player = GameEngine.getPlayer();
        drawPlane(player.plane);
        alert('f');
        animFrame(animLoop);

    }

    function init() {
        animFrame(animLoop);
    }

    return {
        init: init
    };
}());