//  Constants Declaration
const apiKey = "1621a5fb00df3e233c5aa1c741011fd3";
const dashboard = $("#dashboard");
const fetchBtn = $("#fetchBtn");
const searchEl = $("#search-history");

//  Variables Declaration
var unitTypeEl = $('#unit-type');
var city = $('#city');
var today = dayjs().format('MM/DD/YYYY');
var unitSpeed = 'Mph';
var unitTemp = '°F';
var unitType = 'Imperial';
// If there is no saved city, then renders an empty array.
var searchHistory = [];

$(function () {
    // It will render the local storage as soon as the page DOM is ready for JavaScript code to execute.
    if (searchHistory !== null) {
        renderSearchHistory();
    }

    // Switch on, switchs unit.
    $("#units").click(function () {
        if (this.checked === true) {
            unitTemp = '°C';
            unitSpeed = 'Km/h';
            unitType = 'Metric';
            unitTypeEl.text(unitType);
            // If the user toggles the button first, city will be an object and it won't fetch.
            if (typeof city !== "object") {
                getCurrWeather();
            }
        }
        else {
            unitTemp = '°F';
            unitSpeed = 'Mph';
            unitType = 'Imperial';
            unitTypeEl.text(unitType);
            if (typeof city !== "object") {
                getCurrWeather();
            }
        }
    })
    // Added the event listener to the entire div to be able to get the id of the target that will be the new city's value.
    $("#search-history").click(function (event) {
        var target = $(event.target)
        if (target.is("button")) {
            city = target.attr("id"); // city will be the button's id.
            getCurrWeather();
        }
    });
})

function renderSearchHistory() {
    // If the local storage is not empty, then it will create a button for each element of the array and attach to the sidebar.
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    for (i = 0; i < searchHistory.length; i++) {
        var searchedCityEl = $('<button>');
        searchedCityEl.addClass('button btnCity btn btn-primary ms-3 mb-4');
        // Added the city name as the id so that onclick it will capture the id of the button that was clicked and use it as the city input.
        searchedCityEl.attr('id', searchHistory[i]);
        searchedCityEl.attr('type', 'button');
        searchedCityEl.text(searchHistory[i]);

        searchEl.append(searchedCityEl);
    }

    if (searchHistory.length > 0) {
        // Only creates the delete button if the local storage has at least one element in it.
        var deleteHistory = $("<button>");
        deleteHistory.attr('type', 'button');
        deleteHistory.addClass('deleteBtn btn btn-primary mt-4 ms-2');
        deleteHistory.attr('onclick', 'localStorage.clear(); window.location.reload()'); // Function to delete local storage and refresh the page.
        deleteHistory.text("Delete Search History");

        searchEl.append(deleteHistory);
    }
}

function getCurrWeather() {
    fetchBtn.css("display", "none");
    // If the user toggles the button first - this function will only be executed after entering a city in the search bar.
    if (typeof city === 'undefined' || typeof city === "object") {
        city = $('#city').val(); // City will be the users input. If the user clicks the button in the search history, then this conditional statement will be ignored.
    }
    // q: The query parameter - appid: The application id or key
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unitType + "&appid=" + apiKey;
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                alert("City not found!");
            }
            else {
                return response.json()
                    .then(function (data) {
                        if (data !== null) {
                            console.log(data);
                            storeSearchHistory(city);
                            $('.card').remove(); // Deletes the old cards so it can create new ones with the new chosen unit type.
                            renderCurrWeather(data);
                        }
                    })
            }
        })
};

function storeSearchHistory() {
    if (typeof city === "object") {
        console.log(city);
        city = $('#city').val().trim(); // To store the city that was typed in the search bar without whitespace.
    }
    var searchCity = city;
    // Conditional statement to ensure that it will not store duplicates.
    if (!searchHistory.includes(searchCity)) {
        searchHistory.push(searchCity);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); //Setting local storage
    }
}

function renderCurrWeather(data) {
    // Creates all cards for each day (today's forecast + 5 days) and appends to dashboard.
    for (day = 1; day < 7; day++) {
        var weatherCard = $("<div>");
        weatherCard.attr('id', 'day-' + `${day}`);
        weatherCard.addClass("card pb-0");

        var cardBody = $("<div>");
        cardBody.addClass("card-body");

        var cityNameEl = $("<h3>");
        cityNameEl.attr('id', data.name);
        cityNameEl.addClass('card-title');
        cityNameEl.html(data.name);

        var spanTagDate = $("<span>");
        spanTagDate.attr('id', 'date-' + `${day}`);
        spanTagDate.addClass('date');
        cityNameEl.append(spanTagDate);

        var weatherIconEl = $("<img>");
        weatherIconEl.attr('id', 'weather-icon-' + `${day}`);
        weatherIconEl.attr('alt', 'weather icon');
        weatherIconEl.addClass("mt-0 pt-0");

        var descriptionEl = $("<h4>");
        descriptionEl.attr('id', 'description-' + `${day}`);
        descriptionEl.addClass("card-subtitle mb-2 pb-2 description border-bottom border-2");

        var pTagTemp = $("<p>");
        pTagTemp.addClass("card-text mt-2");
        pTagTemp.text('Temperature: ');
        var spanTagTemp = $("<span>");
        spanTagTemp.attr('id', 'temperature-' + `${day}`);
        pTagTemp.append(spanTagTemp);

        var pTagFeel = $("<p>");
        pTagFeel.addClass("card-text");
        pTagFeel.text('Feels Like: ');
        var spanTagFeel = $("<span>");
        spanTagFeel.attr('id', 'feels-like-' + `${day}`);
        pTagFeel.append(spanTagFeel);

        var pTagHumid = $("<p>");
        pTagHumid.addClass("card-text");
        pTagHumid.text('Humidity: ');
        var spanTagHumid = $("<span>");
        spanTagHumid.attr('id', 'humidity-' + `${day}`);
        pTagHumid.append(spanTagHumid)

        var pTagWind = $("<p>");
        pTagWind.addClass("card-text");
        pTagWind.text('Wind Speed: ');
        var spanTagWind = $("<span>");
        spanTagWind.attr('id', 'wind-speed-' + `${day}`);
        pTagWind.append(spanTagWind)


        cardBody.append(cityNameEl);
        cardBody.append(weatherIconEl);
        cardBody.append(descriptionEl);
        cardBody.append(pTagTemp);
        cardBody.append(pTagFeel);
        cardBody.append(pTagHumid);
        cardBody.append(pTagWind);

        weatherCard.append(cardBody);
        dashboard.append(weatherCard);
    }

    // Today
    var weatherDay1 = data.weather[0];
    var mainInfoDay1 = data.main;
    var windDay1 = data.wind;

    var date1 = $('#date-1');
    date1.html(today);

    var icon1 = weatherDay1.icon;
    var iconURL1 = "https://openweathermap.org/img/w/" + icon1 + ".png";
    var weatherIcon1 = $('#weather-icon-1');
    weatherIcon1.attr("src", iconURL1);

    var description1 = $("#description-1");
    description1.html(weatherDay1.main);

    var temperature1 = $("#temperature-1");
    temperature1.text(mainInfoDay1.temp + " " + unitTemp);

    var feelsLike1 = $("#feels-like-1");
    feelsLike1.text(mainInfoDay1.feels_like + " " + unitTemp);

    var humidity1 = $("#humidity-1");
    humidity1.text(mainInfoDay1.humidity + "\%");

    var windSpeed1 = $("#wind-speed-1");
    windSpeed1.text(windDay1.speed + " " + unitSpeed);

    getFutureForecast(data)
}

// 5-days Forecast
function getFutureForecast(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    var queryURLFuture = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=" + unitType + "&appid=" + apiKey;

    fetch(queryURLFuture)
        .then(function (response) {
            return response.json();
        })
        .then(function (futureData) {
            console.log(futureData);
            renderFutureForecast(futureData);
        })
};

function renderFutureForecast(futureData) {
    // Generates the data for the other cards.
    for (day = 2; day < 7; day++) {
        if (day === 2) {
            var weatherDay = futureData.list[6].weather[0];
            var mainInfoDay = futureData.list[6].main;
            var windDay = futureData.list[6].wind;
            var currDate = dayjs(futureData.list[6].dt_txt).format('MM/DD/YYYY');
        }
        else if (day === 3) {
            var weatherDay = futureData.list[14].weather[0];
            var mainInfoDay = futureData.list[14].main;
            var windDay = futureData.list[14].wind;
            var currDate = dayjs(futureData.list[14].dt_txt).format('MM/DD/YYYY');
        }
        else if (day === 4) {
            var weatherDay = futureData.list[22].weather[0];
            var mainInfoDay = futureData.list[22].main;
            var windDay = futureData.list[22].wind;
            var currDate = dayjs(futureData.list[22].dt_txt).format('MM/DD/YYYY');
        }
        else if (day === 5) {
            var weatherDay = futureData.list[30].weather[0];
            var mainInfoDay = futureData.list[30].main;
            var windDay = futureData.list[30].wind;
            var currDate = dayjs(futureData.list[30].dt_txt).format('MM/DD/YYYY');
        }
        else {
            var weatherDay = futureData.list[38].weather[0];
            var mainInfoDay = futureData.list[38].main;
            var windDay = futureData.list[38].wind;
            var currDate = dayjs(futureData.list[38].dt_txt).format('MM/DD/YYYY');
        }

        var dateEl = $('#date-' + day);
        dateEl.html(currDate);

        var iconEl = weatherDay.icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconEl + ".png";
        var weatherIcon = $('#weather-icon-' + day);
        weatherIcon.attr("src", iconURL);

        var description = $("#description-" + day);
        description.html(weatherDay.main);

        var temperature = $("#temperature-" + day);
        temperature.text(mainInfoDay.temp + " " + unitTemp);

        var feelsLike = $("#feels-like-" + day);
        feelsLike.text(mainInfoDay.feels_like + " " + unitTemp);

        var humidity = $("#humidity-" + day);
        humidity.text(mainInfoDay.humidity + "\%");

        var windSpeed = $("#wind-speed-" + day);
        windSpeed.text(windDay.speed + " " + unitSpeed);
    }
}