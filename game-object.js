var GameObject = (function () {
    'use strict';
    var planeWidth = 20,
    // when moving, the direction will change 1 pixel at the time
    //GIT SETTINGS TEST
        PLAYER_DIRECTION_DELTA = 1,
    // Enumeration with the different bulletTypes
        BulletTypes = {
            classic: {model: 'classic.png', speed: 10, damage: 15},
            advanced: {model: 'classic.png', speed: 10, damage: 15}
        };

    function GameObject(x, y, model) {
        // X and Y -> top left pixel for the image
        this.x = x;
        this.y = y;
        this.model = model;
    }

    //TODO MovingObject is using Bullet and vice versa

    function MovingObject(x, y, model, speed) {
        GameObject.call(this, x, y, model);
        this.speed = speed;

        this.generateBullet = function (bulletType) {
            var currentBullet = BulletTypes.bulletType;
            return new Bullet(this.x + planeWidth / 2, this.y + 10, currentBullet); //TODO DELTA Y FOR THE BULLET
        };

        this.move = function (moveDirection) {
            if (moveDirection === 'left') {
                this.x -= PLAYER_DIRECTION_DELTA;
            } else if (moveDirection === 'right') {
                this.x += PLAYER_DIRECTION_DELTA;
            } else if (moveDirection === 'up') {
                this.y -= PLAYER_DIRECTION_DELTA;
            } else {
                this.y += PLAYER_DIRECTION_DELTA;
            }
        };
    }

    function Bullet(x, y, bulletType, direction) {
        MovingObject.call(this, x, y, bulletType.model, bulletType.speed);
        this.damage = bulletType.damage;
        this.direction = direction;
        this.hasHitAPlane = false;
    }

    function test() {
        var obj = new MovingObject(1, 1, "&");
        console.log(obj.x + ' ' + obj.y);
        console.log(obj.getName());
    }


    Object.prototype.getName = function () {
        var funcNameRegex = /function (.{1,})\(/,
            results = (funcNameRegex).exec(this.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };


    return {
        test: test
    };
}());