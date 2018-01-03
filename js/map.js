// Bar Locations
var locationData = [{
		'name': "Tracy's Bar & Grill",
		'latLng': {lat:33.810862, lng: -118.123903}
	},
	{
		'name': "Poor Richard's Cocktails",
		'latLng': {lat:33.794987, lng:-118.107528}
	},
	{
		'name': "Interlude",
		'latLng': {lat:33.788887, lng:-118.133500}
	},
	{
		'name': "Annex",
		'latLng': {lat:33.795937, lng:-118.142036}
	},
	{
		'name': "Blondie's",
		'latLng': {lat:33.796683, lng:-118.143140}
	}
];

  mapError = function() {
		document.getElementById('map').innerHTML = '<h3>Sorry, Google Maps is unable to load.</h3><p>Please check your internet connection.</p>';
		document.getElementById('weather').style.display = 'none';
		document.getElementById('left-menu').style.display = 'none';
		document.getElementById('title-top').className = 'col-xs-12 col-md-12';
	};


var koViewModel = function() {
  "use strict";
  var self = this;
  var weatherinfo;
  var apiCall = 'https://api.apixu.com/v1/current.json?key=d4d70ce13e1740688cb32830172308&q=Long+Beach,+CA';
  
  $.getJSON(apiCall,weatherCallBack);
  
  
  function weatherCallBack(weatherdata){
	var weatherinfo = weatherdata.current.temp_f + " / " + weatherdata.current.condition.text;
	  $('#weatherinfo').append(weatherinfo);
	  console.log(weatherinfo);
  };

  var bounds = new google.maps.LatLngBounds();

  // Create new Google Map.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
  });
  

  // Iterate thru locationData and send to "Place" funtion.
  self.allPlaces = [];
  locationData.forEach(function(place) {
  self.allPlaces.push(new Place(place));
  });

  // Place function
  function Place(dataObject) {
    this.name = dataObject.name;
    this.latLng = dataObject.latLng;
  }
  

  // define infowindow for markers with temp value.
  var infowindow = new google.maps.InfoWindow({
    content: "bar"
  });

  
  // Create markers
  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng
    };
    
    place.marker = new google.maps.Marker(markerOptions);
    bounds.extend(place.marker.position);

    google.maps.event.addListener(place.marker, 'click', function() {
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function() {
        place.marker.setAnimation(null);
      }, 1500);
	  infowindow.setContent(place.name);
      infowindow.open(self.googleMap, place.marker);	
    });


    google.maps.event.addListener(infowindow, 'closeclick', function(){
    });

    //function for clicked markers
    self.openInfoWindow = function() {
      google.maps.event.trigger(this.marker, 'click');
    };
  });

  self.googleMap.fitBounds(bounds);

  // Only show visible markers
  self.visiblePlaces = ko.observableArray();
  
  
  // Put markers on the map.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
	
  });
  
  
  // Obserable for search
  self.userInput = ko.observable('');
  
  
  // Filter out markers based on search
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    // Matches thru list of bars based on user input (search functionality)
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);
      
      if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
		
      }
    });
    
    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });
  };


};

function initMap() {
  ko.applyBindings(new koViewModel());
}