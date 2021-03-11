import "./../node_modules/spin.js/spin.css";
import "./../sass/styles.scss";
import { Spinner } from "spin.js";

let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelectorAll(".loading-overlay")[0]);

//----------Cities
class CookieManager {
  setupCookie(name, value, days){
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" +date.toGMTString();
    document.cookie = name + value + expires;
  }
  retrieveCookie(name){
    if (document.cookie === "") return undefined;
    let value;
    let cookieArray = document.cookie.split(";");
    cookieArray = cookieArray.map(cookie => cookie.trim());
    cookieArray.forEach(cookie => {
        if (cookie.split("=")[0] == name) {
            value = cookie.split("=")[1];
        }    
    });
    return value;

  }
}
const SOURCE_CITIES = "http://localhost:5000/cities.xml";
let xmlhttp;
let citiesXML;
let citiesCount;
let btnClicked;
let loadingOverlay;
//-----------Weather
let xmlhttp_weather;
let sun_info;
let hitWeatherURL;
let weatherXML;
let cookieManager = null;
let p_sun;
let p_sun2;
let p_temp;
let p_temp2;
let p_temp3;
let p_humid;
let p_air;
let p_wind;
let clouds;
let locationDiv;
// ----------------------------------------------------------------------
//
function onLoaded(e) {
  if (xmlhttp.status == 200){
      citiesXML = xmlhttp.responseXML;
      citiesCount = citiesXML.getElementsByTagName("city").length;
      fillDropDown();
  } else {
      onError(); 
  }
}

function onError(e) {
  offOverLay();
  cityNotFound();
  
  console.log("ERROR : Problemo with URL");
}

function saveData(url) {
    cookieManager.setupCookie("url",url,365);
    console.log("cookies saved");
  }

function toggleOverlay() {
    document.getElementsByTagName('BODY')[0].style.color = "grey";
    loadingOverlay.style.display = "block";
}

function offOverLay(){
  document.getElementsByTagName('BODY')[0].style.color = "whitesmoke";
  loadingOverlay.style.display = "none";
}
// ------------------------------------------------------- main method
function main() {
  
  cookieManager = new CookieManager();
  // saving cookies
  if (hitWeatherURL == null){  
      saveData();
  } else {
      hitWeatherURL = cookieManager.retrieveCookie("url");
      console.log("cookies retrieved");
  }
  //-------------loading screen
  loadingOverlay = document.querySelectorAll(".loading-overlay")[0];

  //--------------- request for xml cities data
  xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", onLoaded);
  xmlhttp.addEventListener("error", onError);
  xmlhttp_weather = new XMLHttpRequest();
  xmlhttp.open("GET", SOURCE_CITIES, true);
  xmlhttp.send();
  
  //--------------- getting elements by ids
  sun_info = document.getElementById("1sun");
  btnClicked = document.getElementById("myBtn");
  p_sun = document.getElementById("psun");
  p_sun2 = document.getElementById("psun1");
  p_temp = document.getElementById("celsImg1");
  p_temp2 = document.getElementById("celsImg2");
  p_temp3 = document.getElementById("celsImg3");
  p_humid = document.getElementById("phumid");
  p_air = document.getElementById("pair");
  p_wind = document.getElementById("pwind");
  clouds = document.getElementById("clouds");
  locationDiv = document.getElementById("location");
  
  
} 
//--------------------- if city does not exist in options or error
function cityNotFound(){
  p_sun.innerHTML = "Unknown";
  p_sun2.innerHTML = "Unknown";
  p_temp.innerHTML = "Unknown";
  p_humid.innerHTML = "Unknown";
  p_air.innerHTML = "Unknown";
  p_wind.innerHTML = "Unknown";
  clouds.innerHTML = "Unknown";
  locationDiv.innerHTML = "City Not Found";
  
  
}
//---------------------fill the options with cities.xml
function fillDropDown(){
  for (let i=0;i<citiesCount;i++){
    btnClicked[btnClicked.length] = new Option(citiesXML.getElementsByTagName("name")[i].textContent + ", " + citiesXML.getElementsByTagName("province")[i].textContent);
    btnClicked.addEventListener("change",loadCityData);
  }
}

//----------------------- load the weather data for selected city
function loadCityData(e){
  toggleOverlay();
  hitWeatherURL = ("http://api.openweathermap.org/data/2.5/weather?q=" + btnClicked.value + ",CA&mode=xml&appid=e95b4464d268bec7b44949a230d658bb");
  saveData(hitWeatherURL);
  
  xmlhttp_weather.addEventListener("load", loadWeather);
  xmlhttp_weather.addEventListener("error", onError);

  xmlhttp_weather.open("GET", hitWeatherURL, true);
  xmlhttp_weather.send();
  locationDiv.innerHTML = btnClicked.value;
}
//--------------------- get weather data from url
function loadWeather(e){
  
  if (xmlhttp_weather.status == 200) {
    weatherXML = xmlhttp_weather.responseXML;
    console.log(weatherXML);
    populateWeather();
} else {
    onError();
}
}
  
function populateWeather(){
  //-----------------for sun set and rise
 
  let sunXML = weatherXML.getElementsByTagName("sun")[0];
    let sunRise = sunXML.getAttribute('rise');
    let sunSet = sunXML.getAttribute('set');
   
    p_sun2.innerHTML= new Date(sunRise).toLocaleString();
    p_sun.innerHTML = new Date(sunSet).toLocaleString();

    //----------------------temperatures
  
    let tempXML = weatherXML.getElementsByTagName("temperature")[0];
    let tempCurrent = tempXML.getAttribute('value');
    let tempCur_Cel = tempCurrent - 273.15;

    let tempMin = tempXML.getAttribute('min');
    let tempMin_Cel = tempMin - 273.15;
    
    let tempMax = tempXML.getAttribute('max');
    let tempMax_Cel = tempMax - 273.15;
    
    p_temp.innerHTML = (" " + tempCur_Cel.toFixed()+ " Current");
    p_temp2.innerHTML = (" " + tempMin_Cel.toFixed() +" Low");
    p_temp3.innerHTML = (" " + tempMax_Cel.toFixed() + " High");
    //---------------------humidity
    let humidDiv = document.getElementById("humid");
    
    humidDiv.appendChild(p_humid);

    let humidXML = weatherXML.getElementsByTagName("humidity")[0];
    let humidValue = humidXML.getAttribute('value');
    let humidUnit = humidXML.getAttribute('unit');
    
    p_humid.innerHTML = (humidValue + humidUnit);

    //---------------------Air Pressure
    let airDiv = document.getElementById("air");
    
    airDiv.appendChild(p_air);

    let airXML = weatherXML.getElementsByTagName("pressure")[0];
    let airPress = airXML.getAttribute('value');
    let airUnit = airXML.getAttribute('unit');
    
    p_air.innerHTML = (airPress + airUnit);

    //---------------------Wind
  
    let windXML = weatherXML.getElementsByTagName("speed")[0];
    let windSpeed = windXML.getAttribute('value');
    let windSpeed_Kmh = windSpeed * 3.60;
    
    let windName = windXML.getAttribute('name');

    let windDirXML = weatherXML.getElementsByTagName("direction")[0];
    let windDirName = windDirXML.getAttribute('name');
    
    let windDirCode = windDirXML.getAttribute('code');
    let windImage = document.getElementById('compass');
    let x = windDirCode.toLowerCase();
    let y = "wi wi-wind wi-towards-";
    
    windImage.className = y + x;
    
    p_wind.innerHTML = (windDirName + "<br>" + windName + "<br>" + windSpeed_Kmh.toFixed()+ " Km/h Speed");
    
    //-----------------foreCast
    
    let foreCastXML = weatherXML.getElementsByTagName("weather")[0];
     console.log(foreCastXML.getAttribute("number"));
     clouds.className = "wi wi-owm-" + foreCastXML.getAttribute("number");
     clouds.innerHTML = foreCastXML.getAttribute("value");
     
     
    offOverLay();
}
main();

