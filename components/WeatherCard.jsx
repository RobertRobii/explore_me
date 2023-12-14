import Image from "next/image";

import { weatherDescriptions } from "@utils/functions/weatherDescription";

const WeatherCard = ({
  country,
  cityName,
  weatherCode,
  currentTemperature,
  visibility,
  windSpeed,
  precipitationProbability,
}) => {
  return (
    <div className="rounded-12 glassmorphism text-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex">
          <p className="text-3xl">
            {country}, {cityName}
          </p>
        </div>
        <p className="text-xl text-black sm:text-3xl">
          {weatherDescriptions[weatherCode]}
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
              : weatherCode === 65 || weatherCode === 67 || weatherCode === 82
              ? "/assets/images/heavy-rain.png"
              : weatherCode === 71 ||
                weatherCode === 73 ||
                weatherCode === 75 ||
                weatherCode === 77
              ? "/assets/images/snow.png"
              : weatherCode === 85 || weatherCode === 86
              ? "/assets/images/snow-showers.png"
              : weatherCode === 95 || weatherCode === 96 || weatherCode === 99
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
  );
};

export default WeatherCard;
