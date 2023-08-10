const apiKey = 'your-api-key';
const form = document.querySelector('form');
const input = document.querySelector('input');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');
const searchHistory = document.querySelector('#search-history');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = input.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Display current weather conditions
        const cityName = data.name;
        const date = new Date(data.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        currentWeather.innerHTML = `
          <h2>${cityName} (${date}) <img src="${iconUrl}" alt="${data.weather[0].description}"></h2>
          <p>Temperature: ${temperature} °F</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} MPH</p>
        `;
        
        // Make another API call to get the 5-day forecast
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
        return fetch(forecastApiUrl);
      })
      .then(response => response.json())
    .then(data => {
      // Display 5-day forecast
      const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      forecast.innerHTML = '';
      forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
        const temperature = item.main.temp;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;
        forecast.innerHTML += `
          <div>
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${item.weather[0].description}">
            <p>Temperature: ${temperature} °F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} MPH</p>
          </div>
        `;
      });

      // Add the city to the search history
      const searchItem = document.createElement('li');
      searchItem.textContent = city;
      searchHistory.appendChild(searchItem);
    })
    .catch(error => console.error(error));
});

searchHistory.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    const city = event.target.textContent;
    input.value = city;
    form.dispatchEvent(new Event('submit'));
  }
});