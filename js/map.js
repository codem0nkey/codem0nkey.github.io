var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 33.7997535, 
			lng: -118.1231491
        },
        zoom: 15
    });

	// Bar Locations
    var locations = [{
            title: "Tracy's Bar & Grill",
            location: {
                lat: 33.810862,
                lng: -118.123903
            },
			visible: false
        },
        {
            title: "Poor Richard's Cocktails",
            location: {
                lat: 33.794987,
                lng: -118.107528
            }, 
			visible: true
        },
        {
            title: "Interlude",
            location: {
                lat: 33.788887,
                lng: -118.133500
            },
			visible: true
        },
        {
            title: "Annex",
            location: {
                lat: 33.795937,
                lng: -118.142036
            },
			visible: true
        },
        {
            title: "Blondie's",
            location: {
                lat: 33.796683,
                lng: -118.143140
            },
			visible: true
        },
    ];

	

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		bounds.extend(markers[i].position);
		
		// put locations in the list
		$("#list").append("<li>" + title + "</li>");
	}
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

var weatherApi = 'https://api.apixu.com/v1/current.json?key=d4d70ce13e1740688cb32830172308&q=Long+Beach,+CA';
