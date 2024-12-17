const iconElement = document.querySelector(".weather-icon")
const locationIcon = document.querySelector(".location-icon")
const tempElement = document.querySelector(".temperature-value p")
const descElement = document.querySelector(".temperature-description p")
const locationElement = document.querySelector(".location p")
const notificationElement = document.querySelector(".notification")

var input = document.getElementById("search")
let city = ""
let latitude = 0.0
let longitude = 0.0

input.addEventListener ("keyup", function(event) 
{
    if (event.keyCode === 13)
    {
        event.preventDefault();

        city = input.value;
        getSearchWeather(city);
        console.log(city);
    }
})

const weather = {}

weather.temperature = {
    unit: "fahrenheit"
}

const KELVIN = 273

const key = '0144a3121cbc6a9894c4dd263f6d1b40'

if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition,showError)
}
else {
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = '<p> Browser does not support geolocation </p>'
}

function setPosition(position) {
    latitude = position.coords.latitude
    longitude = position.coords.longitude

    getWeather(latitude, longitude)
}

locationIcon.addEventListener("click", function(event) {
    console.log('hey')
    getWeather(longitude, latitude)
})

function showError(error) {
    notificationElement.style.display="block"
    notificationElement.innerHTML=`<p> ${error.message} </p`
}

function getSearchWeather(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`

    fetch(api)
    .then(function(response) {
        let data = response.json()
        return data
    })
    .then(function(data) {
        weather.temperature.value = Math.floor((data.main.temp - KELVIN) * 9/5 + 32)
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.country = data.sys.country
    })
    .then(function() {
        displayWeather()
    })
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`

    fetch(api)
    .then(function(response) {
        let data = response.json()
        return data
    })
    .then(function(data) {
        weather.temperature.value = Math.floor((data.main.temp - KELVIN) * 9/5 + 32)
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.country = data.sys.country
    })
    .then(function() {
        displayWeather()
    })
}

function displayWeather() {
    const iconImg = iconElement.querySelector("img");
    const newIconSrc = `icons/${weather.iconId}.png`;

    // Preload image to check if it exists
    const img = new Image();
    img.onload = function() {
        iconImg.src = newIconSrc;  // Update only if image exists
    };
    img.onerror = function() {
        iconImg.src = "icons/thermometer.png";  // Fallback to thermometer icon if broken
    };
    img.src = newIconSrc;
    
    tempElement.innerHTML = `${weather.temperature.value} °<span>F</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// function displayWeather() {
 //   iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`
 //   tempElement.innerHTML = `${weather.temperature.value} * <span>C</span>`
 //   descElement.innerHTML = weather.description
 //   locationElement.innerHTML = `${weather.city}, ${weather.country}`
// }