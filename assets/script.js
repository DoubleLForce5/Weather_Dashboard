const key = '4aa119594e25e5bca728bb1f01a15803';
const inputEl = document.querySelector(".input-box");
const citySearchBtn = document.querySelector(".search-button");
const searchContainer = document.querySelector(".search-container");
const currentWeatherEl = document.querySelector(".current-weather");
const fiveDayForecastEl = document.querySelector(".five-day");
const invalidSearchMessageEl = document.querySelector(
  ".invalid-search-message"
);
const fiveDayLabel = document.getElementById("five-day-weather-label");

const previouslySearchedEl = document.querySelector(".previously-searched");
let storedCity = [];

function onLoad() {
  if (localStorage.getItem("cityName")) {
    storedCity = JSON.parse(localStorage.getItem("cityName"));
  }
  displayCity();
  getLatLon('dallas')
}

async function getLatLon(citySearchInput) {
  const citySearchedCoordinates = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&appid=${key}`
  );

  if (!citySearchedCoordinates.ok) {
    invalidSearchMessageEl.textContent = "Please try another city.";
  }
  // localStorage.setItem('cityName', citySearchInput)
  const coordinates = await citySearchedCoordinates.json();
  getWeatherData(
    coordinates.coord.lat,
    coordinates.coord.lon,
    coordinates.name
  );
  addCity(citySearchInput);
}

function displayCity() {
  previouslySearchedEl.textContent = "";

  storedCity.forEach((city) => {
    let displayCityBtn = document.createElement("button");
    displayCityBtn.setAttribute("class", "display-city-button");
    displayCityBtn.textContent = city;
    previouslySearchedEl.appendChild(displayCityBtn);
    displayCityBtn.addEventListener("click", (event) => {
      fiveDayForecastEl.textContent = ''
      getLatLon(city)

    });
  });
}

function addCity(citySearchInput) {
  if (!storedCity.includes(citySearchInput)) {
    while (storedCity.length > 5) {
      storedCity.pop();
    }

    storedCity.unshift(citySearchInput);
    localStorage.setItem("cityName", JSON.stringify(storedCity));
  }
  displayCity();
}

async function getWeatherData(lat, lon, name) {
  // one call API
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${key}`
  );

  const weather = await weatherData.json();

  // current weather
  const date = new Date(weather.current.dt * 1000).toLocaleDateString("en-US");
  const currentWeatherIcon = `https://www.openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;
  const currentUvIndex = 10;

  currentWeatherEl.innerHTML = `
    <p id="current-weather-label">Current Weather:</p>
    <div class="current-weather-header">${name} (${date})<img src="${currentWeatherIcon}" alt="weather-icon"/></div>
    <p class="current-temp">Temperature: ${weather.current.temp}°<p>
    <p class="current-humidity">Humidity: ${weather.current.humidity}%<p>
    <p class="current-wind-speed">Wind Speed: ${weather.current.wind_speed} mph<p>
    <p class="current-uv">UV Index: ${currentUvIndex}<p>`;

  if (currentUvIndex < 3) {
    document.querySelector(".current-uv").style.color = "#3ea832";
  } else if (currentUvIndex < 6) {
    document.querySelector(".current-uv").style.color = "#ffa500";
  } else if (currentUvIndex < 8) {
    document.querySelector(".current-uv").style.color = "#a83232";
  } else if (currentUvIndex < 11) {
    document.querySelector(".current-uv").style.color = "#a83265";
  } else {
    document.querySelector(".current-uv").style.color = "#3299a8";
  }

  fiveDayLabel.textContent = "Five Day Forecast:"

  for (let i = 1; i <= 5; i++) {
    let dailyWeatherCard = document.createElement("div");
    dailyWeatherCard.setAttribute("class", "daily-weather-card");
    fiveDayForecastEl.appendChild(dailyWeatherCard);


    let fiveDayDate = new Date(weather.daily[i].dt * 1000).toLocaleDateString(
      "en-US"
    );

    let fiveDayIcons = `https://www.openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`;

    dailyWeatherCard.innerHTML = ` 
    <p>${fiveDayDate}</p>
    <img src="${fiveDayIcons}" alt="weather-icon"/> 
    <p>Max Temperature: ${weather.daily[i].temp.max}°</p>
    <p>Humidity: ${weather.daily[i].humidity}%</p>`;
  }

}

citySearchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  let citySearchInput = inputEl.value.trim().toLowerCase();

  if (citySearchInput === "") {
    invalidSearchMessageEl.textContent = "Please enter a city!";
  } else {
    invalidSearchMessageEl.textContent = "";
    currentWeatherEl.textContent = "";
    fiveDayForecastEl.textContent = "";
    getLatLon(citySearchInput);
  }
});

onLoad();