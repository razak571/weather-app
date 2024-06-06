import React, { useRef, useState } from "react";
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
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
  });

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
          <p className="temperature">{Math.floor(data.main.temp)}⁰c </p>
          <p className="location">{data.name} </p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="humidity-icon" />
              <div>
                <p>{data.main.humidity} %</p>
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
        </>
      ) : null}
    </div>
  );
};

export default Weather;

//===============old code========
// import React, { useEffect, useRef, useState } from "react";
// import conf from "../conf/conf";
// import "./Weather.css";
// import {
//   search,
//   clear,
//   cloud,
//   drizzle,
//   humidity,
//   rain,
//   snow,
//   wind,
// } from "../assets/index";
// import { useQuery } from "@tanstack/react-query";
// // import axios from "axios";

// const Weather = () => {
//   const [wetherData, setwetherData] = useState(false);
//   const inputRef = useRef();
// //   const [error, setError] = useState(false);

//   const allIcons = {
//     "01d": clear,
//     "01n": clear,
//     "02d": cloud,
//     "02n": cloud,
//     "03d": cloud,
//     "03n": cloud,
//     "04d": drizzle,
//     "04n": drizzle,
//     "09d": rain,
//     "09n": rain,
//     "10d": rain,
//     "10n": rain,
//     "13d": snow,
//     "13n": snow,
//   };

//   //   const searchWeather = async (city) => {
//   //     setError(false);
//   //     if (city === "") {
//   //       // console.log('al1')
//   //       alert("Enter City Name");
//   //       return;
//   //     }
//   //     try {
//   //       const response = await axios.get(
//   //         `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${conf.apiKey}`
//   //       );

//   //       const data = response.data;
//   //       //   console.log("data::::", data);
//   //       // if (!response.ok) {
//   //       //     console.log('al2')
//   //       //   alert(data.message);
//   //       //   return;
//   //       // }

//   //       //   console.log("data:::", data);
//   //       const icon = allIcons[data.weather[0].icon] || clear;
//   //       setwetherData({
//   //         humidity: data.main.humidity,
//   //         windSpeed: data.wind.speed,
//   //         temperature: Math.floor(data.main.temp), //oly integer value
//   //         location: data.name,
//   //         icon: icon,
//   //       });
//   //       inputRef.current.value = "";
//   //     } catch (error) {
//   //       console.log("Error in fetching weather data");
//   //       setwetherData(false);
//   //       setError(true);
//   //     }
//   //   };

//   //   console.log("wetherData::", wetherData);

//   //   useEffect(() => {
//   //     searchWeather("bangalore");
//   //   }, []);

// const {data, isLoading, error} = useQuery({
//     queryKey: ['weather'],
//     queryFn: () => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${conf.apiKey}`).then(res => res.json())
// })

// if (isLoading) return <span>Loading...</span>
// if (error) return <span>Tanstack Error:: {error.message} </span>

// console.log("data from tanstact query::", data)

//   return (
//     <div className="weather">
//       <div className="search-bar">
//         <input ref={inputRef} type="text" placeholder="Search City" />
//         <img
//           onClick={() => searchWeather(inputRef.current.value)}
//           src={search}
//           alt="search-icon"
//         />
//       </div>
//       {/* {error ? <h6 className="dummy">Error fetching wether data....</h6> : null} */}
//       {wetherData ? (
//         <>
//           <img
//             src={wetherData.icon}
//             alt="weather-icon"
//             className="weather-icon"
//           />
//           <p className="temperature">{wetherData.temperature}⁰c </p>
//           <p className="location">{wetherData.location} </p>
//           <div className="weather-data">
//             <div className="col">
//               <img src={humidity} alt="humiditity-icon" />
//               <div>
//                 <p>{wetherData.humidity} %</p>
//                 <span>Humidity</span>
//               </div>
//             </div>
//             <div className="col">
//               <img src={wind} alt="wind-icon" />
//               <div>
//                 <p> {wetherData.windSpeed} Km/h</p>
//                 <span>Wind Speed</span>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// };

// export default Weather;
