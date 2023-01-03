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
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

$(function () {
    // It will render the local storage as soon as the page DOM is ready for JavaScript code to execute.
    renderSearchHistory();
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
    if (searchHistory !== null) {
        $.each(searchHistory, function (i) {
            var searchedCityEl = $('<button>');
            searchedCityEl.addClass('button btnCity btn btn-primary ms-3 mb-4');
            // Added the city name as the id so that onclick it will capture the id of the button that was clicked and use it as the city input.
            searchedCityEl.attr('id', searchHistory[i]);
            searchedCityEl.attr('type', 'button');
            searchedCityEl.text(searchHistory[i]);

            searchEl.append(searchedCityEl);
        })
    }
    else if (searchHistory.length > 0) {
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
        weatherCard.addClass("card");

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

        var descriptionEl = $("<h4>");
        descriptionEl.attr('id', 'description-' + `${day}`);
        descriptionEl.addClass("card-subtitle mb-3 pb-3 description border-bottom border-2");

        var pTagTemp = $("<p>");
        pTagTemp.addClass("card-text");
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
    // Day 2
    var weatherDay2 = futureData.list[6].weather[0];
    var mainInfoDay2 = futureData.list[6].main;
    var windDay2 = futureData.list[6].wind;
    var currDate2 = dayjs(futureData.list[6].dt_txt).format('MM/DD/YYYY');

    var date2 = $('#date-2');
    date2.html(currDate2);

    var icon2 = weatherDay2.icon;
    var iconURL2 = "https://openweathermap.org/img/w/" + icon2 + ".png";
    var weatherIcon2 = $('#weather-icon-2');
    weatherIcon2.attr("src", iconURL2);

    var description2 = $("#description-2");
    description2.html(weatherDay2.main);

    var temperature2 = $("#temperature-2");
    temperature2.text(mainInfoDay2.temp + " " + unitTemp);

    var feelsLike2 = $("#feels-like-2");
    feelsLike2.text(mainInfoDay2.feels_like + " " + unitTemp);

    var humidity2 = $("#humidity-2");
    humidity2.text(mainInfoDay2.humidity + "\%");

    var windSpeed2 = $("#wind-speed-2");
    windSpeed2.text(windDay2.speed + " " + unitSpeed);

    // Day 3
    var weatherDay3 = futureData.list[14].weather[0];
    var mainInfoDay3 = futureData.list[14].main;
    var windDay3 = futureData.list[14].wind;
    var currDate3 = dayjs(futureData.list[14].dt_txt).format('MM/DD/YYYY');

    var date3 = $('#date-3');
    date3.html(currDate3);

    var icon3 = weatherDay3.icon;
    var iconURL3 = "https://openweathermap.org/img/w/" + icon3 + ".png";
    var weatherIcon3 = $('#weather-icon-3');
    weatherIcon3.attr("src", iconURL3);

    var description3 = $("#description-3");
    description3.html(weatherDay3.main);

    var temperature3 = $("#temperature-3");
    temperature3.text(mainInfoDay3.temp + " " + unitTemp);

    var feelsLike3 = $("#feels-like-3");
    feelsLike3.text(mainInfoDay3.feels_like + " " + unitTemp);

    var humidity3 = $("#humidity-3");
    humidity3.text(mainInfoDay3.humidity + "\%");

    var windSpeed3 = $("#wind-speed-3");
    windSpeed3.text(windDay3.speed + " " + unitSpeed);

    // Day 4
    var weatherDay4 = futureData.list[22].weather[0];
    var mainInfoDay4 = futureData.list[22].main;
    var windDay4 = futureData.list[22].wind;
    var currDate4 = dayjs(futureData.list[22].dt_txt).format('MM/DD/YYYY');

    var date4 = $('#date-4');
    date4.html(currDate4);

    var icon4 = weatherDay4.icon;
    var iconURL4 = "https://openweathermap.org/img/w/" + icon4 + ".png";
    var weatherIcon4 = $('#weather-icon-4');
    weatherIcon4.attr("src", iconURL4);

    var description4 = $("#description-4");
    description4.html(weatherDay4.main);

    var temperature4 = $("#temperature-4");
    temperature4.text(mainInfoDay4.temp + " " + unitTemp);

    var feelsLike4 = $("#feels-like-4");
    feelsLike4.text(mainInfoDay4.feels_like + " " + unitTemp);

    var humidity4 = $("#humidity-4");
    humidity4.text(mainInfoDay4.humidity + "\%");

    var windSpeed4 = $("#wind-speed-4");
    windSpeed4.text(windDay4.speed + " " + unitSpeed);

    // Day 5
    var weatherDay5 = futureData.list[30].weather[0];
    var mainInfoDay5 = futureData.list[30].main;
    var windDay5 = futureData.list[30].wind;
    var currDate5 = dayjs(futureData.list[30].dt_txt).format('MM/DD/YYYY');

    var date5 = $('#date-5');
    date5.html(currDate5);

    var icon5 = weatherDay5.icon;
    var iconURL5 = "https://openweathermap.org/img/w/" + icon5 + ".png";
    var weatherIcon5 = $('#weather-icon-5');
    weatherIcon5.attr("src", iconURL5);

    var description5 = $("#description-5");
    description5.html(weatherDay5.main);

    var temperature5 = $("#temperature-5");
    temperature5.text(mainInfoDay5.temp + " " + unitTemp);

    var feelsLike5 = $("#feels-like-5");
    feelsLike5.text(mainInfoDay5.feels_like + " " + unitTemp);

    var humidity5 = $("#humidity-5");
    humidity5.text(mainInfoDay5.humidity + "\%");

    var windSpeed5 = $("#wind-speed-5");
    windSpeed5.text(windDay5.speed + " " + unitSpeed);

    // Day 6
    var weatherDay6 = futureData.list[38].weather[0];
    var mainInfoDay6 = futureData.list[38].main;
    var windDay6 = futureData.list[38].wind;
    var currDate6 = dayjs(futureData.list[38].dt_txt).format('MM/DD/YYYY');

    var date6 = $('#date-6');
    date6.html(currDate6);

    var icon6 = weatherDay6.icon;
    var iconURL6 = "https://openweathermap.org/img/w/" + icon6 + ".png";
    var weatherIcon6 = $('#weather-icon-6');
    weatherIcon6.attr("src", iconURL6);

    var description6 = $("#description-6");
    description6.html(weatherDay6.main);

    var temperature6 = $("#temperature-6");
    temperature6.text(mainInfoDay6.temp + " " + unitTemp);

    var feelsLike6 = $("#feels-like-6");
    feelsLike6.text(mainInfoDay6.feels_like + " " + unitTemp);

    var humidity6 = $("#humidity-6");
    humidity6.text(mainInfoDay6.humidity + "\%");

    var windSpeed6 = $("#wind-speed-6");
    windSpeed6.text(windDay6.speed + " " + unitSpeed);
}