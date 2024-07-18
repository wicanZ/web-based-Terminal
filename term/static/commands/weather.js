export default {
    execute: async function(args, terminal) {
        try {
            // Get the user's location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude: lat, longitude: lon } = position.coords;

            terminal.printLine("Getting weather data for your location...");

            // Fetch weather data from the OpenWeatherMap API
            const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

            if (!response.ok) {
                throw new Error("Failed to fetch weather data.");
            }

            const data = await response.json();
            const { name: location, main: { temp: temperature }, weather } = data;
            const weatherDescription = weather[0].description;
            const weatherIcon = weather[0].icon;

            const weatherIcons = {
                "01d": "☀️",
                "01n": "🌙",
                "02d": "⛅",
                "02n": "⛅",
                "03d": "☁️",
                "03n": "☁️",
                "04d": "☁️",
                "04n": "☁️",
                "09d": "🌧️",
                "09n": "🌧️",
                "10d": "🌦️",
                "10n": "🌦️",
                "11d": "⛈️",
                "11n": "⛈️",
                "13d": "❄️",
                "13n": "❄️",
                "50d": "🌫️",
                "50n": "🌫️",
            };

            terminal.printLine(
                `Current weather in ${location}: ${temperature}°C, ${weatherDescription} ${weatherIcons[weatherIcon] || ''}`
            );
        } catch (error) {
            terminal.printError("Failed to get weather data.");
        }
    },
    description: "Get the current weather",
    author: "Colin Chadwick"
};
