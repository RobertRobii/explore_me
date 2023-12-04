"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

const City = ({ params }) => {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("@components/CustomMap"), {
        loading: () => (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                A map is loading
              </p>
              <img
                className="mx-auto my-4"
                src="/assets/images/loader.gif"
                alt="Loading"
              />
            </div>
          </div>
        ),
        ssr: false,
      }),
    []
  );

  const router = useRouter();

  const api = "https://geocoding-api.open-meteo.com/v1/search";

  const [data, setData] = useState();
  const [cityNotFound, setCityNotFound] = useState(false);
  const [weatherData, setWeatherData] = useState();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const [precipitationProbability, setPrecipitationProbability] =
    useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [visibility, setVisibility] = useState(null);

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}?name=${params.city}`);
        const res = await response.json();

        if (res.results && res.results.length > 0) {
          setData(res);
          setCityNotFound(false); // Reset state if city was found
        } else {
          setCityNotFound(true); //  Set state if city was not found
        }
      } catch (error) {
        console.log("Error fetching location data:", error);
        setCityNotFound(true); // Set state city was not found if error
      }
    };

    fetchData();
  }, [params.city]);

  const cityName = data && data.results[0].name;
  const latitude = data && data.results[0].latitude;
  const longitude = data && data.results[0].longitude;
  const country = data && data.results[0].country;

  const options = { timeZone: "Europe/Bucharest" };
  const formatter = new Intl.DateTimeFormat("en", options);
  const now = new Date();
  const timeZone = formatter.resolvedOptions().timeZone;

  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m&timeformat=unixtime&timezone=${timeZone}`;

  useEffect(() => {
    const fetchWeather = async () => {
      if (latitude && longitude) {
        const weatherResponse = await fetch(weatherApi);
        const weatherRes = await weatherResponse.json();
        console.log(weatherRes);
        setWeatherData(weatherRes);
      }
    };

    fetchWeather();
  }, [latitude, longitude, weatherApi]);

  useEffect(() => {
    if (weatherData) {
      let currentTime = Math.floor(Date.now() / 1000);

      // Find the corresponding index of the current time in the 'time' array
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
          "Nu s-a găsit temperatura, codul meteo, probabilitatea precipitatiilor, viteza vantului sau vizibilitatea pentru ora curentă."
        );
      }

      // Update current date
      let formattedDate = formatter.format(now);
      setCurrentDate(formattedDate);
    }
  }, [weatherData]);

  function getWeatherDescription(code) {
    switch (code) {
      case 0:
        return "Clear sky";
      case 1:
        return "Mainly clear";
      case 2:
        return "Partly cloudy";
      case 3:
        return "Overcast";
      case 45:
        return "Fog";
      case 48:
        return "Depositing rime fog";
      case 51:
        return "Drizzle: Light";
      case 52:
        return "Drizzle: moderate";
      case 55:
        return "Drizzle: dense intensity";
      case 56:
        return "Freezing Drizzle: Light";
      case 57:
        return "Freezing Drizzle: dense intensity";
      case 61:
        return "Rain: Slight";
      case 63:
        return "Rain: moderate ";
      case 65:
        return "Rain: heavy intensity";
      case 66:
        return "Freezing Rain: Light";
      case 67:
        return "Freezing Rain: heavy intensity";
      case 71:
        return "Snow fall: Slight";
      case 73:
        return "Snow fall: moderate";
      case 75:
        return "Snow fall: heavy intensity";
      case 77:
        return "Snow grains";
      case 80:
        return "Rain showers: Slight";
      case 81:
        return "Rain showers: moderate";
      case 82:
        return "Rain showers: violent";
      case 85:
        return "Snow showers slight";
      case 86:
        return "Snow showers heavy";
      case 95:
        return "Thunderstorm: Slight or moderate";
      case 96:
        return "Thunderstorm with slight";
      case 99:
        return "Thunderstorm with heavy hail";
    }
  }
  let weatherDescription = getWeatherDescription(weatherCode);

  const handleAddToFav = () => {
    addCityToFavorites(cityName);
    router.push("favorites");
  };

  return (
    <div>
      {cityNotFound ? (
        <p className="text-2xl font-bold orange_gradient">
          City not found. Please enter a valid city name.
        </p>
      ) : (
        <>
          <h1 className="small_head_text text-center">
            You searched for
            <span className="orange_gradient text-center"> {cityName}</span>
          </h1>

          <div className="map h-[400px]">
            <Map
              latitude={latitude}
              longitude={longitude}
              cityName={cityName}
              country={country}
            />
          </div>

          <button className="black_btn my-6" onClick={handleAddToFav}>
            Add {cityName} to Favorite list
          </button>

          <p>{currentTime}</p>

          <div className="rounded-12 glassmorphism text-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex">
                <p className="text-3xl">
                  {country}, {cityName}
                </p>
              </div>
              <p className="text-xl text-black sm:text-3xl">
                {weatherDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
              <p className="text-5xl font-semibold text-orange-600 pl-0 sm:pl-2">
                {Math.floor(currentTemperature)}°C
              </p>
              <Image
                src={
                  weatherCode === 0 || weatherCode === 1
                    ? "/assets/images/clear.png"
                    : weatherCode === 2
                    ? "/assets/images/partly-cloudy.png"
                    : weatherCode === 3
                    ? "/assets/images/overcast.png"
                    : weatherCode === 45 || weatherCode === 48
                    ? "/assets/images/fog.png"
                    : weatherCode === 51 ||
                      weatherCode === 53 ||
                      weatherCode === 55 ||
                      weatherCode === 56 ||
                      weatherCode === 57
                    ? "/assets/images/drizzle.png"
                    : weatherCode === 61 ||
                      weatherCode === 63 ||
                      weatherCode === 66 ||
                      weatherCode === 80 ||
                      weatherCode === 81
                    ? "/assets/images/rain.png"
                    : weatherCode === 65 ||
                      weatherCode === 67 ||
                      weatherCode === 82
                    ? "/assets/images/heavy-rain.png"
                    : weatherCode === 71 ||
                      weatherCode === 73 ||
                      weatherCode === 75 ||
                      weatherCode === 77
                    ? "/assets/images/snow.png"
                    : weatherCode === 85 || weatherCode === 86
                    ? "/assets/images/snow-showers.png"
                    : weatherCode === 95 ||
                      weatherCode === 96 ||
                      weatherCode === 99
                    ? "/assets/images/thunderstorm.png"
                    : "/assets/images/unknown.png"
                }
                alt="partly-cloudy"
                width={80}
                height={20}
                className="mr-0 sm:mr-6"
              ></Image>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-6 items-center">
              <div className="black_btn mb-4 sm:mb-0 w-[150px]">
                <Image
                  src="/assets/images/visibility.png"
                  alt="visibility"
                  width={20}
                  height={20}
                  className="mr-2"
                ></Image>
                {Math.floor(visibility / 1000)} km
              </div>
              <div className="black_btn mb-4 sm:mb-0 w-[150px]">
                <Image
                  src="/assets/images/precipitation.png"
                  alt="precipitation"
                  width={20}
                  height={20}
                  className="mr-2"
                ></Image>
                {precipitationProbability} %
              </div>
              <div className="black_btn mb-4 sm:mb-0 w-[150px]">
                <Image
                  src="/assets/images/wind.png"
                  alt="wind"
                  width={25}
                  height={20}
                  className="mr-2"
                ></Image>
                {windSpeed} km/h
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default City;
