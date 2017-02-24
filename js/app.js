function initMap() {
    var melbourne = {lat: -37.8136, lng: 144.9631};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: melbourne
    });
    var marker = new google.maps.Marker({
      position: melbourne,
      map: map
    });
}