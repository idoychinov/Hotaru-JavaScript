document.body.addEventListener("keydown", function (e) {
    if (!e) {
        e = window.event;
    }
    switch (e.keyCode) {
        //Space -> pausing the game
        case 32:
            isPaused = !isPaused;
            break;
        // left
        case 37:
            if (directionX === 0) {
                directionY = 0;
                directionX = -10;
            }
            break;
        // up
        case 38:
            if (directionY === 0) {
                directionY -= 10;
                directionX = 0;
            }
            break;
        // right
        case 39:
            if (directionX === 0) {
                directionY = 0;
                directionX = 10;
            }
            break;
        // down
        case 40:
            if (directionY === 0) {
                directionY += 10;
                directionX = 0;
            }
            break;
    }
});