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
    
    //TODO: Maybe define an inputButton class, but that might be overkill for this.
    //TODO: Possibly separate the binding into a for loop after pushing.
    //TODO: Is it more effecient to do the binding here once or bind every frame update?
    this.inputs.push( {     keyName:'moveForward',
                            keyCode: 87, //W
                            onPress: this.camController.onForwardPressed.bind(this.camController), 
                            onRelease: this.camController.onForwardReleased.bind(this.camController) } );
    
    this.inputs.push( {     keyName:'moveBackward',
                            keyCode: 83, //S
                            onPress: this.camController.onBackwardPressed.bind(this.camController), 
                            onRelease: this.camController.onBackwardReleased.bind(this.camController) } );
    
    this.inputs.push( {     keyName:'moveLeft',
                            keyCode: 65, //A
                            onPress: this.camController.onLeftPressed.bind(this.camController), 
                            onRelease: this.camController.onLeftReleased.bind(this.camController) } );
    
    this.inputs.push( {     keyName:'moveRight',
                            keyCode: 68, //D
                            onPress: this.camController.onRightPressed.bind(this.camController), 
                            onRelease: this.camController.onRightReleased.bind(this.camController) } );
    this.inputsPressed = [];
    
    //Bind events to domElement (should probably be window for fullscreen stuff)
    domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
    domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

};

//Process input based on currently pressed keys.
//Don't forget to call this update before the one in EditorCamera!
InputProcessor.prototype.update = function() {
        var arrLen = this.inputs.length;
        for (var i = 0; i < arrLen; i++) {
            if (this.inputsPressed[i]) {
                //this.inputs[i].onPress().bind(this.camController);
                this.inputs[i].onPress();
            } else {
                //this.inputs[i].onRelease().bind(this.camController);
                this.inputs[i].onRelease();
            }
        }      
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
    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (event.keyCode === this.inputs[i].keyCode) {
            this.inputsPressed[i] = false;
        }
    }    
};

//InputProcessor.prototype.rebindKey