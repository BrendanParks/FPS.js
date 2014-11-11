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

    console.log("MAX SPEED IS " + this.WALK_MAX_SPEED);
    
    //TODO: Temporary variable for testing turning
    this.turnAmount = 0;
    


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
    
    //Rotate cam, Update pos, THEN modify velocity. (as in mult it by acceleration)
    
    var curX = this.editorCamera.position.x;
    var curY = this.editorCamera.position.y;
    var curZ = this.editorCamera.position.z;
    
    
    //TODO: Temporary turning of camera here
    this.editorCamera.rotation.y += this.turnAmount;
    /*
    
    //Rotation stuff

    //console.log("hey " + this.editorCamera.rotation.y + " turnAmount is " + this.turnAmount );
    //TODO: Modify velocity based on rotation HERE!
    var oldXVel = this.velocity.x;
    var oldZVel = this.velocity.z;
    var newXVel = Math.cos(this.editorCamera.rotation.y) * this.velocity.x;
    //newXVel += oldZVel * Math.sin(this.editorCamera.rotation.y);
    
    var newZVel = Math.cos(this.editorCamera.rotation.y) * this.velocity.z;
    //newZVel += oldXVel * Math.cos(this.editorCamera.rotation.y);
    
    this.velocity.setX(newXVel);
    this.velocity.setZ(newZVel);
    */
    
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
    

    
    
    //console.log("ACCEL X IS " + this.acceleration.x);
    //console.log("ACCEL Z IS " + this.acceleration.z);
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
    }
    this.velocity.setZ(-this.WALK_START_SPEED);
    this.acceleration.setZ(-this.WALK_ACCELERATION);
}
EditorCameraController.prototype.onForwardReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setZ(0);
}
EditorCameraController.prototype.onBackwardPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
    }
    this.velocity.setZ(this.WALK_START_SPEED);
    this.acceleration.setZ(this.WALK_ACCELERATION);
}
EditorCameraController.prototype.onBackwardReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setZ(0);
}
EditorCameraController.prototype.onLeftPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
    }
    this.velocity.setX(-this.WALK_START_SPEED);
    this.acceleration.setX(-this.WALK_ACCELERATION);    
    
}
EditorCameraController.prototype.onLeftReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setX(0);
}
EditorCameraController.prototype.onRightPressed = function() {
    if (this.currentState === this.STATE.STILL) {
        this.setState(this.STATE.WALKING);
    }
    this.velocity.setX(this.WALK_START_SPEED);
    this.acceleration.setX(this.WALK_ACCELERATION);    
    
}
EditorCameraController.prototype.onRightReleased = function() {
    this.setState(this.STATE.STILL);
    this.acceleration.setX(0);
}

//TODO: Temporary functions for testing out turning
EditorCameraController.prototype.onTurnLeftPressed = function() {
    this.turnAmount = -0.025;
}
EditorCameraController.prototype.onTurnLeftReleased = function() {
    this.turnAmount = 0;
}
EditorCameraController.prototype.onTurnRightPressed = function() {
    this.turnAmount = 0.025;
}
EditorCameraController.prototype.onTurnRightReleased = function() {
    this.turnAmount = 0;
}



EditorCameraController.prototype.printPos = function() {
    console.log("New pos is " + this.editorCamera.position.x + ", " 
                +  this.editorCamera.position.y + ", " 
                +  this.editorCamera.position.z);
};
