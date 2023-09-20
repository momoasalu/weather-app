import { format } from "date-fns";

import Sunny from "./icons/sun.png";
import Clear from "./icons/night.png";
import CloudyDay from "./icons/cloudy-day.png";
import CloudyNight from "./icons/cloudy-night.png";
import Overcast from "./icons/cloud.png";
import MistyDay from "./icons/foggy-day.png";
import MistyNight from "./icons/foggy-night.png";
import DrizzleDay from "./icons/drizzle-day.png";
import DrizzleNight from "./icons/drizzle-night.png";
import Snow from "./icons/snow.png";
import Sleet from "./icons/downpour.png";
import Thunder from "./icons/lightning-bolt.png";
import Rain from "./icons/rain.png";
import Storm from "./icons/storm.png";
import Blizzard from "./icons/blizzard.png";
import Hailstone from "./icons/hailstone.png";

import "./style.css";

function getIcon(code, isDay) {
  let src;
  switch (code) {
    case 1000:
      src = isDay ? Sunny : Clear;
      break;
    case 1003:
    case 1006:
      src = isDay ? CloudyDay : CloudyNight;
      break;
    case 1009:
      src = Overcast;
      break;
    case 1030:
    case 1135:
    case 1147:
      src = isDay ? MistyDay : MistyNight;
      break;
    case 1063:
    case 1066:
    case 1069:
    case 1072:
    case 1150:
    case 1153:
    case 1168:
    case 1171:
      src = isDay ? DrizzleDay : DrizzleNight;
      break;
    case 1087:
      src = Thunder;
      break;
    case 1114:
    case 1210:
    case 1213:
    case 1216:
    case 1219:
    case 1222:
    case 1225:
    case 1255:
    case 1258:
      src = Snow;
      break;
    case 1117:
      src = Blizzard;
      break;
    case 1180:
    case 1183:
    case 1186:
    case 1189:
    case 1192:
    case 1240:
    case 1243:
    case 1246:
      src = Rain;
      break;
    case 1195:
    case 1198:
    case 1201:
    case 1204:
    case 1207:
    case 1249:
    case 1252:
      src = Sleet;
      break;
    case 1237:
    case 1261:
    case 1264:
      src = Hailstone;
      break;
    case 1273:
    case 1276:
    case 1279:
    case 1282:
      src = Storm;
      break;
    default:
      src = "weird! no option here?";
      break;
  }
  return src;
}
function startLoad() {
  console.log("loading...");
}

function stopLoad() {
  console.log("done!");
}

function getUVDescriptor(uv) {
  if (uv <= 2) {
    return "rgb(63, 192, 37)";
  }
  if (uv <= 5) {
    return "rgb(255, 255, 121)";
  }
  if (uv <= 7) {
    return "orange";
  }
  if (uv <= 10) {
    return "rgb(255, 75, 75)";
  }
  return "rgb(191, 110, 191)";
}

let slideIndex = 0;

function showSlides(index) {
  const slides = [...document.querySelectorAll(".slide")];
  slides.forEach((slide) => {
    slide.style.setProperty("display", "none");
  });
  slides[index].style.setProperty("display", "");
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
    name: forecast.location.name,
    country: forecast.location.country,
    time: new Date(
      Number(forecast.current.last_updated.slice(0, 4)),
      Number(forecast.current.last_updated.slice(5, 7)) - 1,
      Number(forecast.current.last_updated.slice(8, 10)),
      Number(forecast.current.last_updated.slice(11, 13)),
      Number(forecast.current.last_updated.slice(14)),
    ),
    isDay: forecast.current.is_day,
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
      date: new Date(
        Number(item.date.slice(0, 4)),
        Number(item.date.slice(5, 7)) - 1,
        Number(item.date.slice(8)),
      ),
      hour: [
        {
          time: "00:00",
          temp: item.hour[0].temp_c,
          condition_code: item.hour[0].condition.code,
          condition_text: item.hour[0].condition.text,
          isDay: item.hour[0].is_day,
        },
        {
          time: "06:00",
          temp: item.hour[6].temp_c,
          condition_code: item.hour[6].condition.code,
          condition_text: item.hour[6].condition.text,
          isDay: item.hour[6].is_day,
        },
        {
          time: "12:00",
          temp: item.hour[12].temp_c,
          condition_code: item.hour[12].condition.code,
          condition_text: item.hour[12].condition.text,
          isDay: item.hour[12].is_day,
        },
        {
          time: "18:00",
          temp: item.hour[18].temp_c,
          condition_code: item.hour[18].condition.code,
          condition_text: item.hour[18].condition.text,
          isDay: item.hour[18].is_day,
        },
      ],
    })),
  };
}

function populatePage(promise) {
  promise.then((data) => {
    const current = document.querySelector(".current");
    const city = current.querySelector(".city");
    city.innerHTML = `${data.name.toLowerCase()},</br>${data.country.toLowerCase()}`;
    const time = current.querySelector(".current-time");
    time.textContent = format(data.time, "EEE dd MMM yyyy HH:mm");
    const weatherIcon = current.querySelector(".current-weather > .icon");
    weatherIcon.src = getIcon(data.condition_code, data.isDay);
    const weatherCondition = current.querySelector(
      ".current-weather > .condition",
    );
    weatherCondition.textContent = data.condition_text.toLowerCase();
    const temp = current.querySelector(".current-weather > .temp");
    temp.textContent = `${data.temp}ºC`;

    const feelsLike = document.querySelector(".feels-like");
    feelsLike.textContent = `${data.feels_like}ºC`;
    // eslint-disable-next-line no-nested-ternary
    feelsLike.parentElement.style.setProperty('--width', `${data.feels_like + 5 > 100 ? 100 : data.feels_like + 5 < 0 ? 0 : data.feels_like + 5}%`);
    feelsLike.parentElement.querySelector('progress').setAttribute('value', data.feels_like);
    const humidity = document.querySelector(".humidity");
    humidity.textContent = `${data.humidity}%`;
    humidity.parentElement.querySelector('.mask').style.backgroundColor = `rgba(0, 0, 255, ${data.humidity / 100})`;
    const uvIndex = document.querySelector(".uv-index");
    uvIndex.textContent = data.uv_index;
    uvIndex.style.backgroundColor = getUVDescriptor(
      data.uv_index);
    uvIndex.parentElement.style.background = `repeating-conic-gradient(
      from 0deg,
      ${getUVDescriptor(data.uv_index)} 0deg 4deg,
      black 4deg 5deg,
      white 5deg 8deg,
      black 8deg 9deg
    )`
    const wind = document.querySelector(".wind");
    const windDeg = document.querySelector("#wind .arrow");
    windDeg.style.transform = `rotate(${data.wind_deg - 90}deg)`;
    wind.textContent = data.wind_kph;
    const precip = document.querySelector(".precip");
    precip.textContent = `${data.precip}mm`;
    document.querySelector('#precip > .water').style.height = `${15 + data.precip * 10}px`
    const cloud = document.querySelector(".cloud");
    cloud.textContent = `${data.cloud}%`;
    cloud.parentElement.style.setProperty('background-color', `rgba()`)
    document.querySelectorAll('#cloud svg path').forEach((svg) => {
      svg.style.setProperty('fill', `rgba(200, 200, 200, ${(data.cloud / 100) * 0.8})`);
    })

    let i = 0;
    const slides = [...document.querySelectorAll(".slide")];
    slides.forEach((slide) => {
      const day = slide.querySelector(".day");
      day.textContent = format(data.forecastday[i].date, "dd");
      const month = slide.querySelector(".month");
      month.textContent = format(data.forecastday[i].date, "MMM").toLowerCase();

      let j = 0;
      [...slide.querySelectorAll(".hour")].forEach((hour) => {
        const icon = hour.querySelector(".icon");
        icon.src = getIcon(
          data.forecastday[i].hour[j].condition_code,
          data.forecastday[i].hour[j].isDay,
        );
        const condition = hour.querySelector(".condition");
        condition.textContent =
          data.forecastday[i].hour[j].condition_text.toLowerCase();
        const temperature = hour.querySelector(".temp");
        temperature.textContent = `${data.forecastday[i].hour[j].temp}ºC`;
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
  console.log(forecast);
  const data = extractData(forecast);
  console.log(data);
  stopLoad();
  return data;
}

populatePage(getForecastData("etobicoke"));

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

function searchStr(e) {
  const index = e.target.getAttribute("data-index");
  searchCities(search.value).then((cities) => {
    populatePage(getForecastData(`${cities[index].lat},${cities[index].lon}`));
    form.reset();
  });
}

searchBtn.addEventListener("click", () => {
  document.querySelector('div.search-box').classList.add('empty');
  searchCities(search.value).then((cities) => {
    if (cities.length > 0) {
      const choice = cities[0];
      populatePage(getForecastData(`${choice.lat},${choice.lon}`));
      console.log(choice);
    } else {
      console.log("no options!");
    }
  });
  form.reset();
});

search.addEventListener("input", () => {
  const searchResults = document.querySelector("ul.search-results");
  searchResults.textContent = "";
  searchCities(search.value).then((cities) => {
    let index = 0;
    if (cities.length === 0) {
      document.querySelector('div.search-box').classList.add('empty');
    }
    cities.forEach((item) => {
      const city = document.createElement("li");
      city.classList.add("city-option");
      city.setAttribute("data-index", index);
      city.addEventListener("click", searchStr);
      city.textContent = item.region
        ? `${item.name}, ${item.region}, ${item.country}`
        : `${item.name}, ${item.country}`;
      searchResults.appendChild(city);
      document.querySelector('div.search-box').classList.remove('empty');
      index += 1;
    });
  });
});

search.addEventListener("focus", () => {
  const searchResults = document.createElement("ul");
  searchResults.classList.add("search-results");
  document.querySelector('div.search-box').appendChild(searchResults);
});

search.addEventListener("focusout", () => {
  const searchBoxes = document.querySelectorAll("ul.search-results");
  setTimeout(() => {
    searchBoxes.forEach((box) => {
      box.remove();
    })
    document.querySelector('div.search-box').classList.add('empty');
  }, 300);
});
