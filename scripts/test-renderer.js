/*global Kinetic, GameEngine, GameObject, playerModule */
/*jslint plusplus: true */
/*jslint browser:true */
var animationManager = (function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        player,
        enemies,
        bullets,
        enemiesCount;

    function drawPlane(plane) {
        if (plane.steeringDirection == 'neutral') {
            ctx.drawImage(plane.model.model, 0, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else if (plane.steeringDirection == 'left') {
            ctx.drawImage(plane.model.model, 142, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else if(plane.steeringDirection == 'right'){
            ctx.drawImage(plane.model.model, 284, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else {
            console.error("Unrecognized steeringDirection",plane.steeringDirection)
        }
    }

    function drawEnemies() {
        enemiesCount = enemies.length;
        for (i = 0; i < enemiesCount; i++) {
            var enemy = enemies[i];
            ctx.drawImage(enemy.model.model, enemy.x, enemy.y, enemy.model.width, enemy.model.height);
        }
    }

    function drawBullets() {
        bulletCount = bullets.length;
        for (i = 0; i < bulletCount; i++) {
            var bullet = bullets[i];
            ctx.fillRect(bullet.x, bullet.y, bullet.model.width, bullet.model.height);
        }
    }

    function render() {
        /*
         * @changes:
         * - add clearRect on every frame (avoiding image repetition)
         * - changed canvas background to transparent
         */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.fillStyle = "#001000";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.font = "18px Arial";
        //ctx.fillStyle = "red";
        //displayMessage = 'Score : ' + score.toString() + ", Level : " + level;
        //ctx.fillText(displayMessage, 10, canvas.height - 10);
        player = GameEngine.getPlayer();
        enemies = GameEngine.getEnemies();
        bullets = GameEngine.getBullets();
        drawPlane(player.plane);
        drawEnemies(enemies);
        drawBullets(bullets);
    }

    return {
        render: render
    };
}());