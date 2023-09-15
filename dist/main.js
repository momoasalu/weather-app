/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
function startLoad() {
  console.log("loading...");
}

function stopLoad() {
  console.log("done!");
}

function extractData(forecast) {
  return {
    location: `${forecast.location.name}, ${forecast.location.country}`,
    time: forecast.current.last_updated,
    temp: forecast.current.temp_c,
    condition_code: forecast.current.condition.code,
    condition_text: forecast.current.condition.text,
    feels_like: forecast.current.feelslike_c,
    humidity: forecast.current.humidity,
    uv_index: forecast.current.uv,
    wind_kph: forecast.current.wind_kph,
    wind_dir: forecast.current.wind_dir,
    precip: forecast.current.precip_mm,
    cloud: forecast.current.cloud,
    forecastday: forecast.forecast.forecastday.map((item) => ({
      sunrise: item.astro.sunrise,
      sunset: item.astro.sunset,
      moon_phase: item.astro.moon_phase,
      date: item.date,
      hour: [
        {
          temp: item.hour[0].temp_c,
          condition_code: item.hour[0].condition.code,
          condition_text: item.hour[0].condition.text,
        },
        {
          temp: item.hour[6].temp_c,
          condition_code: item.hour[6].condition.code,
          condition_text: item.hour[6].condition.text,
        },
        {
          temp: item.hour[12].temp_c,
          condition_code: item.hour[12].condition.code,
          condition_text: item.hour[12].condition.text,
        },
        {
          temp: item.hour[18].temp_c,
          condition_code: item.hour[18].condition.code,
          condition_text: item.hour[18].condition.text,
        },
      ],
    })),
  };
}

function populatePage(promise) {
  promise.then((data) => {
    const current = document.querySelector(".current");
    const city = current.querySelector(".city");
    city.textContent = data.location;
    const time = current.querySelector(".current-time");
    time.textContent = data.time;
    const weatherIcon = current.querySelector(".current-weather > .icon");
    const weatherCondition = current.querySelector(
      ".current-weather > .condition",
    );
    weatherCondition.textContent = data.condition_text;
    const temp = current.querySelector(".current-weather > .temp");
    temp.textContent = data.temp;

    const feelsLike = document.querySelector(".feels-like");
    feelsLike.textContent = data.feels_like;
    const humidity = document.querySelector(".humidity");
    humidity.textContent = data.humidity;
    const uvIndex = document.querySelector(".uv-index");
    uvIndex.textContent = data.uv_index;
    const wind = document.querySelector(".wind");
    wind.textContent = data.wind;
    const precip = document.querySelector(".precip");
    precip.textContent = data.precip;
    const cloud = document.querySelector(".cloud");
    cloud.textContent = data.cloud;

    let i = 0;
    const slides = [...document.querySelectorAll(".slide")];
    slides.forEach((slide) => {
      const sunrise = slide.querySelector(".sunrise");
      sunrise.textContent = data.forecastday[i].sunrise;
      const sunset = slide.querySelector(".sunset");
      sunset.textContent = data.forecastday[i].sunset;
      const moonPhase = slide.querySelector(".moon-phase");
      moonPhase.textContent = data.forecastday[i].moon_phase;

      let j = 0;
      [...slide.querySelectorAll(".hour")].forEach((hour) => {
        const icon = hour.querySelector(".icon");
        const condition = hour.querySelector(".condition");
        condition.textContent = data.forecastday[i].hour[j].condition_text;
        const temperature = hour.querySelector(".temp");
        temperature.textContent = data.forecastday[i].hour[j].temp;
        j += 1;
      });
      i += 1;
    });
  });
}

async function getForecastData(location) {
  startLoad();
  const forecastRequest = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=ff4638f583ef4aa698c114919231109&q=${location}&days=3`,
    { mode: "cors" },
  );
  const forecast = await forecastRequest.json();
  const data = extractData(forecast);
  console.log(data);
  stopLoad();
  return data;
}

populatePage(getForecastData("Paris"));

async function searchCities(str) {
  const optionsRequest = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=ff4638f583ef4aa698c114919231109&q=${str}`,
    { mode: "cors" },
  );
  const options = await optionsRequest.json();
  return options;
}

const search = document.querySelector("input");
const searchBtn = document.querySelector("button");

search.addEventListener("search", (ev) => {
  ev.preventDefault();
});

function searchStr (e) {
  const index = e.target.getAttribute('data-index');
  searchCities(search.value).then((cities) => {
    populatePage(getForecastData(`${cities[index].lat},${cities[index].lon}`));
  });
}

searchBtn.addEventListener("click", () => {
  searchCities(search.value).then((cities) => {
    if (cities.length > 0) {
      const choice = cities[0];
      populatePage(getForecastData(`${choice.lat},${choice.lon}`));
      console.log(choice);
    }
  });
});

search.addEventListener("input", () => {
  const searchBox = document.querySelector("div.search-box");
  searchBox.textContent = "";
  searchCities(search.value).then((cities) => {
    let index = 0;
    cities.forEach((item) => {
      const city = document.createElement("div");
      city.classList.add("city-option");
      city.setAttribute('data-index', index);
      city.addEventListener('click', searchStr);
      city.textContent = `${item.name}, ${item.region}, ${item.country}`;
      searchBox.appendChild(city);
      index += 1;
    });
  });
});

search.addEventListener("focus", () => {
  const searchBox = document.createElement("div");
  searchBox.classList.add("search-box");
  search.parentElement.appendChild(searchBox);
});

search.addEventListener("focusout", () => {
  const searchBox = document.querySelector("div.search-box");
  setTimeout(() => {
    searchBox.remove()
  }, 300);
});



const form = document.querySelector("form");
form.addEventListener("submit", (ev) => {
  ev.preventDefault();
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUIsSUFBSSwwQkFBMEI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RixTQUFTO0FBQ2xHLE1BQU0sY0FBYztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsdUZBQXVGLElBQUk7QUFDM0YsTUFBTSxjQUFjO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGtCQUFrQixHQUFHLGtCQUFrQjtBQUMzRSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsV0FBVyxHQUFHLFdBQVc7QUFDL0Q7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVUsSUFBSSxZQUFZLElBQUksYUFBYTtBQUN2RTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7O0FBSUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHN0YXJ0TG9hZCgpIHtcbiAgY29uc29sZS5sb2coXCJsb2FkaW5nLi4uXCIpO1xufVxuXG5mdW5jdGlvbiBzdG9wTG9hZCgpIHtcbiAgY29uc29sZS5sb2coXCJkb25lIVwiKTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdERhdGEoZm9yZWNhc3QpIHtcbiAgcmV0dXJuIHtcbiAgICBsb2NhdGlvbjogYCR7Zm9yZWNhc3QubG9jYXRpb24ubmFtZX0sICR7Zm9yZWNhc3QubG9jYXRpb24uY291bnRyeX1gLFxuICAgIHRpbWU6IGZvcmVjYXN0LmN1cnJlbnQubGFzdF91cGRhdGVkLFxuICAgIHRlbXA6IGZvcmVjYXN0LmN1cnJlbnQudGVtcF9jLFxuICAgIGNvbmRpdGlvbl9jb2RlOiBmb3JlY2FzdC5jdXJyZW50LmNvbmRpdGlvbi5jb2RlLFxuICAgIGNvbmRpdGlvbl90ZXh0OiBmb3JlY2FzdC5jdXJyZW50LmNvbmRpdGlvbi50ZXh0LFxuICAgIGZlZWxzX2xpa2U6IGZvcmVjYXN0LmN1cnJlbnQuZmVlbHNsaWtlX2MsXG4gICAgaHVtaWRpdHk6IGZvcmVjYXN0LmN1cnJlbnQuaHVtaWRpdHksXG4gICAgdXZfaW5kZXg6IGZvcmVjYXN0LmN1cnJlbnQudXYsXG4gICAgd2luZF9rcGg6IGZvcmVjYXN0LmN1cnJlbnQud2luZF9rcGgsXG4gICAgd2luZF9kaXI6IGZvcmVjYXN0LmN1cnJlbnQud2luZF9kaXIsXG4gICAgcHJlY2lwOiBmb3JlY2FzdC5jdXJyZW50LnByZWNpcF9tbSxcbiAgICBjbG91ZDogZm9yZWNhc3QuY3VycmVudC5jbG91ZCxcbiAgICBmb3JlY2FzdGRheTogZm9yZWNhc3QuZm9yZWNhc3QuZm9yZWNhc3RkYXkubWFwKChpdGVtKSA9PiAoe1xuICAgICAgc3VucmlzZTogaXRlbS5hc3Ryby5zdW5yaXNlLFxuICAgICAgc3Vuc2V0OiBpdGVtLmFzdHJvLnN1bnNldCxcbiAgICAgIG1vb25fcGhhc2U6IGl0ZW0uYXN0cm8ubW9vbl9waGFzZSxcbiAgICAgIGRhdGU6IGl0ZW0uZGF0ZSxcbiAgICAgIGhvdXI6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRlbXA6IGl0ZW0uaG91clswXS50ZW1wX2MsXG4gICAgICAgICAgY29uZGl0aW9uX2NvZGU6IGl0ZW0uaG91clswXS5jb25kaXRpb24uY29kZSxcbiAgICAgICAgICBjb25kaXRpb25fdGV4dDogaXRlbS5ob3VyWzBdLmNvbmRpdGlvbi50ZXh0LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGVtcDogaXRlbS5ob3VyWzZdLnRlbXBfYyxcbiAgICAgICAgICBjb25kaXRpb25fY29kZTogaXRlbS5ob3VyWzZdLmNvbmRpdGlvbi5jb2RlLFxuICAgICAgICAgIGNvbmRpdGlvbl90ZXh0OiBpdGVtLmhvdXJbNl0uY29uZGl0aW9uLnRleHQsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZW1wOiBpdGVtLmhvdXJbMTJdLnRlbXBfYyxcbiAgICAgICAgICBjb25kaXRpb25fY29kZTogaXRlbS5ob3VyWzEyXS5jb25kaXRpb24uY29kZSxcbiAgICAgICAgICBjb25kaXRpb25fdGV4dDogaXRlbS5ob3VyWzEyXS5jb25kaXRpb24udGV4dCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRlbXA6IGl0ZW0uaG91clsxOF0udGVtcF9jLFxuICAgICAgICAgIGNvbmRpdGlvbl9jb2RlOiBpdGVtLmhvdXJbMThdLmNvbmRpdGlvbi5jb2RlLFxuICAgICAgICAgIGNvbmRpdGlvbl90ZXh0OiBpdGVtLmhvdXJbMThdLmNvbmRpdGlvbi50ZXh0LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlUGFnZShwcm9taXNlKSB7XG4gIHByb21pc2UudGhlbigoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnRcIik7XG4gICAgY29uc3QgY2l0eSA9IGN1cnJlbnQucXVlcnlTZWxlY3RvcihcIi5jaXR5XCIpO1xuICAgIGNpdHkudGV4dENvbnRlbnQgPSBkYXRhLmxvY2F0aW9uO1xuICAgIGNvbnN0IHRpbWUgPSBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC10aW1lXCIpO1xuICAgIHRpbWUudGV4dENvbnRlbnQgPSBkYXRhLnRpbWU7XG4gICAgY29uc3Qgd2VhdGhlckljb24gPSBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC13ZWF0aGVyID4gLmljb25cIik7XG4gICAgY29uc3Qgd2VhdGhlckNvbmRpdGlvbiA9IGN1cnJlbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLmN1cnJlbnQtd2VhdGhlciA+IC5jb25kaXRpb25cIixcbiAgICApO1xuICAgIHdlYXRoZXJDb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmNvbmRpdGlvbl90ZXh0O1xuICAgIGNvbnN0IHRlbXAgPSBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC13ZWF0aGVyID4gLnRlbXBcIik7XG4gICAgdGVtcC50ZXh0Q29udGVudCA9IGRhdGEudGVtcDtcblxuICAgIGNvbnN0IGZlZWxzTGlrZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbHMtbGlrZVwiKTtcbiAgICBmZWVsc0xpa2UudGV4dENvbnRlbnQgPSBkYXRhLmZlZWxzX2xpa2U7XG4gICAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmh1bWlkaXR5XCIpO1xuICAgIGh1bWlkaXR5LnRleHRDb250ZW50ID0gZGF0YS5odW1pZGl0eTtcbiAgICBjb25zdCB1dkluZGV4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51di1pbmRleFwiKTtcbiAgICB1dkluZGV4LnRleHRDb250ZW50ID0gZGF0YS51dl9pbmRleDtcbiAgICBjb25zdCB3aW5kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5kXCIpO1xuICAgIHdpbmQudGV4dENvbnRlbnQgPSBkYXRhLndpbmQ7XG4gICAgY29uc3QgcHJlY2lwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcmVjaXBcIik7XG4gICAgcHJlY2lwLnRleHRDb250ZW50ID0gZGF0YS5wcmVjaXA7XG4gICAgY29uc3QgY2xvdWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3VkXCIpO1xuICAgIGNsb3VkLnRleHRDb250ZW50ID0gZGF0YS5jbG91ZDtcblxuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCBzbGlkZXMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZVwiKV07XG4gICAgc2xpZGVzLmZvckVhY2goKHNsaWRlKSA9PiB7XG4gICAgICBjb25zdCBzdW5yaXNlID0gc2xpZGUucXVlcnlTZWxlY3RvcihcIi5zdW5yaXNlXCIpO1xuICAgICAgc3VucmlzZS50ZXh0Q29udGVudCA9IGRhdGEuZm9yZWNhc3RkYXlbaV0uc3VucmlzZTtcbiAgICAgIGNvbnN0IHN1bnNldCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuc3Vuc2V0XCIpO1xuICAgICAgc3Vuc2V0LnRleHRDb250ZW50ID0gZGF0YS5mb3JlY2FzdGRheVtpXS5zdW5zZXQ7XG4gICAgICBjb25zdCBtb29uUGhhc2UgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLm1vb24tcGhhc2VcIik7XG4gICAgICBtb29uUGhhc2UudGV4dENvbnRlbnQgPSBkYXRhLmZvcmVjYXN0ZGF5W2ldLm1vb25fcGhhc2U7XG5cbiAgICAgIGxldCBqID0gMDtcbiAgICAgIFsuLi5zbGlkZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXJcIildLmZvckVhY2goKGhvdXIpID0+IHtcbiAgICAgICAgY29uc3QgaWNvbiA9IGhvdXIucXVlcnlTZWxlY3RvcihcIi5pY29uXCIpO1xuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBob3VyLnF1ZXJ5U2VsZWN0b3IoXCIuY29uZGl0aW9uXCIpO1xuICAgICAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmZvcmVjYXN0ZGF5W2ldLmhvdXJbal0uY29uZGl0aW9uX3RleHQ7XG4gICAgICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gaG91ci5xdWVyeVNlbGVjdG9yKFwiLnRlbXBcIik7XG4gICAgICAgIHRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gZGF0YS5mb3JlY2FzdGRheVtpXS5ob3VyW2pdLnRlbXA7XG4gICAgICAgIGogKz0gMTtcbiAgICAgIH0pO1xuICAgICAgaSArPSAxO1xuICAgIH0pO1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Rm9yZWNhc3REYXRhKGxvY2F0aW9uKSB7XG4gIHN0YXJ0TG9hZCgpO1xuICBjb25zdCBmb3JlY2FzdFJlcXVlc3QgPSBhd2FpdCBmZXRjaChcbiAgICBgaHR0cHM6Ly9hcGkud2VhdGhlcmFwaS5jb20vdjEvZm9yZWNhc3QuanNvbj9rZXk9ZmY0NjM4ZjU4M2VmNGFhNjk4YzExNDkxOTIzMTEwOSZxPSR7bG9jYXRpb259JmRheXM9M2AsXG4gICAgeyBtb2RlOiBcImNvcnNcIiB9LFxuICApO1xuICBjb25zdCBmb3JlY2FzdCA9IGF3YWl0IGZvcmVjYXN0UmVxdWVzdC5qc29uKCk7XG4gIGNvbnN0IGRhdGEgPSBleHRyYWN0RGF0YShmb3JlY2FzdCk7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xuICBzdG9wTG9hZCgpO1xuICByZXR1cm4gZGF0YTtcbn1cblxucG9wdWxhdGVQYWdlKGdldEZvcmVjYXN0RGF0YShcIlBhcmlzXCIpKTtcblxuYXN5bmMgZnVuY3Rpb24gc2VhcmNoQ2l0aWVzKHN0cikge1xuICBjb25zdCBvcHRpb25zUmVxdWVzdCA9IGF3YWl0IGZldGNoKFxuICAgIGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9zZWFyY2guanNvbj9rZXk9ZmY0NjM4ZjU4M2VmNGFhNjk4YzExNDkxOTIzMTEwOSZxPSR7c3RyfWAsXG4gICAgeyBtb2RlOiBcImNvcnNcIiB9LFxuICApO1xuICBjb25zdCBvcHRpb25zID0gYXdhaXQgb3B0aW9uc1JlcXVlc3QuanNvbigpO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuY29uc3Qgc2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuY29uc3Qgc2VhcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcblxuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWFyY2hcIiwgKGV2KSA9PiB7XG4gIGV2LnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuZnVuY3Rpb24gc2VhcmNoU3RyIChlKSB7XG4gIGNvbnN0IGluZGV4ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWluZGV4Jyk7XG4gIHNlYXJjaENpdGllcyhzZWFyY2gudmFsdWUpLnRoZW4oKGNpdGllcykgPT4ge1xuICAgIHBvcHVsYXRlUGFnZShnZXRGb3JlY2FzdERhdGEoYCR7Y2l0aWVzW2luZGV4XS5sYXR9LCR7Y2l0aWVzW2luZGV4XS5sb259YCkpO1xuICB9KTtcbn1cblxuc2VhcmNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHNlYXJjaENpdGllcyhzZWFyY2gudmFsdWUpLnRoZW4oKGNpdGllcykgPT4ge1xuICAgIGlmIChjaXRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY2hvaWNlID0gY2l0aWVzWzBdO1xuICAgICAgcG9wdWxhdGVQYWdlKGdldEZvcmVjYXN0RGF0YShgJHtjaG9pY2UubGF0fSwke2Nob2ljZS5sb259YCkpO1xuICAgICAgY29uc29sZS5sb2coY2hvaWNlKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnNlYXJjaC1ib3hcIik7XG4gIHNlYXJjaEJveC50ZXh0Q29udGVudCA9IFwiXCI7XG4gIHNlYXJjaENpdGllcyhzZWFyY2gudmFsdWUpLnRoZW4oKGNpdGllcykgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY2l0aWVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2l0eS5jbGFzc0xpc3QuYWRkKFwiY2l0eS1vcHRpb25cIik7XG4gICAgICBjaXR5LnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGluZGV4KTtcbiAgICAgIGNpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWFyY2hTdHIpO1xuICAgICAgY2l0eS50ZXh0Q29udGVudCA9IGAke2l0ZW0ubmFtZX0sICR7aXRlbS5yZWdpb259LCAke2l0ZW0uY291bnRyeX1gO1xuICAgICAgc2VhcmNoQm94LmFwcGVuZENoaWxkKGNpdHkpO1xuICAgICAgaW5kZXggKz0gMTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB7XG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHNlYXJjaEJveC5jbGFzc0xpc3QuYWRkKFwic2VhcmNoLWJveFwiKTtcbiAgc2VhcmNoLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoc2VhcmNoQm94KTtcbn0pO1xuXG5zZWFyY2guYWRkRXZlbnRMaXN0ZW5lcihcImZvY3Vzb3V0XCIsICgpID0+IHtcbiAgY29uc3Qgc2VhcmNoQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5zZWFyY2gtYm94XCIpO1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBzZWFyY2hCb3gucmVtb3ZlKClcbiAgfSwgMzAwKTtcbn0pO1xuXG5cblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpO1xuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=