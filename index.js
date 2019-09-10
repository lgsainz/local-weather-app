// openweathermap API key
var key = "6ef21b382b6be3b97ef367343ad9a1dc";
// set up variables for API callback
var searchText = document.getElementById("search-box");
var searchButton = document.getElementById("search-btn");
var cityName = document.getElementById("city-name");
var response = "";
var url = "";
// set up arrays for data retrieved from API
var dateArray = [];
var imageArray = [];
var tempArray = [];

$(document).ready(function() {

    // gets user input (city/zip) and calls OpenWeather API for forecast
    function getWeather(){
        if (searchText.value === "") {
            alert("You must enter a city name or zip code!");
        }
        // check if user inputs a city name
        else if (searchText.value.match(/^[A-Za-z]+$/)) {
            url = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchText.value + "&units=imperial&appid="+ key;
        }
        // check if user inputs a zip code
        else if (searchText.value.match(/^[0-9]+$/) && searchText.value.length == 5) {
            url = "https://api.openweathermap.org/data/2.5/forecast?zip=" + searchText.value + "&units=imperial&appid=" + key;
        }
        else {
            var city = searchText.value.split(' ').join('+');
            url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid="+ key;
        }

        //  parse JSON from OpenWeather API
        $.getJSON(url, function(response){

            reset(); // reset arrays for new search
            cityName.innerHTML = response.city.name; // set city name

            // get 5 day forecast arrays
            for (var i=0; i < response.list.length; i++){
                if (i==0 || i== 8 || i==16 || i==24 || i==32) {
                    dateArray.push(new Date(response.list[i].dt * 1000).toDateString()); // convert utc timestamp to date format
                    imageArray.push("http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    tempArray.push(Math.round(response.list[i].main.temp));
                }
            }

            // place dates in forecast table - row 1
            var dates = $("#date").children();
            $.each(dateArray, function(index, value){
                dates[index].innerHTML = value;
            });

            // place weather icons in row 2
            var icons = $("#icons").children();
            $.each(imageArray, function(index, value){
                icons[index].innerHTML = "<img src='" + value + "'>";
            });

            // place temp in row 3
            var temps = $("#temp").children();
            $.each(tempArray, function(index, value){
                temps[index].innerHTML = value + "°F";
            });

            changeBackground(); // change background color according to current temp
        });
    }

    // user input - click or enter
    searchButton.addEventListener("click", getWeather);
    searchText.addEventListener("keyup", function(e){
        if (e.which == 13){
            getWeather();
        }
    });

    // change background color based on temp for current day
    function changeBackground() {
        var currentTemp = tempArray[0];
        if (currentTemp > 80) {
            color = '#ff4d4d'; //hot
        }
        else if (currentTemp > 60) {
            color = '#ffb833'; // warm
        }
        else if (currentTemp > 45) {
            color = '#66ccff'; // cold
        }
        else {
            color = '#cccccc'; // doom and gloom
        }
        document.body.style.backgroundColor = color;
    }

    // reset arrays for new search
    function reset() {
        dateArray = [];
        imageArray = [];
        tempArray = [];
    }

});
