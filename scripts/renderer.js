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
        frameCount = 0,
        livesDisplay,
        hitPointsDisplay,
        kills,
        statusWindowBorder,
        gameStatusPaper,
        misslesCount,
        pauseLayer = new Kinetic.Layer(),
        respawnLayer,
        pauseText,
        pauseContinueText;

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
            ctx.drawImage(bullet.model.model, 0, 0, 10, 30, bullet.x, bullet.y, bullet.model.width, bullet.model.height);
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

    function pauseDraw() {
                pauseText = new Kinetic.Text({
                        x: 30,
                        y: 100,
                        text: "Game Paused",
                        fontSize: 160,
                        fontWeight: "bold",
                        fontFamily: "IrisUPC,Arial",
                        fill: "green",
                        stroke: "white",
                        strokeWidth: 2
                    });
                pauseContinueText = new Kinetic.Text({
                        x: 100,
                        y: 250,
                        text: "Press ESC key to continue",
                        fontSize: 70,
                        fontWeight: "bold",
                        fontFamily: "IrisUPC,Arial",
                        fill: "green",
                        stroke: "white",
                        strokeWidth: 1
                    });

        pauseLayer.add(pauseText);
        pauseLayer.add(pauseContinueText);
        stage.add(pauseLayer);
    }

    function gameUnpause(){
        pauseLayer.remove(pauseText);
        pauseLayer.remove(pauseContinueText);
        stage.remove(pauseLayer);

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
                fill: "green",
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
                fill: "green",
                stroke: "white",
                strokeWidth: 1
            });

        respawnLayer.add(text);
        respawnLayer.add(startNew);
        stage.add(respawnLayer);

        window.addEventListener("click", onKeyPressed);
        window.addEventListener("keydown", onKeyPressed);

        function onKeyPressed() {
            respawnLayer.remove(text);
            respawnLayer.remove(startNew);
            stage.remove(respawnLayer);
            gameStatusPaper.clear();
            window.removeEventListener("click", onKeyPressed);
            window.removeEventListener("keydown", onKeyPressed);
            callback();
        }
    }

    function drawStatusWindow() {
        var statusScreenContainer = document.getElementById("status-window");
        if (!gameStatusPaper) {
            gameStatusPaper = new Raphael(statusScreenContainer, canvas.width, canvas.height + 70);
        }

        player = GameEngine.getPlayer();
        statusWindowBorder = gameStatusPaper.rect(5, canvas.height + 5, canvas.width - 10, 50)
            .attr("fill", "#007DD1")
            .attr("stroke", "#005AA1")
            .attr("stroke-width", 10);

        gameStatusPaper.text(50, canvas.height + 30, "Lives")
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        gameStatusPaper.text(200, canvas.height + 30, "Hit Points")
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        gameStatusPaper.text(400, canvas.height + 30, "Missles")
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        gameStatusPaper.text(600, canvas.height + 30, "Kills")
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        livesDisplay = gameStatusPaper.text(100, canvas.height + 30, player.lives)
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        hitPointsDisplay = gameStatusPaper.text(290, canvas.height + 30, player.plane.currentHitPoints)
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        misslesCount = gameStatusPaper.text(470, canvas.height + 30, player.plane.missiles)
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);

        kills = gameStatusPaper.text(650, canvas.height + 30, player.kills)
            .attr("fill", "#EFFEFF")
            .attr("font-size", 30);




    }

    function updateStatusWindow() {
        player = GameEngine.getPlayer();

        if (livesDisplay.attr("text") != player.lives) {
            if(player.lives<=1){
                livesDisplay.attr("fill","red");
            } else {
                livesDisplay.attr("fill","EFFEFF");
            }

            livesDisplay.attr("text", player.lives);
        }

        if (hitPointsDisplay.attr("text") != player.plane.currentHitPoints) {
            if(player.plane.currentHitPoints<=(player.plane.model.hitPoints*0.3)){
                hitPointsDisplay.attr("fill","red");
            } else {
                hitPointsDisplay.attr("fill","EFFEFF");
            }
            hitPointsDisplay.attr("text", player.plane.currentHitPoints > 0 ? player.plane.currentHitPoints : 0);
        }

        if (misslesCount.attr("text") != player.plane.missiles) {
            if(player.plane.missiles<=2){
                misslesCount.attr("fill","red");
            } else {
                misslesCount.attr("fill","EFFEFF");
            }
            misslesCount.attr("text", player.plane.missiles > 0 ? player.plane.missiles : 0);
        }

        if (kills.attr("text") != player.kills) {
            kills.attr("text", player.kills);
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
        updateStatusWindow()
    }

    return {
        render: render,
        respawnPlayer: respawnPlayer,
        triggerExplosion: triggerExplosion,
        gameOver: gameOver,
        drawStatusWindow: drawStatusWindow,
        updateStatusWindow: updateStatusWindow,
        pauseDraw : pauseDraw,
        gameUnpause: gameUnpause
    };
}());