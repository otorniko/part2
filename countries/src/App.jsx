import axios from "axios"
import { useEffect, useState } from "react"

const API_KEY = import.meta.env.VITE_API_KEY
const baseURL = "https://restcountries.com/v3.1/"
const WeatherURL = "https://api.openweathermap.org/data/2.5/weather?"

const getWeather = ({ cityName }) => {
    return axios
        .get(`${WeatherURL}q=${cityName}&units=metric&appid=${API_KEY}`)
        .then((response) => {
            if (response.status === 200) {
                return response.data
            } else {
                throw new Error("Error fetching weather data.")
            }
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error)
            return null
        })
}

const degToCompass = (deg) => {
    const val = Math.floor(deg / 22.5 + 0.5)
    const arr = [
        "North",
        "NNE",
        "NE",
        "ENE",
        "East",
        "ESE",
        "SE",
        "SSE",
        "South",
        "SSW",
        "SW",
        "WSW",
        "West",
        "WNW",
        "NW",
        "NNW",
    ]
    return arr[val % 16]
}

const Weather = ({ cityName }) => {
    const [weather, setWeather] = useState({
        main: { temp: 0 },
        wind: { speed: 0 },
        weather: [{ description: "" }],
    })
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        getWeather({ cityName })
            .then((data) => {
                if (data) {
                    setWeather((prevWeather) => ({
                        ...prevWeather,
                        ...data,
                    }))
                } else {
                    setWeather({ main: { temp: "Weather not found" } })
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setWeather({ main: { temp: "Error loading data" } })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [cityName])
    const iconURL = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div>
                        <h2 style={{ margin: "0", paddingTop: "10px", paddingBottom: "10px" }}>
                            Weather in {cityName}
                        </h2>
                        <div>
                            <span style={{ fontWeight: "bold" }}>Temperature: </span>
                            <span>{weather.main.temp}°C</span>
                        </div>
                        <div>
                            <span style={{ fontWeight: "bold" }}>Wind: </span>
                            <span>
                                {degToCompass(weather.wind.deg)} {weather.wind.speed}m/s
                            </span>
                        </div>
                        <div>
                            <img
                                src={iconURL}
                                alt={weather.weather[0].description}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const Country = (countryName) => {
    const name = encodeURIComponent(countryName.countryName)
    const [country, setCountry] = useState({
        name: { common: "" },
        capital: "",
        area: 0,
        languages: {},
        flags: { png: "" },
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const fetchCountryData = () => {
            return axios
                .get(`${baseURL}name/${name}`)
                .then((response) => {
                    if (response.status === 200) {
                        return response.data[0]
                    } else {
                        throw new Error("Error fetching country data.")
                    }
                })
                .catch((error) => {
                    console.error("Error fetching country data:", error)
                    return null
                })
        }

        fetchCountryData()
            .then((data) => {
                if (data) {
                    setCountry((prevCountry) => ({
                        ...prevCountry,
                        ...data,
                    }))
                } else {
                    setCountry({ name: { common: "Country not found" } })
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error)
                setCountry({ name: { common: "Error loading data" } })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [countryName, name])

    return (
        <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <div>
                        <h1 style={{ margin: "0", paddingTop: '10px', paddingBottom: "10px"}}>{country?.name?.common}</h1>
                    </div>
                    <div style={{ paddingBottom: "10px" }}>
                        <img
                            src={country.flags.png}
                            alt={`Flag of ${country.name.common}`}
                            width="200px"
                            border='1px solid black'
                        />
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Region:</span>{" "}
                        <span>{country.region}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Subregion:</span>{" "}
                        <span>{country.subregion}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Capital:</span>{" "}
                        <span>{country.capital}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: "bold" }}>Area:</span>{" "}
                        <span>
                            {country.area}m<sup>2</sup>
                        </span>
                    </div>
                    <div>
                        <p style={{ fontWeight: "bold", margin: 0}}>Languages:</p>
                        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                            {Object.values(country.languages).map((language) => (
                                <li key={language} style={{margin: 0, padding: 0}}>{language}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <Weather cityName={country.capital} />
                    </div>
                </div>
            )}
        </div>
    )
}

const CountryList = ({ countries }) => {
    const [showCountry, setShowCountry] = useState(true)
    const [countryName, setCountryName] = useState("")
    return (
        <div>
            <div>
                {showCountry ? (
                    <div>
                        {countries.map((country) => (
                            <div key={country.cca3}>
                                <span
                                    onClick={() => {
                                        setShowCountry(!showCountry)
                                        setCountryName(country.name.official)
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    {country.name.official}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div>
                            <Country countryName={countryName} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const CountryFilter = ({ filteredCountries }) => {
    if (filteredCountries.length === 0) {
        return <div>No countries found</div>
    }
    return filteredCountries.length > 1 ? (
        <div>
            {filteredCountries.length < 10 ? (
                <CountryList countries={filteredCountries} />
            ) : (
                <div>Too many matches, specify another filter</div>
            )}
        </div>
    ) : (
        <Country countryName={filteredCountries[0].name.official} />
    )
}

const App = () => {
    const [countries, setCountries] = useState([])
    const [search, setSearch] = useState("")
    const [filteredCountries, setFilteredCountries] = useState([])

    useEffect(() => {
        axios.get(`${baseURL}all`).then((response) => {
            setCountries(response.data)
            setFilteredCountries(
                countries.filter((country) =>
                    country.name.official.toLowerCase().includes(search.toLowerCase())
                )
            )
        })
    }, [search])

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                }}
        >
            <div>
                <h1>Countries</h1>
            </div>
            <div>
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                    }}
                />
            </div>
            <div>
                <CountryFilter filteredCountries={filteredCountries} />
            </div>
        </div>
    )
}

export default App
