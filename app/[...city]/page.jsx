"use client";

import React from "react";
import { useState, useEffect } from "react";

import dynamic from "next/dynamic";

import MapLoader from "@components/MapLoader";
import WeatherCard from "@components/WeatherCard";

import { useWeather } from "@utils/functions/weather";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const City = ({ params }) => {
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
  const [cityRemovedMessage, setCityRemovedMessage] = useState(null);

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

  const handleRemoveFromFav = async () => {
    try {
      const response = await fetch(`/api/favorites/${cityName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(
          `Failed to remove ${cityName} from favorites. Status: ${response.status}`
        );
      } else {
        const result = await response.json();

        const message = result.success
          ? result.isNew
            ? `${cityName} removed from favorite list!`
            : `${cityName} is not in your favorite list!`
          : "Error while removing from favorite list!";

        setCityRemovedMessage(message);

        if (message === `${cityName} removed from favorite list!`) {
          toast.success(message);
        } else if (message === `${cityName} is not in your favorite list!`) {
          toast.info(message);
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  //  TOAST NOTIFICATION
  const contextClass = {
    success: "bg-gray-200",
    info: "bg-gray-200",
    error: "bg-red-600",
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
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer w-[300px]"
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

          <div className="flex flex-col sm:flex-row justify-between">
            <button className="black_btn my-6" onClick={handleAddToFav}>
              Add {cityName} to Favorite list
            </button>
            <button className="black_btn my-6" onClick={handleRemoveFromFav}>
              Delete {cityName} from Favorite list
            </button>
          </div>

          <WeatherCard
            country={country}
            cityName={cityName}
            weatherCode={weatherCode}
            currentTemperature={currentTemperature}
            precipitationProbability={precipitationProbability}
            windSpeed={windSpeed}
            visibility={visibility}
          />
        </>
      )}
    </div>
  );
};

export default City;
