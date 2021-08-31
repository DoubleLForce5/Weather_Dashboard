const key = config.API_KEY;
const inputEl = document.querySelector(".input-box");
const citySearchBtn = document.querySelector(".search-button");
const searchHistory = document.createElement('li')
searchHistory.setAttribute('class', 'search-histyr')

async function getLatLon(event) {
  event.preventDefault();

  const citySearchInput = inputEl.value.trim();

  const citySearchedCoordinates = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&appid=${key}`
  );

  const coordinates = await citySearchedCoordinates.json();

  getWeatherData(coordinates.coord.lat, coordinates.coord.lon);
}

async function getWeatherData(lat, lon) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${key}`
  );

  const weather = await weatherData.json();

  console.log(weather);
}

citySearchBtn.addEventListener("click", getLatLon);
