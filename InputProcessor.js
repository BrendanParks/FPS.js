//Input processor
//TODO: Could probably create a general case of this class for use in a framework
//TODO: Possibly require second parameter to implement an interface, like "Inputtable" or something
//TODO: Generalize from just controlling a camera

var InputProcessor = function (domElement, cameraController) {
    this.inputBtns = {     moveForward: 87, //W
                        moveBackward: 83,   //S
                        moveLeft: 65,       //A
                        moveRight: 68       //D
                        };
    
    this.camController = cameraController;
    
    this.inputs = [];
    
    
    this.inputIndex = {     moveForward: 0, //W
                    moveBackward: 1,   //S
                    moveLeft: 2,       //A
                    moveRight: 3,       //D
                    turnLeft: 4,
                    turnRight: 5,
                    lookUp: 6,
                    lookDown: 7
                    };
    
    //TODO: Maybe define an inputButton class, but that might be overkill for this.
    //TODO: Possibly separate the binding into a for loop after pushing.
    //TODO: Is it more effecient to do the binding here once or bind every frame update?
    //TODO: The current solution for checking if two buttons are pressed is kind-of weak and
    //      is possibly introducing unnecessary overhead. Set to -1 if none.
    //      The overhead is possibly negligible so maybe don't worry about it
    //TODO: Check for keycode conflicts?
    this.inputs.push( {     keyName:'moveForward',
                            keyCode: 87, //W
                            onPress: this.camController.onForwardPressed.bind(this.camController), 
                            onRelease: this.camController.onForwardReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.moveBackward } );
    
    this.inputs.push( {     keyName:'moveBackward',
                            keyCode: 83, //S
                            onPress: this.camController.onBackwardPressed.bind(this.camController), 
                            onRelease: this.camController.onBackwardReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.moveForward  } );
    
    this.inputs.push( {     keyName:'moveLeft',
                            keyCode: 65, //A
                            onPress: this.camController.onLeftPressed.bind(this.camController), 
                            onRelease: this.camController.onLeftReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.moveRight } );
    
    this.inputs.push( {     keyName:'moveRight',
                            keyCode: 68, //D
                            onPress: this.camController.onRightPressed.bind(this.camController), 
                            onRelease: this.camController.onRightReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.moveLeft } );
    this.inputs.push( {     keyName:'turnLeft',
                            keyCode: 37, //Left arrow
                            onPress: this.camController.onTurnLeftPressed.bind(this.camController), 
                            onRelease: this.camController.onTurnLeftReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.turnRight } );
    this.inputs.push( {     keyName:'turnRight',
                            keyCode: 39, //Right arrow
                            onPress: this.camController.onTurnRightPressed.bind(this.camController), 
                            onRelease: this.camController.onTurnRightReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.turnLeft } );    
    this.inputs.push( {     keyName:'lookUp',
                            keyCode: 38, //Up arrow
                            onPress: this.camController.onLookUpPressed.bind(this.camController), 
                            onRelease: this.camController.onLookUpReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.lookDown } ); 
    this.inputs.push( {     keyName:'lookDown',
                            keyCode: 40, //Down arrow
                            onPress: this.camController.onLookDownPressed.bind(this.camController), 
                            onRelease: this.camController.onLookDownReleased.bind(this.camController),
                            cancelIfPressed: this.inputIndex.lookUp } );   
    
    //TODO: Inputs by default are "undefined" according to the code, which
    //      only technically works because "undefined" doesn't equal "true"
    //      in the conditional statements. Set to false initially.
    this.inputsPressed = [];
    
    var inputsLen = Object.keys(this.inputs).length;
    
    for (var i = 0; i < inputsLen; i++) {
        this.inputsPressed[i] = false;
    }
    this.inputsPressedPrev = this.inputsPressed.slice();
    
    //Bind events to domElement (should probably be window for fullscreen stuff)
    domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
    domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

};

//Process input based on currently pressed keys.
//Don't forget to call this update before the one in EditorCamera!
var counter = 0;
var debugCounter = 0;
var debugPoll = function () {
    if (counter % 240 === 0) {
        debugCounter++;
        return true;
    }
    return false;

}

InputProcessor.prototype.update = function() {
        
    counter++;

    if (debugPoll()) {
        console.log("//// BEGINNING INPUT LOG " + debugCounter + " ////");
        console.log("/////////////////////////////");
    }        

    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (this.inputsPressed[i]) {
            if (debugPoll()) console.log(Object.keys(this.inputIndex)[i] + " Pressed!");
            


            //Simulate release if both buttons are pressed
            if (this.inputs[i].cancelIfPressed >= 0 &&
                !this.inputsPressed[this.inputs[i].cancelIfPressed]) {
                this.inputs[i].onPress();
            } else {
                if (debugPoll()) console.log(Object.keys(this.inputIndex)[i] + " cancelled!");
                

                if (this.inputsPressedPrev[i] === true) {
                    this.inputs[i].onRelease();
                }
            }
        } else {
            if (debugPoll()) console.log(Object.keys(this.inputIndex)[i] + " released!");

            //console.log("ON RELEASED BEING CALLED");
            if (this.inputsPressedPrev[i] === true) {
                this.inputs[i].onRelease();
            }
            
            
        }
    }      
    
    //Store previous inputs pressed to check for button release
    this.inputsPressedPrev = this.inputsPressed.slice();
};

InputProcessor.prototype.onKeyDown = function (event) {
    event.preventDefault();
    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (event.keyCode === this.inputs[i].keyCode) {
            this.inputsPressed[i] = true;
        
        }
    }
};

InputProcessor.prototype.onKeyUp = function(event) {
    event.preventDefault();
    console.log("some key got released");
    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (event.keyCode === this.inputs[i].keyCode) {
            this.inputsPressed[i] = false;
        }
    }    
};

//InputProcessor.prototype.rebindKey