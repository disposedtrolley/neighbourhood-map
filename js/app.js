var map;
var infowindow;

/*
    Model for each restaurant.
 */
var Restaurant = function(data) {
    var marker;
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.res_id = data.res_id;
    marker = new google.maps.Marker({
        position: {lat: data.lat, lng: data.lng},
        map: map,
        animation: google.maps.Animation.DROP
    });
    this.marker = marker;
    var contentString = '<div class="info-window">'+
        '<h2 class="zomato-name"></h2>'+
        '<div id="bodyContent">'+
        '<p class="zomato-address"></p>'+
        '<p>Rating: <span class="zomato-rating"></span>/5</p>' +
        '<a class="zomato-url" href="">View on Zomato</a>' +
        '</div>'+
        '</div>';
    infowindow = new google.maps.InfoWindow({
        content: contentString
    });
};

var ViewModel = function() {
    var self = this;

    self.restaurantList = ko.observableArray([]);
    self.filteredList = ko.observableArray([]);
    self.currentRestaurant = ko.observable();
    self.query = ko.observable();   // search query

    self.filterList = function(value) {
        /*
            Filters the restaurant list based on the search query.
         */
        self.filteredList([]);
        for (var x in self.restaurantList()) {
            var restaurantName = self.restaurantList()[x].name().toLowerCase();
            if (restaurantName.indexOf(value.toLowerCase()) >= 0) {
                self.filteredList.push(self.restaurantList()[x]);
            } else {
                // Hide markers for locations not meeting search criteria.
                self.restaurantList()[x].marker.setVisible(false);
            }
        }
    };

    // Subscribe to changes on the search query.
    self.query.subscribe(function(newValue) {
        self.filterList(newValue);
    });

    self.initMap = function() {
        /*
            Initialise the map with coordinates for the local neighbourhood.
         */
        var centre = {lat: -37.8609852, lng: 145.0268996};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: centre
        });
    };

    self.addRestaurants = function() {
        /*
            Create and add all restaurants in the model.
         */
        restaurants.forEach(function(restaurant) {
            self.restaurantList.push(new Restaurant(restaurant));
        });
    };

    self.addClickHandlers = function() {
        /*
            Add click handlers to all restaurants.
         */
        self.restaurantList().forEach(function(restaurant) {
            restaurant.marker.addListener('click', function() {
                self.restaurantClick(restaurant);
            });
        });
    };

    self.restaurantClick = function(restaurant) {
        /*
            Set click behaviour for a restaurant
         */

        // centre the map on the selected restaurant.
        map.panTo(new google.maps.LatLng(restaurant.lat(), restaurant.lng()));
        // close other infowindows.
        if (infowindow) {
            infowindow.close();
        }
        infowindow.open(map, restaurant.marker;
        // call the Zomato API to fetch rating and URL.
        self.searchZomato(restaurant.res_id);
        // animate the marker.
        self.setMarkerAnimation(restaurant);
    };

    self.setMarkerAnimation = function(restaurant) {
        /*
            Set the marker animation to bounce once.
         */
        restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() { restaurant.marker.setAnimation(null); }, 700);
    };

    self.setRestaurant = function(clickedRestaurant) {
        self.currentRestaurant(clickedRestaurant);
    };

    self.searchZomato = function(res_id) {
        /*
            Call the Zomato API with a restaurant ID to fetch name, address, url, and rating.
         */
        var baseUrl = 'https://developers.zomato.com/api/v2.1/restaurant';
        $.ajax({
            url: baseUrl,
            headers: {
                'user-key': '66617cc443e6f236716ce3d534bb7d3c'
            },
            data: {
                'res_id': res_id
            },
            success: function(response) {
                $('.zomato-name').text(response.name);
                $('.zomato-address').text(response.location.address);
                $('.zomato-url').attr('href', response.url);
                $('.zomato-rating').text(response.user_rating.aggregate_rating);
            },
            error: function(xhr) {
                window.alert("Data from Zomato could not be loaded.");
            }
        });
    };

    google.maps.event.addDomListener(window, 'load', function() {
        // Call functions after the map has loaded.
        self.initMap();
        self.addRestaurants();
        self.addClickHandlers();
        self.filteredList(self.restaurantList());
    });
};

ko.applyBindings(new ViewModel());