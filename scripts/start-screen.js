/// <reference path="raphael.js" />
/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */

var StartScreen = (function () {

    function init(x,y,width,height) {
        var paper = Raphael(x, y, width, height),
            gameNameShadow,
            gameName,
            startText,
            startButton,
            fontFamily = "IrisUPC,Arial";

        paper.canvas.style.backgroundColor = "black";

        gameNameShadow = paper.text(340, -100, "2015");
        gameNameShadow.attr({
            "font-size": "200px",
            "font-weight": "bold",
            "font-family": fontFamily,
            "text-anchor": "middle",
            "fill": "green",
            "stroke-width": "4"
        });

        gameName = paper.text(350, 700, "2015");
        gameName.attr({
            "font-size": "200px",
            "font-weight": "bold",
            "font-family": fontFamily,
            "text-anchor": "middle",
            "fill-opacity": 0,
            "stroke": "white",
            "stroke-width": "4"
        });
        animateGameName();

        function animateGameName() {
            var animationDuration = 1000,
                animationEffect = "back-out";
            gameNameShadow.animate({ y: 210 }, animationDuration, animationEffect);
            gameName.animate({ y: 200 }, animationDuration, animationEffect, readyForClick);
        }
        
        function readyForClick() {
            window.addEventListener("keydown", startGame);
            window.addEventListener("click", startGame);
            var startBlinkSpeed = 350;

            startText = paper.text(350, 350, "press any key ");
            startText.attr({
                "font-size": "40px",
                "font-weight": "bold",
                "font-family": fontFamily,
                "text-anchor": "middle",
                "fill":"white"
            });

            startButton = paper.text(350, 310, "START ");
            startButton.attr({
                "font-size": "48px",
                "font-weight": "bold",
                "font-family": fontFamily,
                "text-anchor": "middle",
                "fill": "white",
                "fill-opacity": 1
            });
            fadeOut();
            
            function fadeIn() {
                startButton.animate({ "fill-opacity": 1 }, startBlinkSpeed, fadeOut);
            }

            function fadeOut() {
                startButton.animate({ "fill-opacity": 0 }, startBlinkSpeed, fadeIn);
            }
        }

        function startGame() {
            window.removeEventListener("keydown", startGame);
            window.removeEventListener("click", startGame);
            startButton.stop();
            paper.remove();
            document.getElementById('status-window').focus();
            GameEngine.init();
            BackgroundLooper.run();
        }

    }

    

    return {
        init : init
    }
}());