//Input processor
//TODO: Could probably create a general case of this class for use in a framework

var InputProcessor = function (domElement, cameraController) {
    this.inputs = {     moveForward: 87,    //W
                        moveBackward: 83,   //S
                        moveLeft: 65,       //A
                        moveRight: 68       //D
                        };
    this.inputsPressed = [];
    

    this.camController = cameraController;
    
    //Bind events to domElement (should probably be window for fullscreen stuff)
    domElement.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
    domElement.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

};


//Process input based on currently pressed keys
InputProcessor.prototype.update = function() {
    
        //TODO: you could pair up the functions to call into
        //this.inputs and then iterate through instead of doing
        //all these if statements. Could be cleaner.
    
        if (this.inputsPressed[this.inputs.moveForward]){
            this.camController.onForwardPressed();
        } else {
            this.camController.onForwardReleased();
        }
        if (this.inputsPressed[this.inputs.moveBackward]) {
            this.camController.onBackwardPressed();
        } else {
            this.camController.onBackwardReleased();
        }
        if (this.inputsPressed[this.inputs.moveLeft]) {
            this.camController.onLeftPressed();
        } else {
            this.camController.onLeftReleased();
        }
        if (this.inputsPressed[this.inputs.moveRight]) { 
            this.camController.onRightPressed();
        } else {
            this.camController.onRightReleased();
        }
    
};

InputProcessor.prototype.onKeyDown = function (event) {
    switch (event.keyCode) {
        case this.inputs.moveForward:
            this.inputsPressed[this.inputs.moveForward] = true;
            break;
        case this.inputs.moveBackward:
            this.inputsPressed[this.inputs.moveBackward] = true;
            break;
        case this.inputs.moveLeft:
            this.inputsPressed[this.inputs.moveLeft] = true;
            break;            
        case this.inputs.moveRight:
            this.inputsPressed[this.inputs.moveRight] = true;
            break;          
    }    
    

};

InputProcessor.prototype.onKeyUp = function(event) {
    switch (event.keyCode) {
        case this.inputs.moveForward:
            this.inputsPressed[this.inputs.moveForward] = false;
            break;
        case this.inputs.moveBackward:
            this.inputsPressed[this.inputs.moveBackward] = false;
            break;
        case this.inputs.moveLeft:
            this.inputsPressed[this.inputs.moveLeft] = false;
            break;            
        case this.inputs.moveRight:
            this.inputsPressed[this.inputs.moveRight] = false;
            break;   
    }     

    for (keycode in this.inputs) {
        if (!this.inputs.hasOwnProperty(keycode)) {
            continue;
        }
    }
};

//InputProcessor.prototype.rebindKey