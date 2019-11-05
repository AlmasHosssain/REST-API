const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoute = require ('./router/rootRouter')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.use('/api/user',userRoute)
app.get('/',(req,res)=>{
    res.json({
        message : 'WelCome Bro....'
    })
})

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`This server is running in the port ${PORT}`);
    mongoose.connect('mongodb://localhost/test-api',
    {useNewUrlParser : true},
    ()=>{
        console.log('Database Connected Successfully......');
    }
    )
})
