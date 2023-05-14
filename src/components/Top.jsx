import { useState, useEffect } from 'react';
import dayjs from 'dayjs';



export default function Top() {
  const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
  const [ipData, setIpData] = useState(null);
  const [Weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm'));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchIpData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setIpData(data);
          fetchWeatherData(data.latitude, data.longitude);
        } else {
          throw new Error('Failed to fetch IP data');
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${import.meta.env.VITE_KEY_WAPI}`;
        const response = await fetch(weatherUrl);
        
        if (response.ok) {
          const weatherData = await response.json();
          setWeather({
            temp: weatherData.current.temp,
            weather : weatherData.current.weather.main
          })
          console.log(weatherData);
        } else {
          throw new Error('Failed to fetch weather data');
        }
      } catch (error) {
        console.error(error);
        // Display an error message to the user or handle the error in some other way
      }
    };
  
    fetchIpData();
  }, []);

  return (
    <div className='w-full h-full'>
      <div className="w-full h-full bg-transparent flex justify-center items-center ">
        <div className="rounded-lg">
          <h1 className='text-white font-bold text-[7em] text-center m-0 line leading-none'>{currentTime ? currentTime : ""}</h1>
          {ipData ? <p className="text-center text-lg">{ipData.ip}, {ipData.city}, {ipData.country_name}</p> : ""}
          {Weather ? <p>{Weather.temp}, {Weather.weather}</p> : ""}
        </div>
      </div>
    </div>
  )
} 