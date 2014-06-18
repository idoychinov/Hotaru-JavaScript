/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */
var GameObject = (function () {
    'use strict';
    var IMG_DIR_PREFIX = "textures/",
        sukhoi = new Image(), //142  / 98  / 98 /210
        f16 = new Image(),
        mgProjectile = new Image(),
        enemyProjectile = new Image(),
        missile = new Image(),

    // Enumeration with the different bulletTypes. Fire riate lower == faster (less ticks needed to go out of cooldown)
        bulletTypes = {
            classic: { model: mgProjectile, speed: 8, damage: 15, width: 10, height: 16, rateOfFire: 20 },
            advanced: { model: missile, speed: 12, damage: 50, width: 14, height: 40, rateOfFire: 100 },
            enemyBullet: { model: enemyProjectile, speed: 5, damage: 15, width: 10, height: 16, rateOfFire: 30 }
        },
        planeTypes = {
            T50: { model: sukhoi, speed: 1, bulletType: bulletTypes.classic, width: 65, height: 96, hitPoints: 70 },
            F16: { model: f16, speed: 1, bulletType: bulletTypes.classic, width: 64, height: 96, hitPoints: 40 }
        },
    bulletDirections = { up: 'up', down: 'down' };


    mgProjectile.src = IMG_DIR_PREFIX + "mg_projectile.png";
    enemyProjectile.src = IMG_DIR_PREFIX + "enemy_projectile.png";
    missile.src = IMG_DIR_PREFIX + "missile.png";
    sukhoi.src = IMG_DIR_PREFIX + "sukhoi_sprite.png";
    f16.src = IMG_DIR_PREFIX + "f16.png";

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
        this.currentHitPoints = model.hitPoints;
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
        this.missleCooldown = 0;
        this.missiles = 5;
        this.currentBulletType = planeModel.bulletType;
        this.fireBullet = function (direction, isMissle) {
            var offsetY = 1,
                type = isMissle ? bulletTypes.advanced : this.currentBulletType;
            if (direction === bulletDirections.down) {
                offsetY = this.model.height + 1;
            }
            var currentBullet = new Bullet(this.x + (this.model.width / 2) - (type.width / 2), this.y + offsetY, type, direction); //TODO DELTA Y FOR THE BULLET
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
        bulletsEnum: bulletTypes,
        bulletDirectionsEnum: bulletDirections,
        Plane: Plane
    };
}());