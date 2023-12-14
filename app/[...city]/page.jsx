"use client";

import React from "react";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";

import MapLoader from "@components/MapLoader";

import { weatherDescriptions } from "@utils/functions/weatherDescription";
import { useWeather } from "@utils/functions/weather";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const City = ({ params }) => {
  const router = useRouter();
  const [data, setData] = useState();
  const [cityNotFound, setCityNotFound] = useState(false);

  const api = "https://geocoding-api.open-meteo.com/v1/search";

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

  const cityName = data?.results[0].name;
  const latitude = data?.results[0].latitude;
  const longitude = data?.results[0].longitude;
  const country = data?.results[0].country;

  const {
    currentTemperature,
    weatherCode,
    precipitationProbability,
    windSpeed,
    visibility,
  } = useWeather(latitude, longitude);

  const [cityAddedMessage, setCityAddedMessage] = useState(null);

  const handleAddToFav = async () => {
    try {
      const response = await fetch(`/api/favorites/${cityName}`, {
        method: "POST",
      });

      if (!response.ok) {
        console.error(
          `Failed to add ${cityName} to favorites. Status: ${response.status}`
        );
      } else {
        const result = await response.json();

        // Verify if the city was added now or already added
        const message = result.success
          ? result.isNew
            ? `${cityName} added to favorite list!`
            : `${cityName} already added to favorite list!`
          : "Error while adding to favorite list!";

        setCityAddedMessage(message);

        if (message === `${cityName} added to favorite list!`) {
          toast.success(message);
        } else if (message === `${cityName} already added to favorite list!`) {
          toast.info(message);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  //  TOAST NOTIFICATION
  const contextClass = {
    success: "bg-gray-200",
    info: "bg-gray-200",
    error: "bg-red-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
  };

  const Map = React.useMemo(
    () =>
      dynamic(() => import("@components/CustomMap"), {
        loading: MapLoader,
        ssr: false,
      }),
    []
  );

  return (
    <div>
      <ToastContainer
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        bodyClassName={() => "text-sm text-black font-inter font-med block p-3"}
      />

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
