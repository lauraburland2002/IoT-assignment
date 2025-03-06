document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("temperatureSlider");
    const output = document.getElementById("temperatureValue");
    const submitButton = document.getElementById("submitVote");
    const message = document.getElementById("message");
    const outsideTemp = document.getElementById("outsideTemp");
    const weatherCondition = document.getElementById("weatherCondition");
    const weatherIcon = document.getElementById("weatherIcon");
    const pastVotesTable = document.getElementById("pastVotes");

    slider.oninput = function () {
        output.textContent = this.value + "°C";
    };

    submitButton.addEventListener("click", () => {
        const currentHour = new Date().getHours();
        if (currentHour !== 9 && currentHour !== 13) {
            message.textContent = "Voting is only allowed at 9 AM and 1 PM.";
            message.style.color = "red";
            return;
        }

        const selectedTemperature = slider.value;
        message.textContent = `Vote submitted: ${selectedTemperature}°C`;
        message.style.color = "green";

        saveVote(selectedTemperature);
        displayPastVotes();
    });

    document.getElementById("submitVote").addEventListener("click", function() {
        let temp = document.getElementById("temperatureSlider").value;
        
        fetch("http://your-pi-ip:5000/submit-vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ temperature: temp })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("message").innerText = data.message;
        });
    });
    

    function saveVote(temp) {
        const votes = JSON.parse(localStorage.getItem("votes")) || [];
        votes.push({ time: new Date().toLocaleString(), temp });
        localStorage.setItem("votes", JSON.stringify(votes));
    }

    function displayPastVotes() {
        const votes = JSON.parse(localStorage.getItem("votes")) || [];
        pastVotesTable.innerHTML = "";
        votes.slice(-5).forEach(vote => {  // Show last 5 votes
            const row = `<tr><td>${vote.time}</td><td>${vote.temp}°C</td></tr>`;
            pastVotesTable.innerHTML += row;
        });
    }

    // Fetch Weather Data from Open-Meteo
    function fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&timezone=auto`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = data.current.temperature_2m;
                const weatherCode = data.current.weathercode;
                outsideTemp.textContent = `${temp}°C`;
                weatherCondition.textContent = getWeatherDescription(weatherCode);
                weatherIcon.innerHTML = getWeatherIcon(weatherCode);
            })
            .catch(error => {
                console.error("Error fetching weather:", error);
                outsideTemp.textContent = "Unavailable";
                weatherCondition.textContent = "Unavailable";
                weatherIcon.innerHTML = "❓";
            });
    }

    // Convert Open-Meteo weather codes to descriptions
    function getWeatherDescription(code) {
        const weatherCodes = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Rime Fog", 51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Heavy Drizzle",
            61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain", 80: "Light Showers",
            81: "Moderate Showers", 82: "Heavy Showers", 95: "Thunderstorm", 96: "Thunderstorm with hail",
            99: "Severe Thunderstorm"
        };
        return weatherCodes[code] || "Unknown Weather";
    }

    // Map Weather Codes to Icons
    function getWeatherIcon(code) {
        const icons = {
            0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
            51: "🌦️", 53: "🌧️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "🌧️",
            80: "🌦️", 81: "🌦️", 82: "⛈️", 95: "⛈️", 96: "⛈️", 99: "🌩️"
        };
        return icons[code] || "❓";
    }

    // Get User Location
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                outsideTemp.textContent = "Location access denied";
                weatherCondition.textContent = "Unavailable";
                weatherIcon.innerHTML = "❓";
            }
        );
    } else {
        outsideTemp.textContent = "Geolocation not supported";
        weatherCondition.textContent = "Unavailable";
        weatherIcon.innerHTML = "❓";
    }

    displayPastVotes();  // Load past votes on page load
});
