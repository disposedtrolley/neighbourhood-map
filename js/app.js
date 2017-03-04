var restaurants = [
    {
        name: 'Do 1 Thing',
        lat: -37.85773,
        lng: 145.0293009
    },
    {
        name: 'BOY & Co.',
        lat: -37.8586496,
        lng: 145.028872
    },
    {
        name: 'Millstone',
        lat: -37.865762,
        lng: 145.0295536
    }
];

var Marker = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
};

function initMap() {
    var malvern = {lat: -37.8584378, lng: 145.0181495};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: malvern
    });
    restaurants.forEach(function(restaurant) {
        var marker = new google.maps.Marker({
            position: {lat: restaurant.lat, lng: restaurant.lng},
            map: map
        });
    });
}


var ViewModel = function() {
    var self = this;
    initMap();
};

ko.applyBindings(new ViewModel());