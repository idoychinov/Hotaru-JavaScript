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
            ctx.drawImage(plane.model, 0, 0, 142, 210, plane.x, plane.y, 50, 74);
        } else if (plane.steeringDirection == 'left') {
            ctx.drawImage(plane.model, 142, 0, 142, 210, plane.x, plane.y, 50, 74);
        } else {
            ctx.drawImage(plane.model, 284, 0, 142, 210, plane.x, plane.y, 50, 74);
        }
    }

    function drawEnemies() {
        enemiesCount = enemies.length;
        for (i = 0; i < enemiesCount; i++) {
            var enemy = enemies[i];
            ctx.drawImage(enemy.model, enemy.x, enemy.y, enemy.model.width / 2, enemy.model.height / 2);
        }
    }

    function drawBullets() {
        bulletCount = bullets.length;
        for (i = 0; i < bulletCount; i++) {
            var bullet = bullets[i];
            ctx.fillRect(bullet.x, bullet.y, 5, 10);
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