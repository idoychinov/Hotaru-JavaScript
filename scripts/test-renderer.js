/*global Kinetic, GameObject, playerModule */
/*jslint plusplus: true */
/*jslint browser:true */
var stage = new Kinetic.Stage({
    container: "field",
    width: 480,
    height: 640
});

var layer = new Kinetic.Layer();

var rect = new Kinetic.Rect({
    x: 239,
    y: 75,
    width: 100,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4
});

layer.add(rect);
stage.add(layer);




/*
function draw(gameObject) {
    img = new Image();
    img.src = gameObject.module;
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    ctx.drawImage(img, 0, 0);
}

function drawFrame() {
    draw(playerAircraft);
    window.requestAnimationFrame(drawFrame);
}

drawFrame();
*/