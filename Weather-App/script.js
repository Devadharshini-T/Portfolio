const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

// Fetch weather data
async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "";

    try {
        // Get latitude and longitude for the city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to fetch city information.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try again.");
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;

        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // Display weather information
        cityName.textContent =
            `${location.name}, ${location.country || ""}`;

        temperature.textContent =
            `${weatherData.current.temperature_2m} °C`;

        humidity.textContent =
            `${weatherData.current.relative_humidity_2m} %`;

        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} km/h`;

    } catch (error) {
        errorMessage.textContent = error.message;

        cityName.textContent = "";
        temperature.textContent = "-- °C";
        humidity.textContent = "-- %";
        windSpeed.textContent = "-- km/h";
    }
}

// Search button
searchBtn.addEventListener("click", getWeather);

// Search using Enter key
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});