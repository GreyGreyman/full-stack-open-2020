import React, { useState, useEffect } from 'react';
import axios from 'axios'


const CityWeather = ({ name }) => {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHERSTACK_API_KEY}&query=${name}`)
      .then(response => setWeather(response.data))
  })

  return (
    <div>
      <h3>Weahter in {name}</h3>
      {weather
        ?
        <React.Fragment>
          <img alt='weather icon' src={weather.current.weather_icons[0]} />
          <p>temperature: {weather.current.temperature} Celcius</p>
          <p>wind: {weather.current.wind_speed} mph speed {weather.current.wind_dir} direction</p>
        </React.Fragment>
        :
        <p>Please wait</p>
      }
    </div>
  )
}


const CountryDetails = ({ name, capital, population, languages, flag }) => (
  <div>
    <h2>{name}</h2>
    <p>capital: {capital}</p>
    <p>population: {population}</p>
    <p>languages: </p>
    <ul>
      {languages.map(language =>
        <li key={language.name}>{language.name}</li>
      )}
    </ul>
    <img alt={`flag of the ${name}`} src={flag} height={100} width={200} />
    <CityWeather name={capital} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  const [filter, setFilter] = useState('')
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountires = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  let content
  if (filteredCountires.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (filteredCountires.length > 1) {
    content =
      <ul>
        {filteredCountires.map(country =>
          <li key={country.name}>
            {country.name}
            <button onClick={() => setFilter(country.name)}>
              show
            </button>
          </li>
        )}
      </ul>
  } else if (filteredCountires.length === 1) {
    content = <CountryDetails {...filteredCountires[0]} />
  } else {
    content = <p>Sorry no matches found</p>
  }

  return (
    <React.Fragment>
      <div>
        find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
      {content}
    </React.Fragment>
  );
}

export default App;
