// map variable
var map;

// initialize the map
function initMap() {
	// constructor to create a new map JS object.
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 33.7997535, lng: -118.1231491},
		zoom: 15
	});

	//Create a marker on map
	var Lowes = {lat: 33.807822, lng: -118.121712};
	var marker = new google.maps.Marker({
		position: Lowes,
		map: map,
		title: 'First Marker!'
	});

	// info window for marker
	var infowindow = new google.maps.InfoWindow({
		content: 'Welcome to Lowes home improvement center for suckas!!'
	});
	// click for info window
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
}