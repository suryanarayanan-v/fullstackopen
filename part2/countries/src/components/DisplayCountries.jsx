import {useEffect, useState} from "react";
import AccessApi from "../services/Data.js";

const DisplayWeatherData = ({data}) => {
    if (!data) return null
    const imgUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    return (
        <div>
            <p>temperature {(data.main.temp - 272.15).toFixed(2)} Celcius</p>
            <img src={imgUrl} alt={data.weather.description}/>
            <p>wind {data.wind.speed} m/s</p>
        </div>
    )
}
const DisplayCountryDetails = ({country}) => {
    const api_key = import.meta.env.VITE_SOME_KEY
    const [weatherData, setWeatherData] = useState(null)
    useEffect(() => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`
        console.log('execute Weather')
        AccessApi.GetData(url).then(data => setWeatherData(data))
    }, [])
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h4>languages</h4>
            {Object.values(country.languages).map(language => {
                return <li key={language}>{language}</li>
            })}
            <img src={country.flags.png} alt={country.name}/>
            <DisplayWeatherData data={weatherData}/>

        </div>
    )
}
export const DisplayCountries = ({countries, filter, handleShowCountry}) => {
    if (!filter) return null

    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

    if (filteredCountries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if (filteredCountries.length === 1) {
        return <DisplayCountryDetails country={filteredCountries[0]}/>
    }

    return (
        <div>
            {filteredCountries.map(country => {
                return (
                    <div key={country.cca2}>
                        {country.name.common}
                        <button onClick={() => {
                            handleShowCountry(country)
                        }}>show
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default DisplayCountries