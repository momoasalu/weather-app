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

let slideIndex = 0;

function showSlides(index) {
  const slides = [...document.querySelectorAll(".slide")];
  slides.forEach((slide) => {
    slide.style.setProperty("display", "none");
  });
  slides[index].style.setProperty("display", "block");
}

showSlides(0);

function plusSlides() {
  slideIndex += 1;
  if (slideIndex >= [...document.querySelectorAll(".slide")].length) {
    slideIndex = 0;
  }
  showSlides(slideIndex);
}

function minusSlides() {
  slideIndex -= 1;
  if (slideIndex < 0) {
    slideIndex = [...document.querySelectorAll(".slide")].length - 1;
  }
  showSlides(slideIndex);
}

const prevBtn = document.querySelector("button.prev");
const nextBtn = document.querySelector("button.next");

prevBtn.addEventListener("click", minusSlides);
nextBtn.addEventListener("click", plusSlides);

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
    wind_deg: forecast.current.wind_degree,
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
    wind.textContent = `${data.wind_kph} ${data.wind_dir}`;
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
    slideIndex = 0;
    showSlides(slideIndex);
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
  if (str.trim().length > 0) {
    const optionsRequest = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=ff4638f583ef4aa698c114919231109&q=${str}`,
      { mode: "cors" },
    );
    if (optionsRequest.ok) {
      const options = await optionsRequest.json();
      return options;
    }
  }
  return [];
}

const search = document.querySelector("input");
const searchBtn = document.querySelector("button");

const form = document.querySelector("form");

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
});

search.addEventListener("search", (ev) => {
  ev.preventDefault();
});

function searchStr(e) {
  const index = e.target.getAttribute("data-index");
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
  form.reset();
});

search.addEventListener("input", () => {
  const searchBox = document.querySelector("div.search-box");
  searchBox.textContent = "";
  searchCities(search.value).then((cities) => {
    let index = 0;
    cities.forEach((item) => {
      const city = document.createElement("div");
      city.classList.add("city-option");
      city.setAttribute("data-index", index);
      city.addEventListener("click", searchStr);
      city.textContent = `${item.name}, ${item.country}`;
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
    searchBox.remove();
  }, 300);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQix1QkFBdUIsSUFBSSwwQkFBMEI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGVBQWUsRUFBRSxjQUFjO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUZBQXlGLFNBQVM7QUFDbEcsTUFBTSxjQUFjO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RixJQUFJO0FBQzdGLFFBQVEsY0FBYztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGtCQUFrQixHQUFHLGtCQUFrQjtBQUMzRSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsV0FBVyxHQUFHLFdBQVc7QUFDL0Q7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVSxJQUFJLGFBQWE7QUFDdkQ7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHN0YXJ0TG9hZCgpIHtcbiAgY29uc29sZS5sb2coXCJsb2FkaW5nLi4uXCIpO1xufVxuXG5mdW5jdGlvbiBzdG9wTG9hZCgpIHtcbiAgY29uc29sZS5sb2coXCJkb25lIVwiKTtcbn1cblxubGV0IHNsaWRlSW5kZXggPSAwO1xuXG5mdW5jdGlvbiBzaG93U2xpZGVzKGluZGV4KSB7XG4gIGNvbnN0IHNsaWRlcyA9IFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlXCIpXTtcbiAgc2xpZGVzLmZvckVhY2goKHNsaWRlKSA9PiB7XG4gICAgc2xpZGUuc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgfSk7XG4gIHNsaWRlc1tpbmRleF0uc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG59XG5cbnNob3dTbGlkZXMoMCk7XG5cbmZ1bmN0aW9uIHBsdXNTbGlkZXMoKSB7XG4gIHNsaWRlSW5kZXggKz0gMTtcbiAgaWYgKHNsaWRlSW5kZXggPj0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVcIildLmxlbmd0aCkge1xuICAgIHNsaWRlSW5kZXggPSAwO1xuICB9XG4gIHNob3dTbGlkZXMoc2xpZGVJbmRleCk7XG59XG5cbmZ1bmN0aW9uIG1pbnVzU2xpZGVzKCkge1xuICBzbGlkZUluZGV4IC09IDE7XG4gIGlmIChzbGlkZUluZGV4IDwgMCkge1xuICAgIHNsaWRlSW5kZXggPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZVwiKV0ubGVuZ3RoIC0gMTtcbiAgfVxuICBzaG93U2xpZGVzKHNsaWRlSW5kZXgpO1xufVxuXG5jb25zdCBwcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJ1dHRvbi5wcmV2XCIpO1xuY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24ubmV4dFwiKTtcblxucHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWludXNTbGlkZXMpO1xubmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGx1c1NsaWRlcyk7XG5cbmZ1bmN0aW9uIGV4dHJhY3REYXRhKGZvcmVjYXN0KSB7XG4gIHJldHVybiB7XG4gICAgbG9jYXRpb246IGAke2ZvcmVjYXN0LmxvY2F0aW9uLm5hbWV9LCAke2ZvcmVjYXN0LmxvY2F0aW9uLmNvdW50cnl9YCxcbiAgICB0aW1lOiBmb3JlY2FzdC5jdXJyZW50Lmxhc3RfdXBkYXRlZCxcbiAgICB0ZW1wOiBmb3JlY2FzdC5jdXJyZW50LnRlbXBfYyxcbiAgICBjb25kaXRpb25fY29kZTogZm9yZWNhc3QuY3VycmVudC5jb25kaXRpb24uY29kZSxcbiAgICBjb25kaXRpb25fdGV4dDogZm9yZWNhc3QuY3VycmVudC5jb25kaXRpb24udGV4dCxcbiAgICBmZWVsc19saWtlOiBmb3JlY2FzdC5jdXJyZW50LmZlZWxzbGlrZV9jLFxuICAgIGh1bWlkaXR5OiBmb3JlY2FzdC5jdXJyZW50Lmh1bWlkaXR5LFxuICAgIHV2X2luZGV4OiBmb3JlY2FzdC5jdXJyZW50LnV2LFxuICAgIHdpbmRfa3BoOiBmb3JlY2FzdC5jdXJyZW50LndpbmRfa3BoLFxuICAgIHdpbmRfZGlyOiBmb3JlY2FzdC5jdXJyZW50LndpbmRfZGlyLFxuICAgIHdpbmRfZGVnOiBmb3JlY2FzdC5jdXJyZW50LndpbmRfZGVncmVlLFxuICAgIHByZWNpcDogZm9yZWNhc3QuY3VycmVudC5wcmVjaXBfbW0sXG4gICAgY2xvdWQ6IGZvcmVjYXN0LmN1cnJlbnQuY2xvdWQsXG4gICAgZm9yZWNhc3RkYXk6IGZvcmVjYXN0LmZvcmVjYXN0LmZvcmVjYXN0ZGF5Lm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgIHN1bnJpc2U6IGl0ZW0uYXN0cm8uc3VucmlzZSxcbiAgICAgIHN1bnNldDogaXRlbS5hc3Ryby5zdW5zZXQsXG4gICAgICBtb29uX3BoYXNlOiBpdGVtLmFzdHJvLm1vb25fcGhhc2UsXG4gICAgICBkYXRlOiBpdGVtLmRhdGUsXG4gICAgICBob3VyOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0ZW1wOiBpdGVtLmhvdXJbMF0udGVtcF9jLFxuICAgICAgICAgIGNvbmRpdGlvbl9jb2RlOiBpdGVtLmhvdXJbMF0uY29uZGl0aW9uLmNvZGUsXG4gICAgICAgICAgY29uZGl0aW9uX3RleHQ6IGl0ZW0uaG91clswXS5jb25kaXRpb24udGV4dCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRlbXA6IGl0ZW0uaG91cls2XS50ZW1wX2MsXG4gICAgICAgICAgY29uZGl0aW9uX2NvZGU6IGl0ZW0uaG91cls2XS5jb25kaXRpb24uY29kZSxcbiAgICAgICAgICBjb25kaXRpb25fdGV4dDogaXRlbS5ob3VyWzZdLmNvbmRpdGlvbi50ZXh0LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGVtcDogaXRlbS5ob3VyWzEyXS50ZW1wX2MsXG4gICAgICAgICAgY29uZGl0aW9uX2NvZGU6IGl0ZW0uaG91clsxMl0uY29uZGl0aW9uLmNvZGUsXG4gICAgICAgICAgY29uZGl0aW9uX3RleHQ6IGl0ZW0uaG91clsxMl0uY29uZGl0aW9uLnRleHQsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZW1wOiBpdGVtLmhvdXJbMThdLnRlbXBfYyxcbiAgICAgICAgICBjb25kaXRpb25fY29kZTogaXRlbS5ob3VyWzE4XS5jb25kaXRpb24uY29kZSxcbiAgICAgICAgICBjb25kaXRpb25fdGV4dDogaXRlbS5ob3VyWzE4XS5jb25kaXRpb24udGV4dCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVBhZ2UocHJvbWlzZSkge1xuICBwcm9taXNlLnRoZW4oKGRhdGEpID0+IHtcbiAgICBjb25zdCBjdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50XCIpO1xuICAgIGNvbnN0IGNpdHkgPSBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2l0eVwiKTtcbiAgICBjaXR5LnRleHRDb250ZW50ID0gZGF0YS5sb2NhdGlvbjtcbiAgICBjb25zdCB0aW1lID0gY3VycmVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtdGltZVwiKTtcbiAgICB0aW1lLnRleHRDb250ZW50ID0gZGF0YS50aW1lO1xuICAgIGNvbnN0IHdlYXRoZXJJY29uID0gY3VycmVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtd2VhdGhlciA+IC5pY29uXCIpO1xuICAgIGNvbnN0IHdlYXRoZXJDb25kaXRpb24gPSBjdXJyZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcIi5jdXJyZW50LXdlYXRoZXIgPiAuY29uZGl0aW9uXCIsXG4gICAgKTtcbiAgICB3ZWF0aGVyQ29uZGl0aW9uLnRleHRDb250ZW50ID0gZGF0YS5jb25kaXRpb25fdGV4dDtcbiAgICBjb25zdCB0ZW1wID0gY3VycmVudC5xdWVyeVNlbGVjdG9yKFwiLmN1cnJlbnQtd2VhdGhlciA+IC50ZW1wXCIpO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLnRlbXA7XG5cbiAgICBjb25zdCBmZWVsc0xpa2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZlZWxzLWxpa2VcIik7XG4gICAgZmVlbHNMaWtlLnRleHRDb250ZW50ID0gZGF0YS5mZWVsc19saWtlO1xuICAgIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5odW1pZGl0eVwiKTtcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XG4gICAgY29uc3QgdXZJbmRleCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXYtaW5kZXhcIik7XG4gICAgdXZJbmRleC50ZXh0Q29udGVudCA9IGRhdGEudXZfaW5kZXg7XG4gICAgY29uc3Qgd2luZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2luZFwiKTtcbiAgICB3aW5kLnRleHRDb250ZW50ID0gYCR7ZGF0YS53aW5kX2twaH0gJHtkYXRhLndpbmRfZGlyfWA7XG4gICAgY29uc3QgcHJlY2lwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcmVjaXBcIik7XG4gICAgcHJlY2lwLnRleHRDb250ZW50ID0gZGF0YS5wcmVjaXA7XG4gICAgY29uc3QgY2xvdWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3VkXCIpO1xuICAgIGNsb3VkLnRleHRDb250ZW50ID0gZGF0YS5jbG91ZDtcblxuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCBzbGlkZXMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZVwiKV07XG4gICAgc2xpZGVzLmZvckVhY2goKHNsaWRlKSA9PiB7XG4gICAgICBjb25zdCBzdW5yaXNlID0gc2xpZGUucXVlcnlTZWxlY3RvcihcIi5zdW5yaXNlXCIpO1xuICAgICAgc3VucmlzZS50ZXh0Q29udGVudCA9IGRhdGEuZm9yZWNhc3RkYXlbaV0uc3VucmlzZTtcbiAgICAgIGNvbnN0IHN1bnNldCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoXCIuc3Vuc2V0XCIpO1xuICAgICAgc3Vuc2V0LnRleHRDb250ZW50ID0gZGF0YS5mb3JlY2FzdGRheVtpXS5zdW5zZXQ7XG4gICAgICBjb25zdCBtb29uUGhhc2UgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKFwiLm1vb24tcGhhc2VcIik7XG4gICAgICBtb29uUGhhc2UudGV4dENvbnRlbnQgPSBkYXRhLmZvcmVjYXN0ZGF5W2ldLm1vb25fcGhhc2U7XG5cbiAgICAgIGxldCBqID0gMDtcbiAgICAgIFsuLi5zbGlkZS5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXJcIildLmZvckVhY2goKGhvdXIpID0+IHtcbiAgICAgICAgY29uc3QgaWNvbiA9IGhvdXIucXVlcnlTZWxlY3RvcihcIi5pY29uXCIpO1xuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBob3VyLnF1ZXJ5U2VsZWN0b3IoXCIuY29uZGl0aW9uXCIpO1xuICAgICAgICBjb25kaXRpb24udGV4dENvbnRlbnQgPSBkYXRhLmZvcmVjYXN0ZGF5W2ldLmhvdXJbal0uY29uZGl0aW9uX3RleHQ7XG4gICAgICAgIGNvbnN0IHRlbXBlcmF0dXJlID0gaG91ci5xdWVyeVNlbGVjdG9yKFwiLnRlbXBcIik7XG4gICAgICAgIHRlbXBlcmF0dXJlLnRleHRDb250ZW50ID0gZGF0YS5mb3JlY2FzdGRheVtpXS5ob3VyW2pdLnRlbXA7XG4gICAgICAgIGogKz0gMTtcbiAgICAgIH0pO1xuICAgICAgaSArPSAxO1xuICAgIH0pO1xuICAgIHNsaWRlSW5kZXggPSAwO1xuICAgIHNob3dTbGlkZXMoc2xpZGVJbmRleCk7XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRGb3JlY2FzdERhdGEobG9jYXRpb24pIHtcbiAgc3RhcnRMb2FkKCk7XG4gIGNvbnN0IGZvcmVjYXN0UmVxdWVzdCA9IGF3YWl0IGZldGNoKFxuICAgIGBodHRwczovL2FwaS53ZWF0aGVyYXBpLmNvbS92MS9mb3JlY2FzdC5qc29uP2tleT1mZjQ2MzhmNTgzZWY0YWE2OThjMTE0OTE5MjMxMTA5JnE9JHtsb2NhdGlvbn0mZGF5cz0zYCxcbiAgICB7IG1vZGU6IFwiY29yc1wiIH0sXG4gICk7XG4gIGNvbnN0IGZvcmVjYXN0ID0gYXdhaXQgZm9yZWNhc3RSZXF1ZXN0Lmpzb24oKTtcbiAgY29uc3QgZGF0YSA9IGV4dHJhY3REYXRhKGZvcmVjYXN0KTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG4gIHN0b3BMb2FkKCk7XG4gIHJldHVybiBkYXRhO1xufVxuXG5wb3B1bGF0ZVBhZ2UoZ2V0Rm9yZWNhc3REYXRhKFwiUGFyaXNcIikpO1xuXG5hc3luYyBmdW5jdGlvbiBzZWFyY2hDaXRpZXMoc3RyKSB7XG4gIGlmIChzdHIudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBvcHRpb25zUmVxdWVzdCA9IGF3YWl0IGZldGNoKFxuICAgICAgYGh0dHBzOi8vYXBpLndlYXRoZXJhcGkuY29tL3YxL3NlYXJjaC5qc29uP2tleT1mZjQ2MzhmNTgzZWY0YWE2OThjMTE0OTE5MjMxMTA5JnE9JHtzdHJ9YCxcbiAgICAgIHsgbW9kZTogXCJjb3JzXCIgfSxcbiAgICApO1xuICAgIGlmIChvcHRpb25zUmVxdWVzdC5vaykge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGF3YWl0IG9wdGlvbnNSZXF1ZXN0Lmpzb24oKTtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW107XG59XG5cbmNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcbmNvbnN0IHNlYXJjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKFwic2VhcmNoXCIsIChldikgPT4ge1xuICBldi5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbmZ1bmN0aW9uIHNlYXJjaFN0cihlKSB7XG4gIGNvbnN0IGluZGV4ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcbiAgc2VhcmNoQ2l0aWVzKHNlYXJjaC52YWx1ZSkudGhlbigoY2l0aWVzKSA9PiB7XG4gICAgcG9wdWxhdGVQYWdlKGdldEZvcmVjYXN0RGF0YShgJHtjaXRpZXNbaW5kZXhdLmxhdH0sJHtjaXRpZXNbaW5kZXhdLmxvbn1gKSk7XG4gIH0pO1xufVxuXG5zZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgc2VhcmNoQ2l0aWVzKHNlYXJjaC52YWx1ZSkudGhlbigoY2l0aWVzKSA9PiB7XG4gICAgaWYgKGNpdGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjaG9pY2UgPSBjaXRpZXNbMF07XG4gICAgICBwb3B1bGF0ZVBhZ2UoZ2V0Rm9yZWNhc3REYXRhKGAke2Nob2ljZS5sYXR9LCR7Y2hvaWNlLmxvbn1gKSk7XG4gICAgICBjb25zb2xlLmxvZyhjaG9pY2UpO1xuICAgIH1cbiAgfSk7XG4gIGZvcm0ucmVzZXQoKTtcbn0pO1xuXG5zZWFyY2guYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+IHtcbiAgY29uc3Qgc2VhcmNoQm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi5zZWFyY2gtYm94XCIpO1xuICBzZWFyY2hCb3gudGV4dENvbnRlbnQgPSBcIlwiO1xuICBzZWFyY2hDaXRpZXMoc2VhcmNoLnZhbHVlKS50aGVuKChjaXRpZXMpID0+IHtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGNpdGllcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBjaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNpdHkuY2xhc3NMaXN0LmFkZChcImNpdHktb3B0aW9uXCIpO1xuICAgICAgY2l0eS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWluZGV4XCIsIGluZGV4KTtcbiAgICAgIGNpdHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlYXJjaFN0cik7XG4gICAgICBjaXR5LnRleHRDb250ZW50ID0gYCR7aXRlbS5uYW1lfSwgJHtpdGVtLmNvdW50cnl9YDtcbiAgICAgIHNlYXJjaEJveC5hcHBlbmRDaGlsZChjaXR5KTtcbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnNlYXJjaC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4ge1xuICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBzZWFyY2hCb3guY2xhc3NMaXN0LmFkZChcInNlYXJjaC1ib3hcIik7XG4gIHNlYXJjaC5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHNlYXJjaEJveCk7XG59KTtcblxuc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCAoKSA9PiB7XG4gIGNvbnN0IHNlYXJjaEJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXYuc2VhcmNoLWJveFwiKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgc2VhcmNoQm94LnJlbW92ZSgpO1xuICB9LCAzMDApO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=