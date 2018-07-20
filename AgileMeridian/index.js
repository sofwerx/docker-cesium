Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NGJiNTUwMy0wMDU5LTQ0MzMtODM2NS0xNjM4ZDZmMGJkYjgiLCJpZCI6MjE5MywiaWF0IjoxNTMxOTQ4NTM0fQ.74ujs8JSOZnbRJbLhf2RtrrFQyTZ5tQ7yA0xA1xqTw0';

var viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate : false,
    timeline : true
});

var datafile = '/AgileMeridian/edges2.json';
var scene = viewer.scene;
var statusDisplay = document.getElementById('toolbar');
//var statusDisplay = document.createElement('div');

var center = Cesium.Cartesian3.fromDegrees(-82.4374762, 27.9561611, 0.0)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
var heading = Cesium.Math.toRadians(270.0);
var pitch = Cesium.Math.toRadians(60.0);
var range = 500.0;

var pts;
var dot;
loadJSON(function(response) {
    pts = JSON.parse(response);
});


viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));

for (var i = 0; i < pts.length; ++i) {
    var c = Cesium.Color.GREEN;
    var ol = Cesium.Color.DARKGREEN;
    var locacc = pts[i]._source.location.locationAccuracy;

    var dotdesc = '<img height="100px" style="float: left; margin: 1em;" src="images/greenlight.png" /><p style="font-size: 200%; font-weight: bold; color: green; padding-bottom: 25px;">High</p><p style="padding-bottom: 5px;">Lat: ' + pts[i]._source.geo.lat + '<br />Lon: ' +  pts[i]._source.geo.lon + '</p>';

    if (locacc < 8.0) {
        c = Cesium.Color.RED;
        ol = Cesium.Color.DARKRED;
        var dotdesc = '<img height="100px" style="float: left; margin: 1em;" src="images/redlight.png" /><p style="font-size: 200%; font-weight: bold; color: red; padding-bottom: 25px;">Low</p><p style="padding-bottom: 5px;">Lat: ' + pts[i]._source.geo.lat + '<br />Lon: ' +  pts[i]._source.geo.lon + '</p>';
    } else if (locacc < 13.0) {
        c = Cesium.Color.ORANGE;
        ol = Cesium.Color.DARKORANGE;
        var dotdesc = '<img height="100px" style="float: left; margin: 1em;" src="images/yellowlight.png" /><p style="font-size: 200%; font-weight: bold; color: orange; padding-bottom: 25px;">Moderate</p><p style="padding-bottom: 5px;">Lat: ' + pts[i]._source.geo.lat + '<br />Lon: ' +  pts[i]._source.geo.lon + '</p>';
    }

//    ti = new Cesium.TimeIntervalCollection();
//
//    d = new Date(pts[i]._source.location.timestamp);
//    ti.addInterval(
//	Cesium.TimeInterval.fromIso8601(options : {
//          iso8601 :  d.toISOString()
//        });
//    );
//    ti.addInterval(
//        Cesium.TimeInterval.fromIso8601(options : {
//          iso8601 : Date.now().toISOString()
//        })
//    );

    dot = viewer.entities.add({
      position : Cesium.Cartesian3.fromDegrees(pts[i]._source.geo.lon, pts[i]._source.geo.lat),
//      availability : ti,
      name: 'GPS Signal Confidence',
      description : dotdesc,
      point : {
          pixelSize : 2,
          color : c,
          outlineColor : ol,
          outlineWidth : 1
      },
    });
}


var vehicle = viewer.entities.add({
  position : Cesium.Cartesian3.fromDegrees(-82.435, 27.95616,25),
  model : {
      uri : '../../../../Apps/SampleData/models/CesiumBalloon/CesiumBalloon.glb',
      scale : 3.0
  }
});
                                  
// C
//var clock = new Cesium.Clock({
//   startTime : Cesium.JulianDate.fromIso8601("2018-06-01"),
//   currentTime : Cesium.JulianDate.fromIso8601("2018-06-15"),
//   stopTime : Cesium.JulianDate.fromIso8601("2018-06-30"),
//   clockRange : Cesium.ClockRange.LOOP_STOP,
//   clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
//   shouldAnimate : true
//});
//viewer.ClockViewModel = new Cesium.ClockViewModel(clock);


///////////////////////////////////////////////

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


