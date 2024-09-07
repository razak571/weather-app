import { useEffect, useRef, useState } from "react";
import conf from "../conf/conf";
import "./Weather.css";
import {
  search,
  cloud,
  drizzle,
  humidity,
  rain,
  snow,
  wind,
  clear,
} from "../assets/index";
import { useQuery } from "@tanstack/react-query";

const Weather = () => {
  const [city, setCity] = useState("mumbai"); // Default city
  const inputRef = useRef();
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [highlightedFields, setHighlightedFields] = useState({});

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const fetchWeather = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${conf.apiKey}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    inputRef.current.value = "";
    // return response.json();

    // Simulate random changes in temperature and humidity
    const data = await response.json();
    data.main.temp += Math.random() > 0.5 ? 1 : -1;
    data.main.humidity += Math.floor(Math.random() * 5) - 2;

    return data;
  };

  const { data, isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    staleTime: 5000,
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 min demonstra
  });

  useEffect(() => {
    if (data) {
      const newHighlightedFields = {};
      if (Math.abs(data.main.temp - (data.main.temp | 0)) > 0.5) {
        newHighlightedFields.temperature = true;
      }
      if (data.main.humidity % 5 === 0) {
        newHighlightedFields.humidity = true;
      }
      setHighlightedFields(newHighlightedFields);
      setLastUpdateTime(new Date(dataUpdatedAt));

      // Clear highlights after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedFields({});
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, dataUpdatedAt]);

  const searchWeather = () => {
    const city = inputRef.current.value;
    if (city) {
      setCity(city);
    } else {
      alert("Enter City Name");
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search City" />
        <img onClick={searchWeather} src={search} alt="search-icon" />
      </div>
      {isLoading ? (
        <span className="loading">Loading...</span>
      ) : error ? (
        <span className="error">Error: {error.message}</span>
      ) : data ? (
        <>
          <img
            src={allIcons[data.weather[0].icon] || clear}
            alt="weather-icon"
            className="weather-icon"
          />
          <p
            className={`temperature ${
              highlightedFields.temperature ? "highlight" : ""
            }`}
          >
            {Math.floor(data.main.temp)}⁰c
          </p>
          <p className="location">{data.name} </p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="humidity-icon" />
              <div>
                <p className={highlightedFields.humidity ? "highlight" : ""}>
                  {data.main.humidity} %
                </p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind} alt="wind-icon" />
              <div>
                <p> {data.wind.speed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
          <p className="last-update">
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default Weather;
