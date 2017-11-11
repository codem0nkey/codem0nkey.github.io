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

var koViewModel = function() {
  "use strict";
  var self = this;

  var bounds = new google.maps.LatLngBounds();

  // Construct the Google Map.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
  });

  // Build "Place" objects from locationData object.
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });

  // Place constructor function.
  function Place(dataObject) {
    this.name = dataObject.name;
    this.latLng = dataObject.latLng;
  }
  

  // Set infowindow
  var infowindow = new google.maps.InfoWindow({
    content: "bar"
  });

  
  // Build Markers via the Maps API and place them on the map.
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

    //This function is triggered when a list item is clicked.
    self.openInfoWindow = function() {
      google.maps.event.trigger(this.marker, 'click');
    };
  });

  self.googleMap.fitBounds(bounds);

  // This array contains places that should show as markers on the map (based on user input).
  self.visiblePlaces = ko.observableArray();
  
  
  // Initialize map with all places.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
	
  });
  
  
  // This observable tracks user input in the search field.
  self.userInput = ko.observable('');
  
  
  // This filter compares the userInput observable to the visisblePlaces array.
  // Non-matching places are filtered off of the map.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    
    self.visiblePlaces.removeAll();
    
    // This looks at the name of each place and then determines if the user
    // input can be found within the place name.
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