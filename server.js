require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const initializedParser = bodyParser.urlencoded({ limit:'10mb',extended: false })

const setCsrfToken = require('./middleware/setCsrfToken')
const authRoutes = require('./controllers/routes/authRoutes')
const factsRoutes = require('./controllers/routes/factsRoutes')
const checkAuthSession = require('./middleware/checkAuthSession')

const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')


// connect to mongodb (mongoose) 
mongoose.connect(process.env.MONGODB_URI,{
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(()  => {
   console.log("Connected To DB")
   app.listen(process.env.PORT || 9000)
}).catch((err) => {
   console.log(err.message,  'Error connecting to database')
})



// set express options and middlewares
app.set('view engine','ejs')
app.set('views', path.join(__dirname, '/views')) 
app.set('layout','layouts/layout')

app.use(cookieParser())
app.use(initializedParser)
app.use(bodyParser.json())
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.static('src'))
app.use(setCsrfToken)
app.use(checkAuthSession)


// index route
app.get('/',(req,res) => {
   res.render('index.ejs',{ title:"Anciento De'Facts" })
})

// other routes
app.use('/auth',authRoutes)
app.use('/facts',factsRoutes)