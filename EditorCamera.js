//Editor Camera
function EditorCamera(viewAngle, aspect, near, far) {
    //Extend normal camera
    THREE.PerspectiveCamera.call(this, viewAngle, aspect, near, far);
    
    
    
    //This should remain mostly static
    
    
}
EditorCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

//Editor camera controller
var EditorCameraController = function (editorCamera) {

    this.editorCamera = editorCamera;

    this.currentState = this.STATE.STILL;
    console.log("YO STATE STILL IS " + this.STATE.STILL);
    
    //XYZ velocity and accel
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0,0,0); //Accel in x,y,z directions

    console.log("MAX SPEED IS sup mello " + this.WALK_MAX_SPEED);


};

EditorCameraController.prototype.WALK_START_SPEED = 40; //Walk 1 unit per second
EditorCameraController.prototype.WALK_MAX_SPEED = 100; //Max speed limit of 2 units per second
EditorCameraController.prototype.WALK_ACCELERATION = 50; //Accelerate 0.5 units per second

EditorCameraController.prototype.STATE = { WALKING: 0,
                                           STILL: 123
                                         };


//Object.freeze(EditorCameraController.prototype.STATE);

EditorCameraController.prototype.update = function (delta) {
    //Get state, update based on state
    
    //Update pos, THEN modify velocity. (as in mult it by acceleration)
    
    var curX = this.editorCamera.position.x;
    var curY = this.editorCamera.position.y;
    var curZ = this.editorCamera.position.z;
    
    
    //TODO: Replace with scale function?
    this.editorCamera.position.setX(curX + (this.velocity.x * delta));
    this.editorCamera.position.setY(curY + (this.velocity.y * delta));
    this.editorCamera.position.setZ(curZ + (this.velocity.z * delta));
    
    //Now modify velocity with acceleration
    //Increase or decrease X acceleration per second
    //Acceleration CAN be negative
    this.velocity.setX(this.velocity.x + this.acceleration.x * delta);
    this.velocity.setY(this.velocity.y + this.acceleration.y * delta);
    this.velocity.setZ(this.velocity.z + this.acceleration.z * delta);
    
    console.log("ACCEL X IS " + this.acceleration.x);
    console.log("ACCEL Z IS " + this.acceleration.z);
    //Ramp down velocity if acceleration is 0
    if (this.acceleration.x === 0)  
        this.velocity.x *= 0.9*delta;
    if (this.acceleration.z === 0) 
        this.velocity.z *= 0.9*delta;
    
    //Clamp X and Z (walking axes) velocity to max walking speed
    if (this.velocity.x > this.WALK_MAX_SPEED) 
        this.velocity.setX(this.WALK_MAX_SPEED);
    if (this.velocity.x < -this.WALK_MAX_SPEED) 
        this.velocity.setX(-this.WALK_MAX_SPEED);
    if (this.velocity.z > this.WALK_MAX_SPEED) 
        this.velocity.setZ(this.WALK_MAX_SPEED);
    if (this.velocity.z < -this.WALK_MAX_SPEED) 
        this.velocity.setZ(-this.WALK_MAX_SPEED);

};

EditorCameraController.prototype.setState = function(state) {
    //Get state, update based on state
    this.currentState = state;
    

};

//When walking set accel to ACCEL, when not set to 0.
//NOTE: 'this' assumes the scope of the FUNCTION CALLER, which
//in this case would be the eventListener, which in this context
//happens to be the Window. Therefore, we need to bind this function
//to the instance of EditorCameraController

EditorCameraController.prototype.onForwardPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
        this.velocity.setZ(-this.WALK_START_SPEED);
        this.acceleration.setZ(-this.WALK_ACCELERATION);
    }
}
EditorCameraController.prototype.onForwardReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setZ(0);
}
EditorCameraController.prototype.onBackwardPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
        this.velocity.setZ(this.WALK_START_SPEED);
        this.acceleration.setZ(this.WALK_ACCELERATION);
    }
}
EditorCameraController.prototype.onBackwardReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setZ(0);
}
EditorCameraController.prototype.onLeftPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
        this.velocity.setX(-this.WALK_START_SPEED);
        this.acceleration.setX(-this.WALK_ACCELERATION);
    }
}
EditorCameraController.prototype.onLeftReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setX(0);
}
EditorCameraController.prototype.onRightPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
        this.velocity.setX(this.WALK_START_SPEED);
        this.acceleration.setX(this.WALK_ACCELERATION);
    }
}
EditorCameraController.prototype.onRightReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setX(0);
}

EditorCameraController.prototype.onKeyDown = function(event) {
                //var val = 10;
            //if (isShiftPressed) val *= 10;
    
            //TODO: Move this into something like InputController
            //Set velocity, and then update will take care of updating it.
            //Delta of 1 should happen every 1/60 of a second at 60fps.
            //So do that!
    
            if (!(this instanceof EditorCameraController)) {
                throw "Must bind this function to the EditorCameraController object.";
            }
    
            switch( event.keyCode ) {
              case 90: 
                    //camera.position.z += val; 
                    break;   //z
              case 88: 
                    //camera.position.z -= val; 
                    break;   //x
              case 38:  //up key
                    if (this.currentState === this.STATE.STILL) {
                        this.setState(this.STATE.WALKING);
                        this.velocity.setZ(-this.WALK_START_SPEED);
                        this.acceleration.setZ(-this.WALK_ACCELERATION);
                    }
                    break;   
              case 40:  //down key
                    if (this.currentState === this.STATE.STILL) {
                        this.setState(this.STATE.WALKING);
                        this.velocity.setZ(this.WALK_START_SPEED);
                        this.acceleration.setZ(this.WALK_ACCELERATION);

                    }
                    break;   
              case 37:  //left
                    if (this.currentState === this.STATE.STILL) {
                        this.setState(this.STATE.WALKING);
                        this.velocity.setX(-this.WALK_START_SPEED);
                        this.acceleration.setX(-this.WALK_ACCELERATION);
                    }
                    break;   
              case 39:  //right
                    if (this.currentState === this.STATE.STILL) {
                        this.setState(this.STATE.WALKING);
                        this.velocity.setX(this.WALK_START_SPEED);
                        this.acceleration.setX(this.WALK_ACCELERATION);
                    }
                    break;   
              case 16:  //shift
                    //isShiftPressed = true;
                    break;
            }
};

EditorCameraController.prototype.onKeyUp = function(event) {
    
            var val = 10;
            //if (isShiftPressed) val *= 10;
    
            switch( event.keyCode ) {
              case 90: 
                    //camera.position.z += val; 
                    break;   //z
              case 88: 
                    //camera.position.z -= val; 
                    break;   //x
              case 38: 
                    this.setState(this.STATE.STILL);
                    this.acceleration.setZ(0);
                    break;   //up
              case 40: 
                    this.setState(this.STATE.STILL);
                    this.acceleration.setZ(0);
                    break;   //down
              case 37: 
                    this.setState(this.STATE.STILL);
                    this.acceleration.setX(0);

                    break;   //left
              case 39: 
                    this.setState(this.STATE.STILL);
                    this.acceleration.setX(0);
                    break;   //right
              case 16: 
                    //isShiftPressed = true;
                    break;
            }

};




EditorCameraController.prototype.moveForward = function() {
    this.editorCamera.position.z -= this.MAX_SPEED;
    
    console.log("Moved forward");
    this.printPos();

};
EditorCameraController.prototype.moveBack = function() {
    this.editorCamera.position.z += this.MAX_SPEED;
    
    console.log("Moved back");
    this.printPos();




};
EditorCameraController.prototype.moveLeft = function() {
    this.editorCamera.position.x -= this.MAX_SPEED;
    
    console.log("Moved left");
    this.printPos();
};
EditorCameraController.prototype.moveRight = function() {
    this.editorCamera.position.x += this.MAX_SPEED;
    
    console.log("Moved right");
    this.printPos();

};

EditorCameraController.prototype.printPos = function() {
    console.log("New pos is " + this.editorCamera.position.x + ", " 
                +  this.editorCamera.position.y + ", " 
                +  this.editorCamera.position.z);
};
