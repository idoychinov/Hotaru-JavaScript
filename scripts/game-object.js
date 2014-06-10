/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */
var GameObject = (function () {
    'use strict';
    var planeWidth = 20,
    // when moving, the direction will change 1 pixel at the time
        DIRECTION_DELTA = 15,
        testPlaneImg = new Image(),
    // Enumeration with the different bulletTypes
        bulletTypes = {
            classic: {model: 'classic.png', speed: 10, damage: 15},
            advanced: {model: 'classic.png', speed: 10, damage: 15}
        },
        planeTypes = {
            T50: {model: testPlaneImg, speed: 5, bulletType: 'classic'},
            F16: {model: 'F16.png', speed: 5, bulletType: 'classic'}

        };
        testPlaneImg.src = "scripts/sukhoi-top.png";

    function GameObject(x, y, model) {
        // X and Y -> top left pixel for the image
        this.x = x;
        this.y = y;
        this.model = model;
        this.isAlive = true;
    }

    function Bullet(x, y, bulletType, direction) {
        GameObject.call(this, x, y, bulletType.model);
        this.speed = bulletType.speed;
        this.damage = bulletType.damage;
        this.direction = direction;
        this.hasHitAPlane = false;
    }

    function Unit(x, y, model, speed) {
        GameObject.call(this, x, y, model);
        this.speed = speed;
        this.generateBullet = function (bulletType) {
            var currentBullet = bulletTypes.bulletType;
            return new Bullet(this.x + planeWidth / 2, this.y + 10, currentBullet); //TODO DELTA Y FOR THE BULLET
        };
        this.move = function (moveDirection) {
            if (moveDirection === 'left') {
                this.x -= DIRECTION_DELTA;
            } else if (moveDirection === 'right') {
                this.x += DIRECTION_DELTA;
            } else if (moveDirection === 'up') {
                this.y -= DIRECTION_DELTA;
            } else {
                this.y += DIRECTION_DELTA;
            }
        };
    }

    function Plane(x, y, planeModel) {
        Unit.call(this, x, y, planeModel.model, planeModel.speed);
        this.bulletType = planeModel.bulletType;
    }

    Object.prototype.getName = function () {
        var funcNameRegex = /function (.{1,})\(/,
            results = (funcNameRegex).exec(this.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };

    return {
        planesEnum: planeTypes,
        Plane: Plane
    };
}());