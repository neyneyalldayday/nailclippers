const searchBar = document.getElementById("search");
const userInput = document.getElementById("user_input");
const history = document.getElementById("history");
const currentWeather = document.getElementById("weather_now");
const todaysForecast = document.getElementById("todays-weather-data");
const fiveDays = document.getElementById("five-day-cards");
const apiKey = "838b8791a0237d5fc47969309680dfc4";
const apiKey2 = "dbb601e9b7c8bad902bd55c2a2689ca5";

// Button
const button = document.getElementById("searchBtn");

// var cityName

function search(cityName) {
   
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const cityName = `<h1>${data[0].name}</h1>`;
      currentWeather.innerHTML = cityName;
      var lat = data[0].lat;
      var lon = data[0].lon;

      fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey2}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          console.log(weatherData);
          // add code here for displaying weatherData
          let fiveDayForecast = "";
          const iconCode = weatherData.current.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
          const todaysData = `
            <section>
            <img src="${iconUrl}"/>
            <p>Temp: ${weatherData.current.temp}</p>
                <p>Humidity: ${weatherData.current.humidity}</p>
                 <p>Wind Speed: ${weatherData.current.wind_speed}</p>                 
                 <p>${weatherData.current.weather[0].description}</p>
                 <p>${weatherData.alerts[0].event}</p>
             </section>
            
            `;
          todaysForecast.innerHTML = todaysData;

          let fiveDayData = weatherData.daily;
          console.log(fiveDayData, "five-day-shit");
          for (let i = 0; i < 5; i++) {
            console.log(fiveDayData[i], "yo");
            const fiveDayCode = fiveDayData[i].weather[0].icon;
            const fiveDayUrl = `https://openweathermap.org/img/w/${fiveDayCode}.png`;
            fiveDayForecast += `
                <section class="cards">
                <div class="card-img">
                <img src='${fiveDayUrl}'/>
                </div> 
                <div class="card-content">
                <p>${fiveDayData[i].weather[0].description}</p>
                <p>temp: day ${fiveDayData[i].temp.day}</p>
                <p>temp: night ${fiveDayData[i].temp.night}</p>
                <p>humidity ${fiveDayData[i].humidity}</p>
                <p>windSpeed ${fiveDayData[i].wind_speed}</p>               
                </div>             
                <div class="summary">
                <p >${fiveDayData[i].summary}</p>
                </div>                               
                </section>               
                `;

            fiveDays.innerHTML = fiveDayForecast;
          }
        });
      // DO NOT ADD HERE
    });
}
// Making the button work
button.addEventListener("click", function (event) {
  event.preventDefault();
  fiveDays.innerHTML = "";
  let cityName = userInput.value.trim();
  makeHistory()
  search(cityName);
  userInput.value = "";  
});

function makeHistory() {
    let historyValue = userInput.value.trim();
    let historyStorage = JSON.parse(localStorage.getItem("historyStorage")) || [];
    historyStorage.push(historyValue);
    localStorage.setItem("historyStorage", JSON.stringify(historyStorage));

    makeHistoryList(historyStorage)
}

function makeHistoryList(historyStorage) {
    history.innerHTML = "";
    historyStorage.forEach(function(city){
        const li = document.createElement('li')
        li.textContent = city;
        li.className += "past-city"
        history.appendChild(li)

       
        li.addEventListener("click", function(event){
            event.preventDefault();
            let pastCity = li.textContent;
            search(pastCity)
        })
    });
}




