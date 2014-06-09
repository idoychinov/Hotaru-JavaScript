var GameObject = (function () {
    'use strict';
    var planeWidth = 20,
        BulletTypes = {
            bulletType1: {model: 'model1.png', speed: 10, damage: 15}
        };

    function GameObject(x, y, model) {
        // X and Y -> top left pixel for the image
        this.x = x;
        this.y = y;
        this.model = model;
    }

    // TODO DA PITAM DONCHO ZA KAZUSA

    function MovingObject(x, y, model, speed) {
        GameObject.call(this, x, y, model);
        this.speed = speed;

        this.generateBullet = function (bulletType) {
            var currentBullet = BulletTypes.bulletType;
            return new Bullet(this.x + planeWidth / 2, this.y + 10, currentBullet); //TODO DELTA Y FOR THE BULLET
        };
    }

    function Bullet(x, y, bulletType) {
        MovingObject.call(this, x, y, bulletType.model, bulletType.speed);
        this.damage = bulletType.damage;
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