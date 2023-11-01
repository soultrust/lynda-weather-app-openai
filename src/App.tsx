import { useEffect, useState } from "react";
import "./App.css";
import useApiRequests, { UnitsType } from "./components/useApiRequests";
import WeatherForm from "./components/WeatherForm";
import WeatherCard from "./components/WeatherCard";
import Description from "./components/Description";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [units, setUnits] = useState<UnitsType>("metric");
  const [weatherDataLoading, setWeatherDataLoading] = useState<boolean>(false);
  const [weatherDescriptLoading, setWeatherDescriptLoading] =
    useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Custom hook to handle API requests. Fires when prompt changes.
  const { error, promptData, locationData, weatherData, weatherDescription } =
    useApiRequests(prompt);

  // Set error message if error is returned from API request.
  useEffect(() => {
    if (error) {
      setErrorMsg(error);
      setWeatherDataLoading(false);
    }
  }, [error]);

  // Set weatherDataLoading to false when weatherData is returned from API request.
  useEffect(() => {
    if (weatherData) {
      setWeatherDataLoading(false);
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherDescription) {
      setWeatherDescriptLoading(false);
    }
  }, [weatherDescription]);

  useEffect(() => {
    if (promptData && promptData.units) {
      setUnits(promptData.units);
    }
  }, [promptData]);

  // Handle form submission. Set prompt to user input.
  const handleSubmit = (newPrompt) => {
    setErrorMsg("");
    setWeatherDataLoading(true);
    setWeatherDescriptLoading(true);
    setPrompt(newPrompt);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="page-title">Current Weather</h1>
        <WeatherForm onSubmit={handleSubmit} />
        {error && <p className="error">{errorMsg.message}</p>}
        {weatherDescription ? (
          <Description
            isLoading={weatherDescriptLoading}
            weatherDescription={weatherDescription}
          />
        ) : (
          <Description isLoading={weatherDescriptLoading} />
        )}
      </header>
      <main className="main-content">
        {weatherData.name && !errorMsg ? (
          <WeatherCard
            isLoading={weatherDataLoading}
            data={weatherData}
            units={units}
            country={promptData.country}
            USstate={locationData[0].state}
            setUnits={setUnits}
          />
        ) : (
          <WeatherCard isLoading={weatherDataLoading} setUnits={setUnits} />
        )}
      </main>
    </div>
  );
}

export default App;
