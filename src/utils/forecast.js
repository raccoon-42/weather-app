const fetch = require('node-fetch')

async function forecast (lat, long) {
    const url = 'http://api.weatherstack.com/current?access_key=' + process.env.WEATHERSTACK_API_KEY + '&query='+ long + ',' + lat + '&units=m'    
    
    try {
        const res = await fetch(url)
        const body = await res.json()
        let data = body.current
        
        if(body.error) {
            const error = new Error ();
            error.error = 'Unable to find location!'
            error.status = 400

            throw error
        }

        return {
            // data: 'Mostly ' + data.weather_descriptions[0] + '. It is currently  ' + data.temperature + '°C and feels like  ' + data.feelslike + '°C. Also, with humidity of ' + data.humidity + '%. For those looking to go out, uv index is ' + data.uv_index + '. As you know, you should not go out with an uv index of 7 or higher. Additionally, wind speed is about ' + data.wind_speed + 'km/h with direction of ' + data.wind_dir + '.',
            data,
            icon: data.weather_icons 
        }
        
    } catch (e) {
        throw e
    }
}

module.exports = forecast


