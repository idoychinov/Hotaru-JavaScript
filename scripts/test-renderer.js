var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	ctxWidth = canvas.width,
	ctxHeight = canvas.height,
	playerAircraft = //to add;

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