var BackgroundLooper = (function () {
    "use strict";

    /* CONSTANTS */
    var FIELD_WIDTH = 700;
    var FIELD_HEIGHT = 500;
    var isPaused = false;
    var playingField;

    // Background stage
    var stage = new Kinetic.Stage({
        container: "background",
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT
    });

    /* enum */ var LoopPattern = {
        water: {
            pattern: "water.png",
            transitionClouds: "water-clouds.png"
        },

        clouds: {
            pattern: "clouds.png",
            transitionWater: "clouds-water.png"
        }
    };

    // Predefined loops
    // TODO: Implement scoring
    var loops = [
        new BackgroundLoop(LoopPattern.water.pattern, LoopPattern.water.transitionClouds,
            function (loops) { if (loops == 4) return true; else return false; }
        ),

        new BackgroundLoop(LoopPattern.clouds.pattern, LoopPattern.clouds.transitionWater,
            function (loops) { if (loops == 10) return true; else return false; }
        ),

        new BackgroundLoop(LoopPattern.water.pattern, LoopPattern.water.transitionClouds,
            function (loops) { if (loops == 15) return true; else return false; }
        ),

        new BackgroundLoop(LoopPattern.clouds.pattern, LoopPattern.clouds.transitionWater, function () { return false;})
    ];


    /* static class KineticUtility */
    function KineticUtility() {}

    /*
     * @returns: Image ready to be attached to layer
     */
    KineticUtility.createImage = function (source, imageOptions) {
        var imageObject = new Image();

        imageObject.onload = function () {
            var image = new Kinetic.Image(imageOptions);

            image.image = imageObject;
        };

        imageObject.src = source;

        return imageObject;
    };

    /* } */


    /* class BackgroundLoop { */

    function BackgroundLoop(pattern, transition, transitionCondition) {
        this.patternSource = pattern;
        this.transitionSource = transition;
        this.transitionCondition = transitionCondition;
    }

    /* } */


    /* class LoopManager { */

    function LoopManager(loops, stage) {
        this.LOOP_SPEED = 10;
        this.PATTERN_HEIGHT = 784;
        this.IMG_SRC_PREFIX = "textures/background/";

        this.isInTransition = false;
        this.loopCount = 0;
        this.index = 0;
        this.followingIndex = 0;
        this.loops = loops;

        this.pattern;
        this.transition;
        this.patternImg;
        this.transitionImg;

        this.stage = stage;
        this.layer = new Kinetic.Layer();

        // Initializing the field
        this.initializeFields();
        this.drawStage();
    }

    LoopManager.prototype.initializeFields = function () {
        var initial = this.loops[0];
        var imageOptions = {
            x: 0,
            y: 0,
            width: FIELD_WIDTH,
            height: this.PATTERN_HEIGHT
        };

        this.patternImg = KineticUtility.createImage(this.IMG_SRC_PREFIX + initial.patternSource, imageOptions);
        this.transitionImg = KineticUtility.createImage(this.IMG_SRC_PREFIX + initial.transitionSource, imageOptions);

        this.pattern = this.generatePatternContainer(this.patternImg, 0, this.PATTERN_HEIGHT - FIELD_HEIGHT);
        this.transition = this.generatePatternContainer(this.transitionImg, -FIELD_HEIGHT, 0);

        // Adding fields to the main layer
        this.layer.add(this.pattern);
        this.layer.add(this.transition);
    };

    LoopManager.prototype.drawStage = function () {
        this.stage.add(this.layer);
    };

    LoopManager.prototype.generatePatternContainer = function (image, startPos, yOffset) {
        return new Kinetic.Rect({
            x: 0,
            y: startPos,
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            fillPatternImage: image,
            fillPatternOffset: {x: 0, y: yOffset}
        });
    };

    LoopManager.prototype.executeLooping = function () {
        var yOffset = this.pattern.attrs.fillPatternOffsetY - 1;

        // Resets the offset on loop
        if (yOffset == -1) {
            yOffset = this.PATTERN_HEIGHT;
            this.loopCount++;
            console.log(this.loopCount);
        }

        // Triggers a transition
        if (this.loops[this.index].transitionCondition(this.loopCount)) {
            this.isInTransition = true;
        }

        this.pattern.fillPatternOffset({y: yOffset});
    };

    LoopManager.prototype.executeTransition = function () {
        var patternY = this.pattern.attrs.y + 1,
            transitionY = this.transition.attrs.y + 1;

        this.pattern.setY(patternY);
        this.transition.setY(transitionY);

        if (patternY == FIELD_HEIGHT) {
            this.index++;

            // In case all loops were executed - stop the movement.
            if (this.index > this.loops.length - 1) {
                return true;
            }

            this.patternImg.src = this.IMG_SRC_PREFIX + this.loops[this.index].patternSource;
            this.pattern.setY(-FIELD_HEIGHT);
            this.pattern.fillPatternOffset({y: this.PATTERN_HEIGHT - FIELD_HEIGHT});

            this.loopCount++;
            console.log(this.loopCount);
        }
        else if (transitionY == FIELD_HEIGHT) {
            this.isInTransition = false;
            this.followingIndex++;

            this.transitionImg.src = this.IMG_SRC_PREFIX + this.loops[this.followingIndex].transitionSource;
            this.transition.setY(-FIELD_HEIGHT);

            this.loopCount++;
            console.log(this.loopCount);
        }
    };

    LoopManager.prototype.startMovement = function () {
        // Background looper
        if (!isPaused) {
            if (!this.isInTransition) {
                this.executeLooping();
            }
            else {
                var isLast = this.executeTransition();

                if (isLast) return;
            }

            this.layer.batchDraw();

            var self = this;
            setTimeout(function () {
                self.startMovement();
            }, this.LOOP_SPEED);
        }
    };

    /* } */

    function run() {
        try {
            playingField = new LoopManager(loops, stage);
            playingField.startMovement();
        }
        catch (error) {
            console.log(error);
            console.trace();
        }
    }

    function pause() {
        isPaused = !isPaused;
        if (!isPaused) {
            playingField.startMovement();
        }
    }

    return {
        run: run,
        pause: pause
    };
})();