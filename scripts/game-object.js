/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */
var GameObject = (function () {
    'use strict';
    var planeWidth = 20,
    // when moving, the direction will change 1 pixel at the time
        sukhoi = new Image(), //142  / 98  / 98 /210
        f16 = new Image(),
    // Enumeration with the different bulletTypes
        bulletTypes = {
            classic: { model: 'classic.png', speed: 10, damage: 15 },
            advanced: { model: 'classic.png', speed: 10, damage: 15 }
        },
        planeTypes = {
            T50: { model: sukhoi, speed: 5, bulletType: bulletTypes.classic },
            F16: { model: f16, speed: 5, bulletType: bulletTypes.classic }

        },
        bulletDirections = { up: 'up', down: 'down' };
    sukhoi.src = "textures/sukhoi_sprite.png";
    f16.src = "textures/f16.png";

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

        // 3 steering directions - neutral, left, right
        this.steeringDirection = 'neutral';
        this.move = function (moveDirection, directionDelta) {
            if (moveDirection === 'left') {
                this.x -= directionDelta;
            } else if (moveDirection === 'right') {
                this.x += directionDelta;
            } else if (moveDirection === 'up') {
                this.y -= directionDelta;
            } else if (moveDirection === 'down') {
                this.y += directionDelta;
            } else if (moveDirection === "upleft") {
                this.x -= directionDelta;
                this.y -= directionDelta;
            } else if (moveDirection === "upright") {
                this.x += directionDelta;
                this.y -= directionDelta;
            } else if (moveDirection === "downleft") {
                this.x -= directionDelta;
                this.y += directionDelta;
            } else if (moveDirection === "downright") {
                this.x += directionDelta;
                this.y += directionDelta;
            }
        };
    }

    function Plane(x, y, planeModel) {
        Unit.call(this, x, y, planeModel.model, planeModel.speed);
        this.bulletType = planeModel.bulletType;
        this.fireBullet = function (direction) {
            var offsetY = 1;
            if (direction === bulletDirections.up) {
                offsetY = -offsetY;
            }
            var currentBullet = new Bullet(this.x + planeWidth / 2, this.y + offsetY, this.bulletType, direction); //TODO DELTA Y FOR THE BULLET
            return currentBullet;
        };
    }

    /*
     * @IMPORTANT: Causes conflicts with KineticJS - temporary disabled
     */

    //    Object.prototype.getName = function () {
    //        var funcNameRegex = /function (.{1,})\(/,
    //            results = (funcNameRegex).exec(this.constructor.toString());
    //        return (results && results.length > 1) ? results[1] : "";
    //    };

    return {
        planesEnum: planeTypes,
        bulletDirectionsEnum: bulletDirections,
        Plane: Plane
    };
}());