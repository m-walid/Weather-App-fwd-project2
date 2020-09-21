/* Global Variables */
const owURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const owApiKey = "&appid=e9f9c55f34c7d07a8e5082f80abd547b&units=metric";

const generateBtn = document.querySelector("#generate");
const dateElm = document.querySelector("#date");
const tempElm = document.querySelector("#temp");
const feelsElm = document.querySelector("#content");
const cityElm = document.querySelector("#city");
const zipCodeInput = document.querySelector("#zip");
const feelsInput = document.querySelector("#feelings");
const errElm = document.querySelector("#err-msg");

// Create a new date instance dynamically with JS
generateBtn.addEventListener("click", getWeather);

function getWeather(e) {
  e.preventDefault();
  const zipCode = zipCodeInput.value.trim();
  const feelings = feelsInput.value;
  //get weather from OWM API
  getData(owURL + zipCode + owApiKey).then((data) => {
    if (!data.main) {
      showError("Please enter a valid US zipcode");
    } else {
      const postedData = {
        date: getDate(),
        temp: data.main.temp + "°C",
        feelings,
        city: data.name,
      };
      //post data
      postData("/data", postedData).then(() => {
        //get data from local
        getData("/data")
          .then((receivedData) => {
            //update UI
            updateUI(receivedData);
          })
          .catch(() => showError("something wrong happened!"));
      });
    }
  });
}

async function getData(url) {
  const res = await fetch(url);
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    showError("error connecting to the local server");
  }
}

async function postData(url, postData) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  try {
    const data = await res.json();
    return data;
  } catch (err) {
    showError("error connecting to the local server");
  }
}

function getDate() {
  let d = new Date();
  return (newDate = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear());
}

function updateUI(data) {
  dateElm.innerText = data.date;
  tempElm.innerText = data.temp;
  feelsElm.innerText = data.feelings;
  cityElm.innerText = data.city;
}

function showError(msg) {
  errElm.style.display = "block";
  errElm.innerText = msg;
  setTimeout(() => (errElm.style.display = "none"), 5000);
}
