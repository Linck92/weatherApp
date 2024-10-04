const apiKey = '96c53f9f9a212a71aa04c7b63ca203f1'; //open weather map
const city = document.querySelector('#city');

city.addEventListener('change', checkWeather);
city.addEventListener('change', checkWeatherForecast);

navigator.geolocation.getCurrentPosition(function (position) {
    getCurrentPossitionWeather(position)
});


async function getCurrentPossitionWeather(position) {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric&lang=ru`
  const response = await fetch(url); // РЕЗУЛЬТАТА от fetch(url) - это ответ от сервера или ошибка (промис)
  const data = await response.json();
  console.log(data);
  setCurrentWetaher(data);

  const urlTwo =  `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&cnt=10&appid=${apiKey}&units=metric&lang=ru`
  const responseTwo = await fetch(urlTwo) // РЕЗУЛЬТАТА от fetch(url) - это ответ от сервера или ошибка (промис)
  const dataTwo = await responseTwo.json();
  console.log(dataTwo);
  document.querySelector('.weather__forecast').innerHTML = '';
  setForecast(dataTwo);
}  


async function checkWeather () {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=metric&lang=ru`
    const response = await fetch(url); // РЕЗУЛЬТАТА от fetch(url) - это ответ от сервера или ошибка (промис)
    const data = await response.json();
    setCurrentWetaher(data);
}


async function checkWeatherForecast () {
    const url =  `https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&cnt=10&appid=${apiKey}&units=metric&lang=ru`
    const response = await fetch(url) // РЕЗУЛЬТАТА от fetch(url) - это ответ от сервера или ошибка (промис)
    const data = await response.json();
    document.querySelector('.weather__forecast').innerHTML = '';
    setForecast(data);
}

function setCurrentWetaher(data) {
  const dateShift = new Date().getTimezoneOffset();
  const sunriseTime = new Date(data.sys.sunrise * 1000 + dateShift * 60000 + data.timezone * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000 + dateShift * 60000 + data.timezone * 1000);
  const weatherConditionIcon = data.weather[0].icon;
  document.querySelector('.weather__current-location').textContent = data.name;
  document.querySelector('.weather__current-temperature').innerHTML = `${Math.round(data.main.temp)} &deg;`;
  document.querySelectorAll('.weather__current-field')[2].innerHTML = `<img width="60" height="60"src="icons/weatherConditions/${weatherConditionIcon}.svg" alt="">`;
  document.querySelector('.weather__current-wind-speed').textContent = data.wind.speed + ' m/s';
  document.querySelector('.weather__current-humidity').textContent = data.main.humidity + ' %';
  document.querySelector('.weather__current-sunrise').textContent = `${zeros(sunriseTime.getHours())}:${zeros(sunriseTime.getMinutes())}`;
  document.querySelector('.weather__current-sunset').textContent = `${zeros(sunsetTime.getHours())}:${zeros(sunsetTime.getMinutes())}`;
  document.querySelector('.weather__current-pressure').textContent = Math.round(data.main.pressure * 0.75) + ' mm';
  document.querySelector('.weather__current-clouds').textContent = data.clouds.all + ' %';
}

function setForecast(data) {
  data.list.forEach(element => {
    const dateShift = new Date().getTimezoneOffset();
    const weatherConditionIcon = element.weather[0].icon;
    if (data.list.indexOf(element) === 0) return;
    const forecastStep = new Date(element.dt_txt).getTime();
    const date = new Date(forecastStep + dateShift * 60000 + data.city.timezone * 1000);
    console.log(date);
    document.querySelector('.weather__forecast').insertAdjacentHTML('beforeend', 
     `
     <div class="weather__forecast-step">
        <p class="weather__forecast-time">${zeros(date.getHours())}</p>
        <img width="30" height="30"src="icons/weatherConditions/${weatherConditionIcon}.svg" alt="">
        <p class="weather__forecast-temperature">${Math.round(element.main.temp)} &deg;</p>
     </div>`)
 });
}

function zeros(i) {
    if (i < 10) {
      return "0" + i;
    } else {
      return i;
    }
}
// Так можно подтянуть иконку погодных условий
  // document.querySelectorAll('.weather__current-field')[2].innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png"></img>`;

