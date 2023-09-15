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
