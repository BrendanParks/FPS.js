//Requires three.js

var THRSCN = {};

THRSCN.ThreeScreen = function(width, height) {

    //Extend Object3D
    THREE.Object3D.call(this);

    console.log(this);

    const RADIUS = 5;
    const SEGMENTS = 4;
    const RINGS = 4;

    const PADDING = 2;

    this.shapes = [];

    for (var i = 0; i < width; i++) {
      this.shapes[i] = [];
      for (var j = 0; j < height; j++) {
        this.shapes[i][j] = [];

      }
    }

    //var baseSphere = new THREE.SphereGeometry( RADIUS,SEGMENTS,RINGS );
    var baseSphere = new THREE.BoxGeometry( 2,4,2 );

    var baseMaterial = new THREE.MeshLambertMaterial(  {color:'red',
                                      shininess: 40,
                                      transparent: true,
                                      opacity: 0.5 }  );


    var loc = new THREE.Vector3(-50,-3,50);
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {

        this.shapes[i][j] = new THREE.Mesh(baseSphere,new THREE.MeshBasicMaterial({color:'red'}));

        
        this.shapes[i][j].position
            .set(loc.x + ( PADDING*i ),loc.y ,loc.z + ( PADDING*j ));
        
          
        this.add(this.shapes[i][j]);
      }
    }
}
THRSCN.ThreeScreen.prototype = Object.create(THREE.Object3D.prototype);

THRSCN.ThreeScreen.prototype.changeVoxelColor = function(xCoord, yCoord, hexColor, isBackground) {
        this.shapes[xCoord][yCoord].material.color.setHex(hexColor);
}
