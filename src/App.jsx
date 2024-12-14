import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LucideThermometer,
  LucideThermometerSun,
  LucideWind,
  LucideLeaf,
  LucideDroplet,
  LucideCircleGauge,
} from "lucide-react";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [alert, setAlert] = useState("");

  const convertWindSpeedToKm = (windspeed) => {
    return windspeed * 3.6;
  };

  const getAirPollutionState = (airPollution) => {
    switch (airPollution) {
      case 1:
        return "Boa";
      case 2:
        return "Razoável";
      case 3:
        return "Moderado";
      case 4:
        return "Ruim";
      case 5:
        return "Muito ruim";
      default:
        return "Erro.";
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const cityName = "João Pessoa, BR";
      const apiKey = import.meta.env.VITE_API_KEY;

      if (!cityName) {
        setAlert("Você precisa digitar uma cidade.");
        return;
      }

      try {
        // Weather Information
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
            cityName
          )}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        // Air Pollution Information
        const airPollutionResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=-7.115&lon=-34.8631&appid=${apiKey}`
        );

        if (weatherResponse.data && airPollutionResponse.data.list) {
          const weatherJson = weatherResponse.data;
          const airPollutionJson = airPollutionResponse.data;

          setWeatherData({
            city: weatherJson.name,
            country: weatherJson.sys.country,
            temp: weatherJson.main.temp,
            tempMax: weatherJson.main.temp_max,
            pressure: weatherJson.main.pressure,
            description: weatherJson.weather[0].description,
            tempIcon: weatherJson.weather[0].icon,
            windSpeed: convertWindSpeedToKm(weatherJson.wind.speed),
            humidity: weatherJson.main.humidity,
            airPollution: airPollutionJson.list[0].main.aqi,
          });

          // Humidity alert
          if (weatherJson.main.humidity > 70) {
            setAlert(
              "Umidade acima de 70% pode ser um indicativo de chuva próxima"
            );
          }
        } else {
          setAlert(`<img src="/src/images/undraw_void_-3-ggu.svg"/>`);
        }
      } catch (error) {
        setAlert(
          "Erro ao buscar dados da API. Por favor, tente novamente mais tarde."
        );
        console.error("Erro na requisição da API:", error);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weatherData) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <div className=" md:w-3/4 md:h-3/4 p-6 rounded-xl flex flex-col justify-center items-center md:space-y-12">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-black md:text-6xl">
            {weatherData.city}, {weatherData.country}
          </h1>
          <img
            className="size-48"
            src={`https://openweathermap.org/img/wn/${weatherData.tempIcon}@2x.png`}
            alt={weatherData.description}
          />
          <p className="text-md font-semibold text-gray-400 capitalize">
            {weatherData.description}
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-2">
            {/* Temperatura Atual */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-rose-400 flex justify-center items-center gap-2">
              <LucideThermometer />
              <p className="md:text-2xl font-bold">
                {weatherData.temp.toFixed(1).toString().replace(".", ",")}{" "}
                <sup>Cº</sup>
              </p>
            </div>

            {/* Temperatura Máxima */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-red-500 flex justify-center items-center gap-2">
              <LucideThermometerSun />
              <p className="md:text-2xl font-bold">
                {weatherData.tempMax.toFixed(1).toString().replace(".", ",")}{" "}
                <sup>Cº</sup>
              </p>
            </div>

            {/* Velocidade do Vento */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-lime-300 flex justify-center items-center gap-2">
              <LucideWind />
              <p className="md:text-2xl font-bold">
                {weatherData.windSpeed.toFixed(1)} km/h
              </p>
            </div>

            {/* Umidade */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-blue-400 flex justify-center items-center gap-2">
              <LucideDroplet />
              <p className="md:text-2xl font-bold">{weatherData.humidity}%</p>
            </div>

            {/* Poluição do Ar */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-emerald-400 flex justify-center items-center gap-2">
              <LucideLeaf />
              <p className="md:text-2xl font-bold">
                {getAirPollutionState(weatherData.airPollution)}
              </p>
            </div>

            {/* Pressão */}
            <div className="w-36 md:w-64 h-24 rounded-md bg-gray-200 flex justify-center items-center gap-2">
              <LucideCircleGauge />
              <p className="md:text-2xl font-bold">
                {weatherData.pressure} mbar
              </p>
            </div>
          </div>
        </div>

        {/* Resumo do Clima */}
        {alert && <div className="text-lime-400">{alert}</div>}
      </div>
      <footer className="w-full mt-12 flex justify-center items-center">
        <p className="text-gray-400">Made with love by @feapolina</p>
      </footer>
    </main>
  );
}
