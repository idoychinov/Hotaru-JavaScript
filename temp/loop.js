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


/* class Loop { */

function Loop(pattern, transition, transitionCondition) {
    this.patternSource = pattern;
    this.transitionSource = transition;
    this.transitionCondition = transitionCondition;
}

/* } */


/* class LoopManager { */

function LoopManager(loops, stage) {
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
    
    // Initializing the field
    this.initializeFields();
    this.drawStage(stage);
}

LoopManager.prototype.initializeFields = function() {
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

LoopManager.prototype.drawStage = function(stage) {
    stage.add(this.layer);
};

LoopManager.prototype.generatePatternContainer = function(image, startPos) {    
    return new Kinetic.Rect({
        x: 0,
        y: startPos,
        width: FIELD_WIDTH,
        height: FIELD_HEIGHT,
        fillPatternImage: image,
        fillPatternOffset: {x: 0, y: FIELD_HEIGHT}
    });
};

LoopManager.prototype.executeLooping = function() {
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

LoopManager.prototype.executeTransition = function() {
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

LoopManager.prototype.startMovement = function() {    
    if (!this.isInTransition) {
        this.executeLooping();
    }
    else {
        var isLast = this.executeTransition();
        
        if (isLast) return;
    }
    
    this.layer.batchDraw();
    
    var self = this;
    setTimeout(function() { self.startMovement(); }, this.LOOP_SPEED);
};

/* } */

// PREVIEW

var loops = [
    new Loop("pattern.png", "transition.png",
        function(loops) {
            if (loops == 2) return true; else return false;
        }
    ),

    new Loop("pattern2.png", "transition2.png",
        function(loops) {
            if (loops == 6) return true; else return false;
        }
    )
];

try {
    var playingField = new LoopManager(loops, stage);
    playingField.startMovement();
}
catch(error) {
    console.log(error);
    console.trace();
}