//Editor Camera
function EditorCamera(viewAngle, aspect, near, far) {
    //Extend normal camera
    THREE.PerspectiveCamera.call(this, viewAngle, aspect, near, far);
    //This should remain mostly static
    this.eulerOrder = 'ZYX';
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
    this.lookAmount = 0;
    


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
    
    var rotX = this.editorCamera.rotation.x;
    //TODO: Temporary turning of camera here x = y, z = z
    var newYRot =  -Math.cos(rotX)*this.turnAmount;
    var newZRot = Math.sin(rotX)*this.turnAmount;    
    
    
    this.editorCamera.rotation.y += newYRot * delta;
    this.editorCamera.rotation.z += newZRot * delta;
    this.editorCamera.rotation.x += this.lookAmount * delta;
    
    //if (this.editorCamera.rotation.x > Math.PI / 2) this.editorCamera.rotation.x = Math.PI / 2;
    //if (this.editorCamera.rotation.x < (3*Math.PI) / 2) this.editorCamera.rotation.x = (3*Math.PI) / 2;
    
    //Rotate the camera
    var rotY = this.editorCamera.rotation.y;
    
    
    //Rotate X and Z velocities based on rotation
    //This pretty much follows 2d rotation matrix http://en.wikipedia.org/wiki/Rotation_matrix
    var newXVel = Math.sin(rotY)*this.velocity.z + Math.cos(rotY)*this.velocity.x;
    var newZVel = Math.cos(rotY)*this.velocity.z - Math.sin(rotY)*this.velocity.x;
    this.velocity.setX(newXVel);
    this.velocity.setZ(newZVel);
    
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
    this.turnAmount = 1;
}
EditorCameraController.prototype.onTurnLeftReleased = function() {
    this.turnAmount = 0;
}
EditorCameraController.prototype.onTurnRightPressed = function() {
    this.turnAmount = -1;
}
EditorCameraController.prototype.onTurnRightReleased = function() {
    this.turnAmount = 0;
}
EditorCameraController.prototype.onLookUpPressed = function() {
    this.lookAmount = 1;
}
EditorCameraController.prototype.onLookUpReleased = function() {
    this.lookAmount = 0;
}
EditorCameraController.prototype.onLookDownPressed = function() {
    this.lookAmount = -1;
}
EditorCameraController.prototype.onLookDownReleased = function() {
    this.lookAmount = 0;
}




EditorCameraController.prototype.printPosswdd = function() {
    console.log("New pos is " + this.editorCamera.position.x + ", " 
                +  this.editorCamera.position.y + ", " 
                +  this.editorCamera.position.z);
};
