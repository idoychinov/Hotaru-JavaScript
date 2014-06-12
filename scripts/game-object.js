/*global Kinetic, GameObject, playerModule*/
/*jslint plusplus: true */
/*jslint browser:true */
var GameObject = (function () {
    'use strict';
    var planeWidth = 20,
    // when moving, the direction will change 1 pixel at the time
        DIRECTION_DELTA = 1,
        sukhoi = new Image(), //142  / 98  / 98 /210
        f16 = new Image(),
    // Enumeration with the different bulletTypes
        bulletTypes = {
            classic: {model: 'classic.png', speed: 10, damage: 15},
            advanced: {model: 'classic.png', speed: 10, damage: 15}
        },
        planeTypes = {
            T50: {model: sukhoi, speed: 5, bulletType: 'classic'},
            F16: {model: f16, speed: 5, bulletType: 'classic'}

        };
        sukhoi.src = "scripts/sukhoi_sprite.png";
        f16.src = "scripts/f16.png"

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
        this.fireBullet = function (bulletType) {
            var currentBullet = bulletTypes.bulletType;
            return new Bullet(this.x + planeWidth / 2, this.y + 10, currentBullet); //TODO DELTA Y FOR THE BULLET
        };
        // 3 steering directions - neutral, left, right
        this.steeringDirection = 'neutral';
        this.move = function (moveDirection) {
            if (moveDirection === 'left') {
                this.x -= DIRECTION_DELTA;
            } else if (moveDirection === 'right') {
                this.x += DIRECTION_DELTA;
            } else if (moveDirection === 'up') {
                this.y -= DIRECTION_DELTA;
            } else if(moveDirection === 'down'){
                this.y += DIRECTION_DELTA;
            } else if(moveDirection ==="upleft"){
                this.x -= DIRECTION_DELTA;
                this.y -= DIRECTION_DELTA;
            } else if (moveDirection === "upright") {
                this.x += DIRECTION_DELTA;
                this.y -= DIRECTION_DELTA;
            } else if (moveDirection === "downleft") {
                this.x -= DIRECTION_DELTA;
                this.y += DIRECTION_DELTA;
            } else if (moveDirection === "downright") {
                this.x += DIRECTION_DELTA;
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