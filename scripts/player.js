/*global Kinetic, GameObject, GameEngine */
/*jslint plusplus: true */
/*jslint browser:true */
var playerModule = (function () {
    'use strict';
    function Player() {
        this.plane = new GameObject.Plane(1, 1, GameObject.planesEnum.T50);
    }

    return {
        Player: Player
    };
}());