/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */
var GameObject = (function () {
    'use strict';
    var sukhoi = new Image(), //142  / 98  / 98 /210
        f16 = new Image(),
    // Enumeration with the different bulletTypes. Fire riate lower == faster (less ticks needed to go out of cooldown)
        bulletTypes = {
            classic: { model: 'classic.png', speed: 10, damage: 15, width: 6,height: 12, rateOfFire:20 },
            advanced: { model: 'classic.png', speed: 10, damage: 15, width: 10, height: 20, rateOfFire: 30 },
            enemyBullet: { model: 'classic.png', speed: 5, damage: 15, width: 6, height: 12, rateOfFire:30 }
        },
        planeTypes = {
            T50: { model: sukhoi, speed: 1, bulletType: bulletTypes.classic, width: 50, height: 74},
            F16: { model: f16, speed: 1, bulletType: bulletTypes.classic, width: 67, height: 105 }

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
        GameObject.call(this, x, y, bulletType);
        this.direction = direction;
        this.hasHitAPlane = false;
    }

    function Unit(x, y, model) {
        GameObject.call(this, x, y, model);

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
        Unit.call(this, x, y, planeModel);
        this.shotCooldown = 0;
        this.currentBulletType = planeModel.bulletType;
        this.fireBullet = function (direction) {
            var offsetY = 1;
            if (direction === bulletDirections.down) {
                offsetY = this.model.height+1;
            }
            var currentBullet = new Bullet(this.x + (this.model.width / 2) - (this.currentBulletType.width / 2), this.y + offsetY, this.currentBulletType, direction); //TODO DELTA Y FOR THE BULLET
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
        bulletsEnum : bulletTypes,
        bulletDirectionsEnum: bulletDirections,
        Plane: Plane
    };
}());