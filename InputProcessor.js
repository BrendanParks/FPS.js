//Input processor
//TODO: Could probably create a general case of this class for use in a framework

var InputProcessor = function (domElement, cameraController) {
    this.inputBtns = {     moveForward: 87,    //W
                        moveBackward: 83,   //S
                        moveLeft: 65,       //A
                        moveRight: 68       //D
                        };
    
    this.camController = cameraController;
    
    this.inputs = [];
    
    //TODO: Maybe define an inputButton class, but that might be overkill for this
    this.inputs.push( {     keyName:'moveForward',
                            keyCode: 87, //W
                            onPress: this.camController.onForwardPressed, 
                            onRelease: this.camController.onForwardReleased } );
    
    this.inputs.push( {     keyName:'moveBackward',
                            keyCode: 83, //S
                            onPress: this.camController.onBackwardPressed, 
                            onRelease: this.camController.onBackwardReleased } );
    
    this.inputs.push( {     keyName:'moveLeft',
                            keyCode: 65, //A
                            onPress: this.camController.onLeftPressed, 
                            onRelease: this.camController.onLeftReleased } );
    
    this.inputs.push( {     keyName:'moveRight',
                            keyCode: 68, //D
                            onPress: this.camController.onRightPressed, 
                            onRelease: this.camController.onRightReleased } );
    this.inputsPressed = [];
    
    

    
    
    //Bind events to domElement (should probably be window for fullscreen stuff)
    domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
    domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

};

//Process input based on currently pressed keys
InputProcessor.prototype.update = function() {
    
        var arrLen = this.inputs.length;
        for (var i = 0; i < arrLen; i++) {
            if (this.inputsPressed[i]) {
                this.inputs[i].onPress();
            } else {
                this.inputs[i].onRelease();
            }
        }      
};

InputProcessor.prototype.onKeyDown = function (event) {
    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (event.keyCode === this.inputs[i].keyCode) {
            this.inputsPressed[i] = true;
        
        }
    }
};

InputProcessor.prototype.onKeyUp = function(event) {
    var arrLen = this.inputs.length;
    for (var i = 0; i < arrLen; i++) {
        if (event.keyCode === this.inputs[i].keyCode) {
            this.inputsPressed[i] = false;
        }
    }    
};

//InputProcessor.prototype.rebindKey