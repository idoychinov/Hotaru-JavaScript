/*global Kinetic, GameEngine, GameObject, playerModule */
/*jslint plusplus: true */
/*jslint browser:true */
var animationManager = (function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        player,
        enemies,
        bullets,
        enemiesCount,
        explosion,
        stage = new Kinetic.Stage({
            container: "kinetic-stage",
            width: canvas.getAttribute("width"),
            height: canvas.getAttribute("height"),
        }),
        layer = new Kinetic.Layer(),
        imageObj = new Image(),
        frameCount = 0;

    function drawPlane(plane) {
        if (plane.steeringDirection == 'neutral') {
            ctx.drawImage(plane.model.model, 0, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else if (plane.steeringDirection == 'left') {
            ctx.drawImage(plane.model.model, 142, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else if (plane.steeringDirection == 'right') {
            ctx.drawImage(plane.model.model, 284, 0, 142, 210, plane.x, plane.y, plane.model.width, plane.model.height);
        } else {
            console.error("Unrecognized steeringDirection", plane.steeringDirection)
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
            ctx.drawImage(bullet.model.model, bullet.x, bullet.y, bullet.model.width, bullet.model.height);
        }
    }
    function triggerExplosion(coordinateX, coordinateY, objectWidth, objectHeight) {


        imageObj.src = "textures/explosion-sprite.png";

        frameCount = 0;
        explosion = new Kinetic.Sprite({
            x: coordinateX,
            y: coordinateY,
            width: objectWidth,
            height: objectHeight,
            image: imageObj,
            animation: 'explode',
            animations: {
                explode: [
                    0, 0, 65, 65,
                    65, 0, 65, 65,
                    130, 0, 65, 65,
                    195, 0, 65, 65,
                    0, 65, 65, 65,
                    65, 65, 65, 65,
                    130, 65, 65, 65,
                    195, 65, 65, 65,
                    0, 130, 65, 65,
                    65, 130, 65, 65,
                    130, 130, 65, 65,
                    195, 130, 65, 65,
                    0, 195, 65, 65,
                    65, 195, 65, 65,
                    130, 195, 65, 65,
                    195, 195, 65, 65,
                ]
            },
            frameRate: 7,
            frameIndex: 0
        });

        function onFrameIndexChange() {
            frameCount++;
            if (frameCount >= 8) {
                this.stop();
                frameCount = 0;
                layer.remove(this);
                this.destroy();
            }
        }
        explosion.on("frameIndexChange", onFrameIndexChange)
        layer.add(explosion);
        stage.add(layer);
        explosion.start();
    }

    function respawnPlayer(callback) {
        var respawnLayer = new Kinetic.Layer(),
            interval,
            secondsToRespawn = 3,
            respawnText = "Respawn in ",
            text = new Kinetic.Text({
                x: 100,
                y: 200,
                text: respawnText + secondsToRespawn,
                fontSize: 120,
                fontWeight: "bold",
                fontFamily: "IrisUPC,Arial",
                fill: "green",
                stroke: "white",
                strokeWidth: 2
            });

        respawnLayer.add(text);
        stage.add(respawnLayer);
        interval = setInterval(countDown, 1000);

        function countDown() {
            secondsToRespawn--;
            respawnLayer.remove(text);
            stage.remove(respawnLayer);
            text.setText(respawnText + secondsToRespawn);
            respawnLayer.add(text);
            stage.add(respawnLayer);

            if (secondsToRespawn <= 0) {
                clearInterval(interval);
                respawnLayer.remove(text);
                stage.remove(respawnLayer);
                callback();
            }
        }

    }

    function gameOver(callback) {
        var respawnLayer = new Kinetic.Layer(),
            respawnText = "Respawn in ",
            text = new Kinetic.Text({
                x: 10,
                y: 100,
                text: "Game Over",
                fontSize: 200,
                fontWeight: "bold",
                fontFamily: "IrisUPC,Arial",
                fill: "red",
                stroke: "white",
                strokeWidth: 2
            }),
            startNew = new Kinetic.Text({
                x: 30,
                y: 250,
                text: "Press any key to start new game",
                fontSize: 70,
                fontWeight: "bold",
                fontFamily: "IrisUPC,Arial",
                fill: "red",
                stroke: "white",
                strokeWidth: 1
            });

        respawnLayer.add(text);
        respawnLayer.add(startNew);
        stage.add(respawnLayer);

        window.addEventListener("click", onKeyPressed);
        window.addEventListener("onMousedown", onKeyPressed);

        function onKeyPressed() {
            respawnLayer.remove(text);
            respawnLayer.remove(startNew);
            stage.remove(respawnLayer);
            window.removeEventListener("click", onKeyPressed);
            window.removeEventListener("keydown", onKeyPressed);
            callback();
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
        render: render,
        respawnPlayer: respawnPlayer,
        triggerExplosion: triggerExplosion,
        gameOver: gameOver
    };
}());