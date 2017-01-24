
(function(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lyaXNoeWFkYXYyMCIsImEiOiJjaXgwMzdtdmEwMXF4MnpxY3d5bzF3a21tIn0.ZzV0PBfMtGT_kjV0AffDIw';

  var mapCenter = [-10,25];
  var ghar = [79.958925, 23.169810];
  var college = [79.968860, 23.163503];
  var delhi = [77.1025, 28.7041];
  var rmsi = [77.315201, 28.578143];
  var niit = [77.379649, 28.630694];
  var enschede = [6.885788, 52.223699];
  var fortCollins = [-104.987969, 40.477509];
  var redlands = [-117.195690, 34.056091];

  var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 1.5,
      center: mapCenter,
      renderWorldCopies: false
  });
  //maxBounds: [[-130, -30], [120, 65]]

  map.locations = {};
  map.home = {
    center: mapCenter,
    zoom: 1.5
  };

  //add markers
  //born
  var popupBorn = new mapboxgl.Popup({offset: [0, -15]})
    .setText('March 20th, 1985 :- Born');
  var bornNode = document.createElement('div');
  bornNode.id = 'popupBorn';
  bornNode.className = 'marker';

  var born = new mapboxgl.Marker(bornNode, {offset: [-12, -12]})
    .setLngLat(ghar)
    .setPopup(popupBorn)
    .addTo(map);

  map.locations.born = born;

  //Graduate
  var popupGraduate = new mapboxgl.Popup({offset: [0, -15]})
    .setHTML('<p>2002 - 2005 :- Graduation in Computer Science, Geology, Mathematics </br>2005 - 2007 :- Post graduation in Geology</p>');
  var graduateNode = document.createElement('div');
  graduateNode.id = 'popupGraduate';
  graduateNode.className = 'marker';

  var grad = new mapboxgl.Marker(graduateNode, {offset: [6, -12]})
    .setLngLat(college)
    .setPopup(popupGraduate)
    .addTo(map);

  map.locations.grad = grad;

  //Post Graduate
  var popupPostGraduate = new mapboxgl.Popup({offset: [0, -15]})
    .setText('2008 - 2010 :- Master degree in Geoinformation Science and Earth Observation');
  var pgNode = document.createElement('div');
  pgNode.id = 'popupPG';
  pgNode.className = 'marker';

  var pg = new mapboxgl.Marker(pgNode, {offset: [-12, -12]})
    .setLngLat(enschede)
    .setPopup(popupPostGraduate)
    .addTo(map);

  map.locations.pg = pg;

  //1st job - delhi
  var popupjob1 = new mapboxgl.Popup({offset: [0, -15]})
    .setHTML('<p>March 2010 - May 2011 :- GIS Engineer at RMS India Pvt. Ltd.');
  var job1Node = document.createElement('div');
  job1Node.id = 'popupJob1';
  job1Node.className = 'job marker';

  var job1 = new mapboxgl.Marker(job1Node, {offset: [-12, -12]})
    .setLngLat(rmsi)
    .setPopup(popupjob1)
    .addTo(map);

  map.locations.jobRmsi = job1;

  // job - niit
  var popupjobNiit = new mapboxgl.Popup({offset: [0, -15]})
    .setHTML('<p>Jun 2011 - Dec 2012 :- GIS Developer at ESRI India (NIIT GIS)');
  var jobNiitNode = document.createElement('div');
  jobNiitNode.id = 'popupJobNiit';
  jobNiitNode.className = 'job marker';

  var jobNiit = new mapboxgl.Marker(jobNiitNode, {offset: [-12, -12]})
    .setLngLat(niit)
    .setPopup(popupjobNiit)
    .addTo(map);

  map.locations.jobNiit = jobNiit;

  //3rd job - FoCo
  var popupjob2 = new mapboxgl.Popup({offset: [0, -15]})
    .setText('Jan 2013 - Dec 2014 :- Sr. GIS Developer at Schneider Electric.');
  var job2Node = document.createElement('div');
  job2Node.id = 'popupJob2';
  job2Node.className = 'job marker';

  var job2 = new mapboxgl.Marker(job2Node, {offset: [-12, -12]})
    .setLngLat(fortCollins)
    .setPopup(popupjob2)
    .addTo(map);

  map.locations.jobFC = job2;

  //4th job - redlands
  var popupjob3 = new mapboxgl.Popup({offset: [0, -15]})
    .setText('Jan 2015 - Present :- Technical Analyst at ESRI Inc.');
  var job3Node = document.createElement('div');
  job3Node.id = 'popupJob3';
  job3Node.className = 'job marker';

  var job3 = new mapboxgl.Marker(job3Node, {offset: [-12, -12]})
    .setLngLat(redlands)
    .setPopup(popupjob3)
    .addTo(map);

  map.locations.jobEsri = job3;

  //Add Journey control
  var journeyCtrl = new JourneyControl();
  map.addControl(journeyCtrl, 'bottom-left');

})()
