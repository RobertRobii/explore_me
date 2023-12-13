import { useState, useEffect } from "react";

export const useWeather = (latitude, longitude) => {
  const [weatherData, setWeatherData] = useState();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const [precipitationProbability, setPrecipitationProbability] =
    useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [visibility, setVisibility] = useState(null);

  const options = { timeZone: "Europe/Bucharest" };
  const formatter = new Intl.DateTimeFormat("en", options);
  const timeZone = formatter.resolvedOptions().timeZone;
  const now = new Date();

  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m&timeformat=unixtime&timezone=${timeZone}`;

  useEffect(() => {
    const fetchWeather = async () => {
      if (latitude && longitude) {
        const weatherResponse = await fetch(weatherApi);
        const weatherRes = await weatherResponse.json();
        setWeatherData(weatherRes);
      }
    };

    fetchWeather();
  }, [latitude, longitude, weatherApi]);

  useEffect(() => {
    if (weatherData) {
      let currentTime = Math.floor(Date.now() / 1000);

      // Find the corresponding index of the current time in the 'time' array returned by the api
      let currentIndex = -1;
      for (let i = 0; i < weatherData.hourly.time.length; i++) {
        if (weatherData.hourly.time[i] > currentTime) {
          currentIndex = i;
          break;
        }
      }

      // Check if the index is found and update the temperature for the current hour
      if (currentIndex !== -1) {
        let temperature = weatherData.hourly.temperature_2m[currentIndex];
        setCurrentTemperature(temperature);

        // Update the weather code for the current temperature
        let weatherCode = weatherData.hourly.weather_code[currentIndex];
        setWeatherCode(weatherCode);

        // Update the precipitation probability for the current temperature
        let precipitationProbability =
          weatherData.hourly.precipitation_probability[currentIndex];
        setPrecipitationProbability(precipitationProbability);

        // Update the wind speed at 10 meters for the current temperature
        let windSpeed = weatherData.hourly.wind_speed_10m[currentIndex];
        setWindSpeed(windSpeed);

        // Update the visibility for the current visibility
        let visibility = weatherData.hourly.visibility[currentIndex];
        setVisibility(visibility);
      } else {
        console.log(
          "Not found: temperature, weather code, precipitation probability, wind speed, or visibility for the current time."
        );
      }

      // Update current date
      let formattedDate = formatter.format(now);
      setCurrentDate(formattedDate);
    }
  }, [weatherData]);

  return {
    currentDate,
    currentTemperature,
    weatherCode,
    precipitationProbability,
    windSpeed,
    visibility,
  };
};
