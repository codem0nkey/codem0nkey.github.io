// Bar Locations
var locationData = [{
		'name': "Tracy's Bar & Grill",
		'latLng': {lat:33.810862, lng: -118.123903},
	},
	{
		'name': "Poor Richard's Cocktails",
		'latLng': {lat:33.794987, lng:-118.107528},
	},
	{
		'name': "Interlude",
		'latLng': {lat:33.788887, lng:-118.133500},
	},
	{
		'name': "Annex",
		'latLng': {lat:33.795937, lng:-118.142036},
	},
	{
		'name': "Blondie's",
		'latLng': {lat:33.796683, lng:-118.143140},
	}
];

// If Google Map cannot load error
mapError = function() {
	document.getElementById('map').innerHTML = '<h3>Sorry, Google Maps is unable to load.</h3><p>Please check your internet connection.</p>';
	document.getElementById('weatherdata').innerHTML ='<p>Unable to get weather</p>';
};

var address = "blah";

var koViewModel = function() {
  "use strict";
  var self = this;	
	var apiCall = 'https://api.apixu.com/v1/current.json?key=d4d70ce13e1740688cb32830172308&q=Long+Beach,+CA';
	var weatherinfo = "n/a";
	self.weatherdata = ko.observable(weatherinfo);
	
	// Weather API Call.
	$.getJSON(apiCall)
	.done(function(json) { 
		weatherinfo = json.current.temp_f + " / " + json.current.condition.text;
		self.weatherdata(weatherinfo);
	})
	.fail(function() {
		weatherinfo = "Unable to get weather";
		self.weatherdata(weatherinfo);
	});
		
	
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
		this.info = dataObject.info;
  }
  

  // define infowindow for markers with temp value.
  var infowindow = new google.maps.InfoWindow({
    content: "Could not get info on location"
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
		
		
			// Get place data for markers from FourSquare API call
			var fsApi = 'https://api.foursquare.com/v2/venues/search?client_id=KHP2W0SV0LGH1C2T0NCMEJMSYJTC00024X2BAYDOEXWW04QU&client_secret=KVYF5R1NTWDEK5OY1GPKBQTMVCLXCDFR03L3KOKOQ4DRIXFN&v=20180107&limit=1&near="Long Beach, CA"&query=' + '"' + place.name + '"';
				
			$.getJSON(fsApi)
			.done(function(fsData) {
				var fsName = fsData.response.venues[0].name;
				var fsAddress1 = fsData.response.venues[0].location.formattedAddress[0];
				var fsAddress2 = fsData.response.venues[0].location.formattedAddress[1];
				var phone = fsData.response.venues[0].contact.formattedPhone;
				var fsDisclaimer = "<img src='img/Powered-by-Foursquare-full-color-300.png' width='150'>";
				var barInfo = "<p><strong>" + fsName + ": </strong><br>" + fsAddress1  + "<br>" + fsAddress2 + "<br>Phone: " + phone + "<br>" + fsDisclaimer + "</p>";
				
				// set content for marker with FourSquare info
				infowindow.setContent(barInfo);
			})
			.fail(function() {
				var errorName = place.name;
				var errorUnable = "Sorry, unable to get bar info.";
				var errorMessage = place.name + "<br>" + errorUnable;
				infowindow.setContent(errorMessage);
			});
		
		
		
			infowindow.open(self.googleMap, place.marker);	
		});


    google.maps.event.addListener(infowindow, 'closeclick', function(){});

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