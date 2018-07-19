
    var datafile = '/AgileMeridian/edges.json';

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NGJiNTUwMy0wMDU5LTQ0MzMtODM2NS0xNjM4ZDZmMGJkYjgiLCJpZCI6MjE5MywiaWF0IjoxNTMxOTQ4NTM0fQ.74ujs8JSOZnbRJbLhf2RtrrFQyTZ5tQ7yA0xA1xqTw0';

    var viewer = new Cesium.Viewer('cesiumContainer');

    var scene = viewer.scene;

    var center = Cesium.Cartesian3.fromDegrees(-82.4374762, 27.9561611, 0.0)
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
    var heading = Cesium.Math.toRadians(90.0);
    var pitch = Cesium.Math.toRadians(45.0);
    var range = 500.0;

//    var orangeCylinder = viewer.entities.add({
//        name : 'Warning',
//        position: Cesium.Cartesian3.fromDegrees(-82.4374762, 27.9561611, 0.0),
//        cylinder : {
//            length : 100.0,
//            topRadius : 200.0,
//            bottomRadius : 100.0,
//            material : Cesium.Color.ORANGE.withAlpha(0.5),
//            outline : true,
//            outlineColor : Cesium.Color.ORANGE
//        }
//    });
//    var blueWall = viewer.entities.add({
//        name : 'Blue wall with sawtooth heights and outline',
//        wall : {
//            positions : Cesium.Cartesian3.fromDegreesArray([-82.4365, 27.952,
//                                                            -82.4365, 27.95,
//                                                            -82.4365, 27.947,
//                                                            -82.4365, 27.944 ]),
//            maximumHeights : [100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100],
//            minimumHeights : [0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0],
//            material : Cesium.Color.RED.withAlpha(0.5),
//            outline : true,
//            outlineColor : Cesium.Color.RED
//        }
//});

var pts;
var dot;
loadJSON(function(response) {
    pts = JSON.parse(response);
});

    for (var i = 0; i < pts.length; ++i) {
        var c = Cesium.Color.GREEN;
        var ol = Cesium.Color.DARKGREEN;

        if (pts[i]._source.location.speed < 20.0) {
	    c = Cesium.color.RED;
	    ol = Cesium.color.DARKRED;
        } else if (pts[i]._source.location.speed < 35.0) {
            c = Cesium.color.ORANGE;
            ol = Cesium.color.DARKORANGE;
        }

        dot = viewer.entities.add({
          position : Cesium.Cartesian3.fromDegrees(pts[i]._source.geo.lon, pts[i]._source.geo.lat),
          point : {
              pixelSize : 2,
              color : c,
              outlineColor : ol,
              outlineWidth : 1
          }
        });
    }


var entity = viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(-82.435, 27.95616,25),
    model : {
        uri : '../../../../Apps/SampleData/models/CesiumBalloon/CesiumBalloon.glb',
        scale : 3.0
    }
});
                                    
    viewer.terrainProvider = Cesium.createWorldTerrain();

    viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));     

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', datafile, false); // Replace with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
