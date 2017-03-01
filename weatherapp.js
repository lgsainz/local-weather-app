// API Key OpenWeatherMap
var key = "cca1fd1d8d8082e6a37c51fe2523d92e";

var lat, long;
var unit = "C";
var temp;

$(document).ready(function() {

  // Get geolocation
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    getWeather();
    console.log("geolocation worked");
  }, function(error) {
      //alternative for chrome - as no longer supports geolocation over http
      $.getJSON('http://ipinfo.io', function(data) {
        lat = data.loc.split(',')[0];
        long = data.loc.split(',')[1];
        getWeather();
      });
  });
}
});  

// Get weather information from OpenWeatherMap and populate corresponding elements
function getWeather() {
  
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=metric" + "&appid=" + key, function(json)   {
    $("#location").text(json.name + ", " + json.sys.country);
    
    // Get temp and store variable 
    temp = Math.round(json.main.temp);
    
    $("#temp").html(temp + "°<a href=\"#\" id=\"unit\">" + unit + "</a>");
    
  $("#humidity").html(json.main.humidity + "% Humidity");
    $("#weather").html(json.weather[0].main);
    
    $("#icon").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
  });
}

// Switch from Fahrenheit to Celsius and viceversa
  $("#temp").on("click", function() {
    if (unit == "C") {
      changeToF();
    } 
    else {
      changeToC();
    } 
    $("#temp").html(temp + "°<a href=\"#\" id=\"unit\">" + unit + "</a>");
  });

// Temp to Fahrenheit
function changeToF() {
  temp = Math.round(temp * 1.8 + 32);
  unit = "F";
}

// Temp to Celsius
function changeToC() {
  temp = Math.round((temp - 32) / 1.8);
  unit = "C";
}
