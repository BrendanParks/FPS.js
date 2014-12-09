//Requires three.js

var THRSCN = {};

THRSCN.ThreeScreen = function(width, height) {

    //Extend Object3D
    THREE.Object3D.call(this);

    console.log(this);

    const RADIUS = 5;
    const SEGMENTS = 4;
    const RINGS = 4;

    const PADDING = 3;

    //const WIDTH
    //const HEIGHT = 240; //Formerly 15

    //this.parentObject = new THREE.Object3D();
    //levels = parseInt(levels);
    //if (!(loc instanceof THREE.Vector3)) throw "Location must be of type THREE.Vector3";
    //this.preventExtensions(this);

    //Init array of shapes
    this.shapes = [];

    for (var i = 0; i < width; i++) {
      this.shapes[i] = [];
      for (var j = 0; j < height; j++) {
        this.shapes[i][j] = [];

      }
    }

    //var baseSphere = new THREE.SphereGeometry( RADIUS,SEGMENTS,RINGS );
    var baseSphere = new THREE.BoxGeometry( 1,1,20 );

    var baseMaterial = new THREE.MeshLambertMaterial(  {color:'red',
                                      shininess: 40,
                                      transparent: true,
                                      opacity: 0.5 }  );


    var loc = new THREE.Vector3(0,0,0);
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {

/*
        this.shapes[i][j] = new THREE.Mesh(baseSphere,new THREE.MeshLambertMaterial(  {color:'red',
                                          shininess: 40,
                                          transparent: false,
                                          opacity: 1.0 }  ));

                                          */

        this.shapes[i][j] = new THREE.Mesh(baseSphere,new THREE.MeshBasicMaterial({color:'red'}));

        this.shapes[i][j].position
            .set(loc.x + ( PADDING*i ),loc.y + ( PADDING*j ),loc.z);


        //Add shapes to Object3D
        //  NOTE: This is already stored in the .children property, but
        //  I wanted to represent it as a 2d array for simplicity's sake

        this.add(this.shapes[i][j]);
      }
      //scene.add(this.parentObject);

    }

    //Different colors for different levels of intensity?
    /*
    this.materialTest = new THREE.MeshLambertMaterial({
      color : Math.floor(Math.random()*0xFFFFFF)
    });
    */

}
THRSCN.ThreeScreen.prototype = Object.create(THREE.Object3D.prototype);

THRSCN.ThreeScreen.prototype.changeVoxelColor = function(xCoord, yCoord, hexColor, isBackground) {
    if (hexColor == 0x000000) {
        //this.shapes[xCoord][yCoord].material.wireframe = true;
    } else {
        //this.shapes[xCoord][yCoord].material.wireframe = false;
        this.shapes[xCoord][yCoord].material.color.setHex(hexColor);
    }
    
    
}
