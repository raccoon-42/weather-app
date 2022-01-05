const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Route handlers
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ali Özkaya'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ali Özkaya'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Test message',
        title: 'Help',
        name: 'Ali Özkaya'
    })
})

app.get('/weather', async (req, res) => {
    if(!req.query.address && !req.query.coords) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    if(req.query.address){
        try {
            const {latitude, longitude, location} = await geocode(req.query.address)
            const forecastData = await forecast(latitude, longitude)
            res.send({
                icon: forecastData.icon,
                forecast: forecastData.data,
                // {
                //     weather: forecastData.weather.descriptions[0],
                //     temp: forecastData.temperature,
                //     feelslike: forecastData.feelslike,
                //     hum: forecastData.humidity,
                //     uv_index: forecastData.uv_index,
                //     wind_speed: forecastData.wind_speed,
                //     wind_dir: forecastData.wind_dir
                // }
                location,
                address: req.query.address
        })
        } catch (e) {
            res.status(e.status).send(e)
        }
    }

    if(req.query.coords) {
        try {
            const coords = req.query.coords.split(',')
            const forecastData = await forecast(coords[0], coords[1])
            res.send({
                icon: forecastData.icon,
                forecast: forecastData.data,
                location: 'Your approximate location'
        })
        } catch (e) {
            res.status(e.status).send(e)
        }
    }
})

app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Ali Özkaya',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req,res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Ali Özkaya',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})