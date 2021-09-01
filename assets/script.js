const key = config.API_KEY;
const inputEl = document.querySelector(".input-box");
const citySearchBtn = document.querySelector(".search-button");
const searchHistory = document.createElement("li");
searchHistory.setAttribute("class", "search-history");
const invalidSearchMessage = document.createElement("p");
invalidSearchMessage.setAttribute("class", "search-message");
const searchContainer = document.querySelector(".search-container");
const currentWeatherEl = document.querySelector('.current-weather');
const fiveDayForecastEl = document.querySelector('.five-day');

async function getLatLon(event) {
  event.preventDefault();

  const citySearchInput = inputEl.value.trim();

  if (citySearchInput === "") {
    searchContainer.appendChild(invalidSearchMessage);
    invalidSearchMessage.textContent = "Please enter a city";
  } else {
    invalidSearchMessage.textContent = "";

    const citySearchedCoordinates = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${citySearchInput}&appid=${key}`
    );

    const coordinates = await citySearchedCoordinates.json();

    getWeatherData(coordinates.coord.lat, coordinates.coord.lon, coordinates.name);
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
  const date = new Date (weather.current.dt * 1000).toLocaleDateString('en-US')
  const currentWeatherIcon = `https://www.openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`
  const currentUvIndex = 10

  console.log(currentWeatherIcon)
    currentWeatherEl.innerHTML = `
    <div class="current-weather-header">${name} (${date})<img src="${currentWeatherIcon}" alt="weather-icon"/></div>
    <p class="current-temp">${weather.current.temp}<p>
    <p class="current-humidity">${weather.current.humidity}<p>
    <p class="current-wind-speed">${weather.current.wind_speed}<p>
    <p class="current-uv">${currentUvIndex}<p>`

    if(currentUvIndex < 3){
    document.querySelector('.current-uv').style.color = '#3ea832'
  } else if(currentUvIndex < 6) {
    document.querySelector('.current-uv').style.color = '#ffa500'
  } else if(currentUvIndex < 8){
    document.querySelector('.current-uv').style.color = '#a83232'
  } else if(currentUvIndex < 11){
    document.querySelector('.current-uv').style.color = '#a83265'
  } else {
    document.querySelector('.current-uv').style.color = '#3299a8'
  }

  for(let i = 1; i <= 5; i++){
    let dailyWeatherCard = document.createElement('div')
    dailyWeatherCard.setAttribute('class', 'daily-weather-card')
    fiveDayForecastEl.appendChild(dailyWeatherCard)

    let fiveDayDate = new Date (weather.daily[i].dt * 1000).toLocaleDateString('en-US')

    let fiveDayIcons = `https://www.openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}.png`

    dailyWeatherCard.innerHTML = ` 
    <p>${fiveDayDate}</p>
    <img src="${fiveDayIcons}" alt="weather-icon"/> 
    <p>${weather.daily[i].temp.max}</p>
    <p>${weather.daily[i].humidity}</p>`
  }

}

citySearchBtn.addEventListener("click", getLatLon);