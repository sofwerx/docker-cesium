////var preloadTimeInSeconds = 100;
////processPart(partsToLoad[0]);
//
//
//// Show the status display below the reset button.
////statusDisplay.style.background = 'rgba(42, 42, 42, 0.7)';
////statusDisplay.style.padding = '5px 10px';
////document.getElementById('toolbar').appendChild(statusDisplay);
//
//// Show a multi-part custom property being read from CZML.
////locAccDisplay.style.background = 'rgba(42, 42, 42, 0.7)';
////locAccDisplay.style.padding = '5px 10px';
////locAccDisplay.style.marginTop = '5px';
////toolbar = document.getElementById('toolbar')
////toolbar.appendChild(locAccDisplay);
////
////toolbar.addToolbarButton('Reset demo', function() {
////    // Put things back to the starting position.
////    viewer.clock.currentTime = viewer.clock.startTime;
////    viewer.clock.shouldAnimate = true;
////
////    partsToLoad.forEach(function(part) {
////        part.requested = false;
////        part.loaded = false;
////    });
////
////    dataSource.entities.removeAll();
////    processPart(partsToLoad[0]);
////});
////
//
////document.getElementById('toolbar').appendChild(locAccDisplay);
//
//
//
//function updateStatusDisplay() {
//  var msg = '';
//  partsToLoad.forEach(function(part) {
//      msg += part.url + ' - ';
//      if (part.loaded) {
//          msg += 'Loaded.<br/>';
//      } else if (part.requested) {
//          msg += 'Loading now...<br/>';
//      } else {
//          msg += 'Not needed yet.<br/>';
//      }
//  });
//  statusDisplay.innerHTML = msg;
//}


// Helper function to mark a part as requested, and process it into the dataSource.
function processPart(part) {
  part.requested = true;
  updateStatusDisplay();
  dataSource.process(czmlPath + part.url).then(function() {
      part.loaded = true;
      updateStatusDisplay();

      // Follow the vehicle with the camera.
      if (!viewer.trackedEntity) {
          viewer.trackedEntity = vehicle = dataSource.entities.getById('Vehicle');
      }
  });
}



viewer.clock.onTick.addEventListener(function(clock) {
  // This example uses time offsets from the start to identify which parts need loading.
  var timeOffset = Cesium.JulianDate.secondsDifference(clock.currentTime, clock.startTime);

  // Filter the list of parts to just the ones that need loading right now.
  // Then, process each part that needs loading.
  partsToLoad.filter(function(part) {
      return (!part.requested) &&
          (timeOffset >= part.range[0] - preloadTimeInSeconds) &&
          (timeOffset <= part.range[1]);
  }).forEach(function(part) {
      processPart(part);
  });

  if (vehicleEntity) {
      var locAcc = vehicleEntity.properties.locationAccuracy.getValue(clock.currentTime);
      if (Cesium.defined(locAcc)) {
          locAccDisplay.textContent = 'Location Accuracy: ' + locAcc.toFixed(2);
      }
  }
});


addToolbarButton('Reset demo', function() {
    // Put things back to the starting position.
    viewer.clock.currentTime = viewer.clock.startTime;
    viewer.clock.shouldAnimate = true;

    partsToLoad.forEach(function(part) {
        part.requested = false;
        part.loaded = false;
    });

    dataSource.entities.removeAll();
    processPart(partsToLoad[0]);
});

