const fetch = require('node-fetch')

async function geocode (address) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?limit=1&access_token=' + process.env.MAPBOX_API_KEY

    try {
        const res = await fetch(url)
        const body = await res.json()
        
        if(!body.features.length) {
            const error = new Error ()
            error.error = 'Unable to find location. Try another search.'
            error.status = 400
            
            throw error
        }

        return {
            latitude: body.features[0].center[0],
            longitude: body.features[0].center[1],
            location: body.features[0].place_name
        }
    } catch (e) {
        throw e
    }
}

module.exports = geocode