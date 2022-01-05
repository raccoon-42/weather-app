const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const weatherIcon = document.querySelector('#weather-icon')
const $searchByLocation = document.querySelector('#search-by-location')
const $locationUrl = document.getElementById('location-url')

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const location = search.value;

    resetElements()

    try {
        const res = await fetch('/weather?address=' + location)
        const data = await res.json()
        let w = data.forecast

        if (!data.error) {
            weatherIcon.src = data.icon
            messageOne.textContent = data.location
            messageTwo.textContent = 
                "Weather:          " + w.weather_descriptions[0] + "\n\n" +
                "Temperature:      " + w.temperature + "°C\n" +
                "Feelslike:        " + w.feelslike + "°C\n" +
                "Humidity:         %" + w.humidity + "\n" +
                "UV Index:         " + w.uv_index + "/10\n" +
                "Windex Speed:     " + w.wind_speed + "km/s\n" +
                "Wind Direction:   " + w.wind_dir + "\n\n" + 
                "Observation Time: " + w.observation_time
        } else {
            messageOne.textContent = data.error
        }
        
    } catch (e) {
        messageOne.textContent = e.error
    }
})

$searchByLocation.addEventListener('click', async () => {
    if(!navigator.geolocation){
        return alert('Browser does not support geolocation api')
    }

    $searchByLocation.setAttribute('disabled', 'disabled')

    resetElements() 

    navigator.geolocation.getCurrentPosition(async (position) => {
        $searchByLocation.removeAttribute('disabled')

        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        let accuracy = position.coords.accuracy

        const res = await fetch('/weather?coords=' + lat + ',' + long)
        const data = await res.json()
        let w = data.forecast

        if (!data.error) {
            weatherIcon.src = data.icon
            messageOne.textContent = ''
            $locationUrl.href = 'https://www.google.com/maps?q=' + lat + ',' + long
            $locationUrl.innerHTML = data.location + " (with accuracy of " + accuracy + ")"
            messageTwo.textContent = 
                "Weather:          " + w.weather_descriptions[0] + "\n\n" +
                "Temperature:      " + w.temperature + "°C\n" +
                "Feelslike:        " + w.feelslike + "°C\n" +
                "Humidity:         %" + w.humidity + "\n" +
                "UV Index:         " + w.uv_index + "/10\n" +
                "Windex Speed:     " + w.wind_speed + "km/s\n" +
                "Wind Direction:   " + w.wind_dir + "\n\n" + 
                "Observation Time: " + w.observation_time
        } else {
            messageOne.textContent = data.error
        }
    })
})

function resetElements () {
    weatherIcon.src = ''
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    $locationUrl.href = ''
    $locationUrl.innerHTML = ''
}