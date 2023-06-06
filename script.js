const apiKey="8c10244f67d7470bd2857b1d764e6e32";
const timeEl=document.querySelector(".time");
const dateMonthEl=document.querySelector(".dateMonth");
const currentWeatherParentEl=document.querySelector(".currentWeatherParent");
const currentParentEl=document.querySelector(".currentParent");
const greetingMessageEl=document.querySelector(".greetingMessage");
const weatherForecastEl=document.querySelector(".weatherForecast");
const weatherForecastItemEl=document.querySelector(".weatherForecastItem");
const cityInputEl=document.querySelector(".cityInput");
const futureForecastEl=document.querySelector('.futureForecast');
const formEl=document.querySelector(".formInput");
const buttonShowMore=document.querySelector('.showFutureForecasts');
const buttonParent=document.querySelector(".buttonParent");
const backP=document.querySelector(".backP");
// let currentWeatherDetails=document.querySelector(".currentWeatherDetails");
//getting time and date using setInterval
const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const dayShort=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const months=['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
setInterval(()=>{
    const now=new Date();
    let hours=now.getHours();
    const ampm=hours>=12?'PM':'AM';
    hours=hours>=13?hours%12:hours;
    hours=hours<10?'0'+hours:hours;
    let minutes=now.getMinutes();
    minutes=minutes<10?'0'+minutes:minutes;
    const month=now.getMonth();
    const date=now.getDate();
    const day=now.getDay();
    timeEl.innerHTML=`${hours}:${minutes} <span id="ampm">${ampm}</span>`;
    dateMonthEl.innerHTML=`${days[day]},${date} ${months[month]}`;
},1000);
formEl.addEventListener("submit",(event)=>{
    event.preventDefault();
    const cityValue=cityInputEl.value;
    getWeatherData(cityValue);

})
// getWeatherData();
async function getWeatherData(cityValue){
  try{
    // navigator.geolocation.getCurrentPosition((success)=>{ 
    //   console.log(success);
    //   let {latitude,longitude}=success.coords;
      // console.log(latitude);
      const res2=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}`);
        if(res2.ok){
          const data2=await res2.json();
          console.log(data2);
          showCurrentTemp(data2);
      const res=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${apiKey}`);
      if(res.ok){
        const data=await res.json();
        console.log(data);
        //clearing the future forecast div for another search 
        weatherForecastEl.innerHTML="";
        showWeatherData(data);
        }else{
          weatherForecastEl.innerHTML="";
          // weatherForecastItemEl.style.backgroundColor="";
          throw new Error("Future Forecast couldn't be fetched!");
        }
      }else{
        throw new Error("Current Temperature couldn't be fetched.Please try again!");
     

    }
  }
    


  // }
//     const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`);
// if(!response.ok){
//     throw new Error("Network response error");
// }
// const data = await response.json();
// console.log(data);
// //fetching longitude and latitude using object destructuring
// let{lon,lat}=data.coord;
// console.log(lon);

    
   catch (err) {
    greetingMessageEl.innerHTML=`<h3>${err.message}</h3>`;
  }  

}
//function for converting fahrenheit to celcius
function convertTemp(temp){
  temp=Math.floor(temp-273.15);
  return temp;
}
//function for getting current temp
function showCurrentTemp(data2){
  const cityValue=cityInputEl.value;
  buttonShowMore.style.display="block";
  let{temp}=data2.main;
  let{description,main}=data2.weather[0];
  description=description.charAt(0).toUpperCase()+description.slice(1);
  temp=convertTemp(temp);
  greetingMessageEl.innerHTML=`<h2>Currently it's <span class="spanC"> ${temp}°C</span> and <span class="spanC"> ${description}</span></h2>`;
  let{feels_like,temp_min,temp_max,humidity}=data2.main;
  let {speed}=data2.wind;
  const unixTimestampSunset=data2.sys.sunset;
        const unixTimestampSunrise=data2.sys.sunrise;
        const setNrise=(unixTimestamp)=>{
            const date = new Date(unixTimestamp*1000);
        let hours=date.getHours();
        const ampm=hours>=12?"pm":"am";
        hours=hours%12;
        hours=hours?hours:12;
        hours=hours<10?'0'+hours:hours;
        let minutes=date.getMinutes();
        // if(minutes<10){
        //  minutes='0'+minutes;
        // }else{
        //     minutes=minutes;
        // }
        minutes=minutes<10?'0'+minutes:minutes;
        const time=hours+ ':'+minutes + " "+ ampm;
        return time;
        }
        const sunset=setNrise(unixTimestampSunset);
        const sunrise=setNrise(unixTimestampSunrise);
  currentWeatherParentEl.innerHTML=`<div class="currentWeatherItem">
  <div>Humidity</div>
  <div class="bold">${humidity}%</div>
</div>
<div class="currentWeatherItem">
  <div>Feels Like</div>
  <div class="bold">${convertTemp(feels_like)}°C</div>
</div>
<div class="currentWeatherItem">
  <div>Weather Outside</div>
  <div class="bold">${main}</div>
</div>
<div class="currentWeatherItem">
  <div>Wind Speed</div>
  <div class="bold">${speed}m/s</div>
</div>
<div class="currentWeatherItem">
  <div>Sunrise :<span class="bold"> ${sunrise} </span></div>
  <div>Sunset
   :<span class="bold"> ${sunset} </span></div>
  
</div>`;
currentParentEl.style.display="flex";
weatherForecastEl.style.display="none";
backP.style.display="none";
}
//function for show Future Forecasts 
function showMore(){
  buttonShowMore.style.display="none";
  currentParentEl.style.display="none";
  backP.style.display="block";
  weatherForecastEl.style.display="flex";
  // weatherForecastItemEl.style.backgroundColor="rgba(45, 190, 198, 0.5) ";
  
}
//go Back function
function goBackf(){
  buttonShowMore.style.display="flex";
  currentParentEl.style.display="block";
  backP.style.display="none";
  weatherForecastEl.style.display="none";
  // weatherForecastItemEl.style.backgroundColor="";
} 

//function for getting future forecast for 5 days per 3 hours
function showWeatherData(data){
 
  //   let {name}=data.city;
  // greetingMessageEl.innerHTML=`<h1>Weather in ${name}</h1>`;
  
// weatherForecastEl.style.display="none";
// futureForecastEl.style.backgroundColor=" ";
// currentWeatherParentEl.style.backgroundColor="rgba(119, 114, 114,0.5)";
data.list.map((element) => {
  // console.log(element.weather[0].description);
  // const now = new Date(element.dt*1000);
  const durationEl=new Date(element.dt_txt);
  let duration=durationEl.getHours();
  let ampm=duration>=12?"pm":'am';
  duration=duration>13?duration%12:duration;
  duration=duration?duration:12;
  duration=duration<10?'0'+duration:duration;
  // console.log(duration.getHours());
  let monthsEl=durationEl.getMonth();
  monthsEl=months[monthsEl];
  // console.log(now.getDate());
  // console.log(element.clouds.);
  const icon=element.weather[0].icon;
  const minTemp=element.main.temp_min;
  const minTempC=convertTemp(minTemp);
  const maxTemp=element.main.temp_max;
  const maxTempC=convertTemp(maxTemp);
  // futureForecastEl.style.backgroundColor="rgba(189, 183, 107,0.7)";
  weatherForecastEl.innerHTML+=`<div class="weatherForecastItem">
  <div class="day">${durationEl.getDate()}${monthsEl}</div>
  <div class="duration">${duration} ${ampm}</div>
  <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
  <div class="temp">Min Temp:<span class="bold"> ${minTempC} &#176C </span></div>
  <div class="temp">Max Temp: <span class="bold">${maxTempC} &#176C </span></div>
</div>`;

});
  
    
}




