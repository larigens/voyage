// Variable Declaration
var apiKey = "9fd233d4d2c7d49f6032a609a54efc62";
var city = document.getElementById('city')
var myChart = document.getElementById('myChart');
var fetchBtn = document.getElementById('fetch-button');

// Added event listener to get information about the city on click.
fetchBtn.addEventListener('click', getWeather);

function getWeather() { // q: The query parameter - appid: The application id or key

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city.value + "&units=imperial&appid=" + apiKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            displayWeather(data);
        })
}

function displayWeather(data) {
    var card = document.getElementById("day-1");
    card.style.display = "block";

    var weather = data.weather[0];
    var today = moment().format('L');

    var cityName = document.getElementById("city-name");
    cityName.innerHTML = `${data.name} ${today}`;

    var icon = weather.icon;
    var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";

    var weatherIcon = document.getElementById("weather-icon");
    weatherIcon.setAttribute("src", iconURL);
    weatherIcon.setAttribute("alt", "weather icon");

    var description = document.getElementById("description");
    description.innerHTML = `${weather.main}`;


    var temperature = document.getElementById("temperature");
    temperature.innerHTML = `${data.main.temp} °F`;
    var feelsLike = document.getElementById("feels-like");
    feelsLike.innerHTML = `${data.main.feels_like} °F`;
    var humidity = document.getElementById("humidity");
    humidity.innerHTML = `${data.main.humidity}\%`;
    var windSpeed = document.getElementById("wind-speed");
    windSpeed.innerHTML = `${data.wind.speed} MPH`;
}

// getForecast();

// function getForecast() {

//     var queryURLFuture = "https://bulk.openweathermap.org/archive/hourly_16.json.gz?appid=" + apiKey;

//     fetch(queryURLFuture)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (data) {
//             displayForecast(data);
//         })

// }

// function displayForecast(data) {

// }