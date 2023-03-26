//set environment variables
const dotenv = require('dotenv')
dotenv.config({ path: './config.env'})
 
//Template for node.js express server
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))

const path = require('path')

const morgan = require('morgan-body')

var rfs = require('rotating-file-stream')

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', 
    path: path.join(__dirname, 'log')
})

morgan(app, {
    stream: accessLogStream,
    noColors: true,
    logReqUserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
})

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')

app.set('views', 'views')

const authenticationRoute = require('./routes/authenticationRoute')
app.use('/api', authenticationRoute)

app.use((err, req, res, next)=> {
    res.status(404).render('404', {pageTitle: 'Page Not Found'})
})

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://jh:UdJSuvfxvgQzIFIN@cluster0.txcchdp.mongodb.net/userDB',{useNewUrlParser: true})
    .then(()=> console.log("MongoDB connection successful"))
    .catch((err) => console.log(err))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})


