var map;

var Restaurant = function(data) {
    var marker;
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    marker = new google.maps.Marker({
        position: {lat: data.lat, lng: data.lng},
        map: map
    });
    this.marker = ko.observable(marker);
};

var ViewModel = function() {
    var self = this;

    self.restaurantList = ko.observableArray([]);
    self.currentRestaurant = ko.observable();
    self.query = ko.observable();

    self.filterList = function(value) {
        self.restaurantList.removeAll();
        for (var x in restaurants) {
            if (restaurants[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.restaurantList.push(restaurants[x]);
            }
        }
    };

    self.query.subscribe(function(newValue) {
        self.filterList(newValue);
    });

    self.initMap = function() {
        var malvern = {lat: -37.8609852, lng: 145.0268996};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
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
                self.setRestaurant(restaurant);
                self.openModal();
            });
        });
    };

    self.setRestaurant = function(clickedRestaurant) {
        self.currentRestaurant(clickedRestaurant);
    };

    self.openModal = function() {
        $('#detail-modal').modal('show');
    };

    google.maps.event.addDomListener(window, 'load', function() {
        self.initMap();
        self.addRestaurants();
        self.addClickHandlers();
    });
};

ko.applyBindings(new ViewModel());