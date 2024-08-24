const weather = document.querySelector('.weather');
const time = document.querySelector('.time');

// Update current time every second

function updateTime() {
  const date = new Date();
  // get hours, minutes, and convert 24hr to 12hr, also add AM/PM indicator, and put it in local time
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12? 'PM' : 'AM';
  time.innerHTML = `<i class="fa-regular fa-clock" style="margin-right:2px;"></i> ${hours}:${minutes} ${ampm}`;
  setTimeout(updateTime, 1000);
}

updateTime();

// Get weather data from OpenWeatherMap API

async function getWeatherData(city, state) {
    const apiKey = 'f23916bdb841106e411b024086a5b4d5';

    const cityData = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state}&limit=1&appid=${apiKey}`);
    const cityLocation = await cityData.json();
    if (!cityLocation[0]) {
        console.error('City not found!');
        return;
    }
    console.log(cityLocation)
    const longitude = cityLocation[0].lon;
    const latitude = cityLocation[0].lat;
    console.log(longitude, latitude)
    console.log(cityLocation[0].name)

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // fairenheit to celsius conversion

        const data = await response.json();
        

        console.log(data)
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function displayWeatherData(data, city) {
    if (!data) {
        return;
    }
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].main;

    if (description.includes('rain')) {
        weather.innerHTML = `<i class="fa-solid fa-cloud-showers-heavy"></i> ${temperature}°C`;
        weather.title = city + ';'+ description;
    } else {
        if (temperature > 20) {
            weather.innerHTML = `<i class="fa-solid fa-sun"></i> ${temperature}°C`;
            weather.title = city + '; ' + description;
        } else if (temperature > 10) {
            weather.innerHTML = `<i class="fa-solid fa-cloud"></i> ${temperature}°C`;
            weather.title = city + '; ' + description;
        } else if (temperature < 0) {
            weather.innerHTML = `<i class="fa-solid fa-snowflake"></i> ${temperature}°C`;
            weather.title = city + '; ' + description;
        }
    }
}
// Get weather data for the current location

async function getLocationWeather() {
        const city = 'Toronto'; // default city if geolocation fails
        const state = 'Ontario'; // default state if geolocation fails
        const weatherData = await getWeatherData(city, state);
        displayWeatherData(weatherData, city);
    
    // Update weather every 5 minutes
    setInterval(getLocationWeather, 300000);
}

getLocationWeather();

// Input field

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const searchInput = document.querySelector('.search > input');
const searchButton = document.querySelector('.search > button');

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // redirect to search engine with search term
        window.location.href = 'https://google.com/search?q=' + searchTerm;
    }
});

// Autocomplete

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetch("https://cors-anywhere.herokuapp.com/suggestqueries.google.com/complete/search?client=firefox&q=" + encodeURIComponent(searchTerm), {
            headers: {
                'X-Requested-With': 'realreallidnewofoiwfhoiw'
            }
        }).then(response => {
            const responsetext = response.text()
                if (responsetext.includes('too many requests')) {
                    const autocompleteList = document.querySelector('.autocomplete');
                    
                    
                autocompleteList.style.display = 'flex';
                    return [ 'Too many requests. Please try again later.'];

                }
            return response.json()
            }).then(data => {
            console.log(data);
            const suggestions = data[1];
            const autocompleteList = document.querySelector('.autocomplete');
            autocompleteList.innerHTML = '';
            
        autocompleteList.style.display = 'flex';
        if (suggestions.length === 0) {
            autocompleteList.style.display = 'none';
            return;
        }
        
        autocompleteList.style.height = 'auto';
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                li.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    autocompleteList.innerHTML = '';
                    searchButton.click();
                });
                autocompleteList.appendChild(li);
            });
        });
    } else {
        const autocompleteList = document.querySelector('.autocomplete');
        autocompleteList.innerHTML = '';
        autocompleteList.style.display = 'none';
        
        autocompleteList.style.height = '0px';
    }
});

searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.click();
    }
})



searchInput.addEventListener('focus', () => {
    const autocompleteList = document.querySelector('.autocomplete');
    if (autocompleteList.children.length > 0){
        autocompleteList.style.display = 'flex';
        autocompleteList.style.height = 'auto';
    }
});

