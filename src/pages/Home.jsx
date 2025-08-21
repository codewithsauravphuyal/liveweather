import React, { useState, useCallback, useEffect } from 'react';

const Home = () => {
    const [city, setCity] = useState('');
    const [inputCity, setInputCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [weatherError, setWeatherError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bgClass, setBgClass] = useState('bg-gradient-to-br from-blue-400 to-blue-600');

    const apiKey = "cb9d9d5187514134a6f61042252008";

    // Function to determine background based on weather condition
    const getWeatherBackground = (condition) => {
        if (!condition) return 'bg-gradient-to-br from-blue-400 to-blue-600';
        
        const conditionText = condition.toLowerCase();
        
        if (conditionText.includes('sunny') || conditionText.includes('clear')) {
            return 'bg-gradient-to-br from-yellow-300 to-orange-400';
        } else if (conditionText.includes('cloud') || conditionText.includes('overcast')) {
            return 'bg-gradient-to-br from-gray-400 to-gray-600';
        } else if (conditionText.includes('rain') || conditionText.includes('drizzle') || conditionText.includes('shower')) {
            return 'bg-gradient-to-br from-blue-500 to-blue-800';
        } else if (conditionText.includes('snow') || conditionText.includes('sleet') || conditionText.includes('ice')) {
            return 'bg-gradient-to-br from-blue-100 to-blue-300';
        } else if (conditionText.includes('thunder') || conditionText.includes('storm')) {
            return 'bg-gradient-to-br from-purple-700 to-gray-900';
        } else if (conditionText.includes('mist') || conditionText.includes('fog')) {
            return 'bg-gradient-to-br from-gray-300 to-gray-500';
        } else {
            return 'bg-gradient-to-br from-blue-400 to-blue-600';
        }
    };

    const fetchWeather = useCallback(async (searchCity) => {
        if (!searchCity) return;
        setLoading(true);
        setWeather(null);
        setForecast([]);
        setWeatherError(null);
        try {
            // Use forecast endpoint for 7 days
            const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(searchCity)}&days=7&aqi=no&alerts=no`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            const data = await response.json();
            
            const weatherData = {
                city: data.location.name,
                country: data.location.country,
                temp: data.current.temp_c,
                desc: data.current.condition.text,
                icon: data.current.condition.icon.startsWith("//") ? "https:" + data.current.condition.icon : data.current.condition.icon,
                humidity: data.current.humidity,
                wind: data.current.wind_kph,
            };
            
            setWeather(weatherData);
            // Extract forecast days
            setForecast(data.forecast?.forecastday || []);
            setWeatherError(null);
            
            // Update background based on weather condition
            setBgClass(getWeatherBackground(data.current.condition.text));
        } catch (error) {
            setWeatherError("Weather unavailable for this location.");
            setWeather(null);
            setForecast([]);
            setBgClass('bg-gradient-to-br from-blue-400 to-blue-600');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        setInputCity(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!inputCity.trim()) return;
        setCity(inputCity);
        fetchWeather(inputCity);
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-1000 ${bgClass}`}>
            <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-4xl">
                <div className='flex flex-col items-center'>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Weather Forecast</h1>
                    <p className="text-lg text-gray-600 mb-6 text-center">Get accurate weather updates for any location</p>
                    
                    <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-4 pr-12 rounded-xl text-gray-800 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter city name..."
                                value={inputCity}
                                onChange={handleInputChange}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                disabled={loading || !inputCity.trim()}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="w-full">
                        {weatherError && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
                                <p>{weatherError}</p>
                            </div>
                        )}
                        
                        {weather && (
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-semibold text-gray-800 mb-2">{weather.city}, {weather.country}</h2>
                                <div className="flex items-center justify-center mb-4">
                                    <img src={weather.icon} alt="weather icon" className="w-16 h-16 mr-3" />
                                    <span className="text-4xl font-bold text-gray-800">{weather.temp}°C</span>
                                </div>
                                <p className="text-xl text-gray-600 mb-3">{weather.desc}</p>
                                <div className="flex justify-center space-x-6 text-gray-700">
                                    <span>Humidity: {weather.humidity}%</span>
                                    <span>Wind: {weather.wind} kph</span>
                                </div>
                            </div>
                        )}
                        
                        {/* 7-day forecast */}
                        {forecast.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">7-Day Forecast</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {forecast.map((day) => (
                                        <div key={day.date} className="bg-white bg-opacity-70 rounded-xl p-3 flex flex-col items-center shadow-md">
                                            <span className="font-semibold text-gray-800 text-sm mb-1">
                                                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                            </span>
                                            <span className="text-xs text-gray-600 mb-2">
                                                {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <img 
                                                src={day.day.condition.icon.startsWith("//") ? "https:" + day.day.condition.icon : day.day.condition.icon} 
                                                alt="weather icon" 
                                                className="w-10 h-10 mb-2" 
                                            />
                                            <span className="text-lg font-bold text-gray-800">{day.day.avgtemp_c}°C</span>
                                            <div className="flex justify-between w-full mt-2 text-xs text-gray-600">
                                                <span>↑{day.day.maxtemp_c}°</span>
                                                <span>↓{day.day.mintemp_c}°</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {!weather && !weatherError && (
                            <div className="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                                <p className="text-gray-600">Enter a city name to see the weather forecast</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='mt-8 pt-6 border-t border-gray-200 border-opacity-30'>
                    <p className="text-gray-600 text-sm text-center">Powered by WeatherAPI.com</p>
                </div>
            </div>
        </div>
    );
};

export default Home;