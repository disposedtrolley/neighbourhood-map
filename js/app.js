var map;
var infowindow;

var Restaurant = function(data) {
    var marker;
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.res_id = ko.observable(data.res_id);
    marker = new google.maps.Marker({
        position: {lat: data.lat, lng: data.lng},
        map: map,
        animation: google.maps.Animation.DROP
    });
    this.marker = ko.observable(marker);
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
    self.currentRestaurant = ko.observable();
    self.query = ko.observable();
    self.filteredList = ko.observableArray([]);

    self.filterList = function(value) {
        self.filteredList([]);
        for (var x in self.restaurantList()) {
            var restaurantName = self.restaurantList()[x].name().toLowerCase();
            if (restaurantName.indexOf(value.toLowerCase()) >= 0) {
                self.filteredList.push(self.restaurantList()[x]);
                self.restaurantList()[x].marker().setMap(map);
            } else {
                self.restaurantList()[x].marker().setMap(null);
            }
        }
    };

    self.query.subscribe(function(newValue) {
        console.log(newValue);
        self.filterList(newValue);
    });

    self.initMap = function() {
        var malvern = {lat: -37.8609852, lng: 145.0268996};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: malvern
        });
    };

    self.addRestaurants = function() {
        restaurants.forEach(function(restaurant) {
            self.restaurantList.push(new Restaurant(restaurant));
        });
    };

    self.addClickHandlers = function() {
        self.restaurantList().forEach(function(restaurant) {
            restaurant.marker().addListener('click', function() {
                self.restaurantClick(restaurant);
            });
        });
    };

    self.restaurantClick = function(restaurant) {
        if (infowindow) {
            infowindow.close();
        }
        infowindow.open(map, restaurant.marker());
        self.searchZomato(restaurant.res_id);
    };

    self.setRestaurant = function(clickedRestaurant) {
        self.currentRestaurant(clickedRestaurant);
    };

    self.searchZomato = function(res_id) {
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
        self.initMap();
        self.addRestaurants();
        self.addClickHandlers();
        self.filteredList(self.restaurantList());
    });
};

ko.applyBindings(new ViewModel());