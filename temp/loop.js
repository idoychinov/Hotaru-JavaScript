var stage = new Kinetic.Stage({
    container: "field",
    width: 480,
    height: 640
});

/* GLOBAL CONSTANTS */

var FIELD_WIDTH = 480;
var FIELD_HEIGHT = 640;


/* static class KineticUtility */
function KineticUtility() {};
    
/*
* @returns: Image ready to be attached to layer
*/
KineticUtility.createImage = function(source, imageOptions) {
    var imageObject = new Image();

    imageObject.onload = function() {
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


/* class GameCycleManager { */

function GameCycleManager(loops, stage) {
    this.LOOP_SPEED = 10;
    
    this.isInTransition = false;
    this.loopCount = 1;
    this.index = 0;
    this.followingIndex = 0;
    
    this.loops = loops;
    this.stage = stage;
    
    this.pattern;
    this.transition;
    this.patternImg;
    this.transitionImg;
    this.layer = new Kinetic.Layer();
    
    this.newLayer = new Kinetic.Layer();
    this.elements = [];
    
    
    // Initializing the field
    this.initializeFields();
}

GameCycleManager.prototype.initializeFields = function() {
    var initial = this.loops[0];
    var imageOptions = {
        x: 0,
        y: 0,
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT
    };
    
    this.patternImg = KineticUtility.createImage(initial.patternSource, imageOptions);
    this.transitionImg = KineticUtility.createImage(initial.transitionSource, imageOptions);
    
    this.pattern = this.generatePatternContainer(this.patternImg, 0);
    this.transition = this.generatePatternContainer(this.transitionImg, -FIELD_HEIGHT);
    
    // Adding fields to the main layer
    this.layer.add(this.pattern);
    this.layer.add(this.transition);
};

GameCycleManager.prototype.drawStage = function() {
    this.stage.add(this.layer);
    this.stage.add(this.newLayer);
};

GameCycleManager.prototype.addElement = function(element) {
    this.elements.push(element);
    
    this.newLayer.add(this.elements[this.elements.length - 1]);
};

GameCycleManager.prototype.generatePatternContainer = function(image, startPos) {    
    return new Kinetic.Rect({
        x: 0,
        y: startPos,
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        fillPatternImage: image,
        fillPatternOffset: {x: 0, y: FIELD_HEIGHT}
    });
};

GameCycleManager.prototype.executeLooping = function() {
    var yOffset = this.pattern.attrs.fillPatternOffsetY - 1;
        
    // Resets the offset on loop
    if (yOffset == -1) {
        yOffset = FIELD_HEIGHT;
        this.loopCount++;
    }

    // Triggers a transition
    if (this.loops[this.index].transitionCondition(this.loopCount)) {        
        this.isInTransition = true;
    }

    this.pattern.fillPatternOffset({y: yOffset});
};

GameCycleManager.prototype.executeTransition = function() {
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

        this.patternImg.src = this.loops[this.index].patternSource;
        this.pattern.setY(-FIELD_HEIGHT);

        this.loopCount++;
    }
    else if (transitionY == FIELD_HEIGHT) {
        this.isInTransition = false;
        this.followingIndex++;

        this.transitionImg.src = this.loops[this.followingIndex].transitionSource;
        this.transition.setY(-FIELD_HEIGHT);

        this.loopCount++;
    }
};

GameCycleManager.prototype.startMovement = function() {
    // Background looper
    if (!this.isInTransition) {
        this.executeLooping();
    }
    else {
        var isLast = this.executeTransition();
        
        if (isLast) return;
    }
    
    // External elements
    for (var i = 0; i < this.elements.length; i++) {
            var newPos = this.elements[i].attrs.y + 0.5;
        this.elements[i].setY(newPos);
    }

    
    this.layer.batchDraw();
    this.newLayer.batchDraw();
    
    var self = this;
    setTimeout(function() { self.startMovement(); }, this.LOOP_SPEED);
};

/* } */

// PREVIEW

var loops = [
    new BackgroundLoop("pattern.png", "transition.png",
        function(loops) {
            if (loops == 2) return true; else return false;
        }
    ),

    new BackgroundLoop("pattern2.png", "transition2.png",
        function(loops) {
            if (loops == 6) return true; else return false;
        }
    )
];


    var rect1 = new Kinetic.Rect({
        x: 0,
        y: 10,
        width: 100,
        height: 100,
        fill: "red"
    });
    
        var rect2 = new Kinetic.Rect({
        x: 0,
        y: 200,
        width: 100,
        height: 100,
        fill: "green"
    });
    
        var rect3 = new Kinetic.Rect({
        x: 200,
        y: 16,
        width: 100,
        height: 100,
        fill: "blue"
    });
    
        var rect4 = new Kinetic.Rect({
        x: 100,
        y: 10,
        width: 100,
        height: 100,
        fill: "yellow"
    });

try {
    var playingField = new GameCycleManager(loops, stage);

    
    playingField.addElement(rect1);
    playingField.addElement(rect2);
    playingField.addElement(rect3);
    playingField.addElement(rect4);
    
    playingField.drawStage();
    playingField.startMovement();
}
catch(error) {
    console.log(error);
    console.trace();
}