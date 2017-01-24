
'use strict'

var btnTitle = "Begin Journey";

function JourneyControl() {}

JourneyControl.prototype.onAdd = function(map) {
  this._map = map;
  this._container = document.createElement('div');
  this._container.className = 'mapboxgl-ctrl journey-ctrl';

  var beginBtn = document.createElement('button');
  beginBtn.className = 'btn btn-lg btn-primary journey-begin';
  beginBtn.innerHTML = btnTitle; //'Begin';
  beginBtn.addEventListener('click', this.beginJourney.bind(this));
  this.beginButton = beginBtn;

  this._container.appendChild(beginBtn);

  return this._container;

};

JourneyControl.prototype.onRemove = function () {
  this._container.parentNode.removeChild(this._container);
  this._map = undefined;
};

JourneyControl.prototype.beginJourney = function () {

  if(this.beginButton.innerHTML !== btnTitle){
    //abort
    this.abort = true;
    this.beginButton.innerHTML = 'Ending Journey...'
    if(this.currentTimeout){
      window.clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if(this.currentPromise){
      Promise.resolve(this.currentPromise)
      this.goto(this._map.home.center, this._map.home.zoom)
      .then(() => {
        this.beginButton.innerHTML = btnTitle;
      })
      this.currentPromise = null;
    }
    if(this.currentMarker){
      var popup = this.currentMarker.getPopup();
      popup.remove();
    }
    //this._map.stop();
    return;
  }
  this.abort = false;
  this.beginButton.innerHTML = "End";

  // //journey plan
  !this.abort && this.goto(this._map.locations.born)
  .then(() => !this.abort && this.goto(this._map.locations.grad))
  .then(() => !this.abort && this.fly(this._map.locations.grad.getLngLat().toArray(),
                       this._map.locations.pg.getLngLat().toArray(), 2.8))
  .then(() => !this.abort && this.goto(this._map.locations.pg, 15))
  .then(() => !this.abort && this.fly(this._map.locations.pg.getLngLat().toArray(),
                       this._map.locations.jobRmsi.getLngLat().toArray(), 2.8))
  .then(() => !this.abort && this.goto(this._map.locations.jobRmsi, 15))
  .then(() => !this.abort && this.goto(this._map.locations.jobNiit, 15))
  .then(() => !this.abort && this.fly(this._map.locations.jobNiit.getLngLat().toArray(),
                       this._map.locations.jobFC.getLngLat().toArray(), 1.5, [0,51]))
  .then(() => !this.abort && this.goto(this._map.locations.jobFC))
  .then(() => !this.abort && this.fly(this._map.locations.jobFC.getLngLat().toArray(),
                       this._map.locations.jobEsri.getLngLat().toArray(), 5))
  .then(() => !this.abort && this.goto(this._map.locations.jobEsri))
  .then(() => this.goto(this._map.home.center, this._map.home.zoom))
  .then(() => {
    this.beginButton.innerHTML = btnTitle;
  })

};

JourneyControl.prototype.goto = function (locMarker, zoom = 13) {
  var locCoord = locMarker instanceof mapboxgl.Marker ?
    locMarker.getLngLat().toArray() :
    locMarker;
  var p = new Promise((resolve, reject) => {
    this._map.flyTo({
      center: locCoord,
      zoom: zoom
    });
    this._map.once('zoomend', () => {
      if(locMarker instanceof mapboxgl.Marker){
        locMarker.togglePopup();
        //wait for 5 sec then resolve the Promise
        this.currentPromise = p;
        this.currentMarker = locMarker;
        this.currentTimeout = window.setTimeout(() => {
          this.currentPromise = null;
          this.currentTimeout = null;
          this.currentMarker = null;
          locMarker.togglePopup();
          resolve();
        }, 5000)
      } else {
        resolve();
      }
    });
  });
  return p;
};

JourneyControl.prototype.fly = function (origin, destination, zoom, waypoint) {
  return new Promise((resolve, reject) => {
    var flightPath = [];
    flightPath.push(origin);
    waypoint && flightPath.push(waypoint);
    flightPath.push(destination);

    var route = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": flightPath
        }
      }]
    };
    this.route = route;
    var plane = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": origin
        }
      }]
    };
    this.plane = plane;
    this.destination = destination;
    var destPoint = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": destination
      }
    };
    var originPoint = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": origin
      }
    };
    // Calculate the distance between origin and dest
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
    var bearing = turf.bearing(originPoint, destPoint);
    var midpoint = turf.midpoint(originPoint, destPoint);
    this._map.flyTo({
      center: midpoint.geometry.coordinates,
      zoom: zoom
    })
    //draw an arc between orig and dest
    var arc = [];
    for (var i = 0; i < lineDistance; i++) {
      var segment = turf.along(route.features[0], i/1000 * lineDistance,'kilometers');
      arc.push(segment.geometry.coordinates);
    }

    route.features[0].geometry.coordinates = arc;

    this.counter = 0;
    this._map.addSource('route', {
      "type": "geojson",
      "data": route
    });

    this._map.addSource('plane', {
      "type": "geojson",
      "data": plane
    });

    this._map.addLayer({
      "id": "route",
      "source": "route",
      "type": "line",
      "paint": {
        "line-width": 2,
        "line-color": "#007cbf"
      }
    });

    this._map.addLayer({
      "id": "plane",
      "source": "plane",
      "type": "symbol",
      "layout": {
        "icon-image": "airport-15",
        "icon-rotate": bearing
      }
    });

    this.animateFly(function(){
      resolve();
    });
  });

};

JourneyControl.prototype.animateFly = function (callback) {
  //DevNote: Tried to use promise here but this fu is recursive
  // and its using requestAnimationFrame() thats why used callback.
  //Promise did not work in this case.
  this.plane.features[0].geometry.coordinates =
    this.route.features[0].geometry.coordinates[this.counter];
  this._map.getSource('plane').setData(this.plane);
  if(this.plane.features[0].geometry.coordinates[0] !== this.destination[0] && !this.abort) {
    requestAnimationFrame(this.animateFly.bind(this, callback));
  } else {
    this.clearMap();
    callback.call();
  }
  this.counter++;
};

JourneyControl.prototype.clearMap = function () {
  this.plane = null;
  this.route = null;
  this._map.getLayer('plane') && this._map.removeLayer('plane');
  this._map.getLayer('route') && this._map.removeLayer('route');
  this._map.getSource('plane') && this._map.removeSource('plane');
  this._map.getSource('route') && this._map.removeSource('route');
};
