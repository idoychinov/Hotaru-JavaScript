/*global Kinetic, GameObject, GameEngine */
/*jslint plusplus: true */
/*jslint browser:true */
var playerModule = (function () {
    'use strict';
    function Player(name, plane) {
        this.name = name;
        this.plane = plane;
        this.lives = 3;
        this.kills = 0;
    }

    return {
        Player: Player
    };
}());