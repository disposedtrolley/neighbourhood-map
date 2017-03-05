function initMap() {
    var malvern = {lat: -37.8609852, lng: 145.0268996};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: malvern
    });
    restaurants.forEach(function(restaurant) {
        var marker = new google.maps.Marker({
            position: {lat: restaurant.lat, lng: restaurant.lng},
            map: map
        });
    });
}

var Restaurant = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

var ViewModel = function() {
    var self = this;
    this.restaurantList = ko.observableArray([]);
    restaurants.forEach(function(restaurant) {
        self.restaurantList.push(new Restaurant(restaurant));
    });
};

ko.applyBindings(new ViewModel());