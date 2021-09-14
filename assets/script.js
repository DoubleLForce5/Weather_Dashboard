const key = config.API_KEY;
const inputEl = document.querySelector(".input-box");
const citySearchBtn = document.querySelector(".search-button");
const searchContainer = document.querySelector(".search-container");
const currentWeatherEl = document.querySelector(".current-weather");
const fiveDayForecastEl = document.querySelector(".five-day");
const invalidSearchMessageEl = document.querySelector(
  ".invalid-search-message"
);
const previouslySearchedEl = document.querySelector(".previously-searched");
let storedCity = [];

function searchHistory() {
  previouslySearchedEl.textContent = "";

  for (let i = 0; i < storedCity.length; i++) {
    const citySearched = document.createElement("button");
    citySearched.setAttribute("class", "city-searched");

    citySearched.textContent = storedCity[i];

    previouslySearchedEl.appendChild(citySearched);
  }

  let previouslySearchedBtn = document.querySelectorAll(".city-searched");
  previouslySearchedBtn.forEach((previouslySearchedBtn) => {
    previouslySearchedBtn.addEventListener("click", function (event) {
      currentWeatherEl.textContent = "";
      fiveDayForecastEl.textContent = "";
      getLatLon(event.target.textContent);
    });
  });
}

function DisplayCity() {
  let citiesSearched = JSON.parse(localStorage.getItem("cityName"));

  citiesSearched.forEach((city) => {
    let cities = document.createElement("button");
    cities.setAttribute("class", "search-history");
    cities.textContent = city;
    previouslySearchedEl.appendChild(cities);
  });
}

async function getLatLon(citySearchInput) {
  const citySearchedCoordinates = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&appid=${key}`
  );

  if (citySearchedCoordinates.ok) {
    if (storedCity.includes(citySearchInput)) {
      const coordinates = await citySearchedCoordinates.json();
      getWeatherData(
        coordinates.coord.lat,
        coordinates.coord.lon,
        coordinates.name
      );
    } else {
      if (localStorage.getItem("cityName") === null) {
        localStorage.setItem("cityName", "[]");
      }

      storedCity = JSON.parse(localStorage.getItem("cityName"));
      storedCity.push(citySearchInput);

      if (storedCity.length > 5) {
        storedCity.shift();
      }

      localStorage.setItem("cityName", JSON.stringify(storedCity));

      searchHistory();

      const coordinates = await citySearchedCoordinates.json();
      getWeatherData(
        coordinates.coord.lat,
        coordinates.coord.lon,
        coordinates.name
      );
    }
  } else {
    invalidSearchMessageEl.textContent =
      "There are no search results matching your criteria.";
  }
}

async function getWeatherData(lat, lon, name) {
  // one call API
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${key}`
  );

  const weather = await weatherData.json();

  console.log(weather);

  // current weather
  const date = new Date(weather.current.dt * 1000).toLocaleDateString("en-US");
  const currentWeatherIcon = `https://www.openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;
  const currentUvIndex = 10;

  console.log(currentWeatherIcon);
  currentWeatherEl.innerHTML = `
    <div class="current-weather-header">${name} (${date})<img src="${currentWeatherIcon}" alt="weather-icon"/></div>
    <p class="current-temp">${weather.current.temp}<p>
    <p class="current-humidity">${weather.current.humidity}<p>
    <p class="current-wind-speed">${weather.current.wind_speed}<p>
    <p class="current-uv">${currentUvIndex}<p>`;

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
    <p>${weather.daily[i].temp.max}</p>
    <p>${weather.daily[i].humidity}</p>`;
  }
}

citySearchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const citySearchInput = inputEl.value.trim().toLowerCase();

  if (citySearchInput === "") {
    invalidSearchMessageEl.textContent = "Please enter a city!";
  } else {
    invalidSearchMessageEl.textContent = "";
    currentWeatherEl.textContent = "";
    fiveDayForecastEl.textContent = "";
    getLatLon(citySearchInput);
    DisplayCity(citySearchInput)
  }
});
