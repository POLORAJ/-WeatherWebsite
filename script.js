async function getWeather() {

    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    document.getElementById("loading").innerText =
        "Loading weather...";

    try {

        // Get latitude and longitude of city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display city
        document.getElementById("city").innerText =
            `${location.name}, ${location.country}`;

        // Display temperature
        document.getElementById("temperature").innerText =
            `${current.temperature_2m} °C`;

        // Display humidity
        document.getElementById("humidity").innerText =
            `${current.relative_humidity_2m}%`;

        // Display wind speed
        document.getElementById("wind").innerText =
            `${current.wind_speed_10m} km/h`;

        // Weather condition
        const weather = getWeatherCondition(current.weather_code);

        document.getElementById("condition").innerText =
            weather.text;

        document.getElementById("weatherIcon").innerText =
            weather.icon;

        document.getElementById("loading").innerText = "";

    } catch (error) {

        console.error(error);

        document.getElementById("loading").innerText =
            "Unable to get weather data.";

    }
}


// Convert weather code into text and icon
function getWeatherCondition(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code >= 1 && code <= 3) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            text: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌡️"
    };
}