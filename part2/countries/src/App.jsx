import {useEffect, useState} from 'react'
import AccessApi from './services/Data.js'
import FindCountries from "./components/FindCountries.jsx";
import DisplayCountries from "./components/DisplayCountries.jsx";

function App() {
    const [countries, setCountries] = useState(null)
    const [filter, setFilter] = useState(null)

    useEffect(() => {
        const countryUrl ='https://studies.cs.helsinki.fi/restcountries/api/all'
        console.log('execute')
        AccessApi
            .GetData(countryUrl)
            .then(countriesData => setCountries(countriesData))
    }, [])


    if (!countries) return null


    const handleChange = (event) => {
        setFilter(event.target.value)
    }

    const handleShowCountry = (country) => {
        setFilter(country.name.common)
    }

    return (
        <div>
            <FindCountries handleChange={handleChange}/>
            <DisplayCountries countries={countries} filter={filter} handleShowCountry={handleShowCountry}/>
        </div>

  )
}

export default App
