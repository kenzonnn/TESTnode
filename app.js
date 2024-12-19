var express = require('express')
var ordinateurRouter = require('./ordinateur/controller')
var { socketIO } = require('./chat/chatService')
var mongoose = require('mongoose')
var path = require('path')
var app= express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'twig')
app.use(express.json())
app.use('/ordinateur', ordinateurRouter)
mongoose.connect('mongodb://localhost:27017/user-db')
        .then(()=>{
            console.log('DB connected !');            
        })
        .catch((error)=>{
            console.log("error : "+ error);
        })
var http = require('http')
var server = http.createServer(app)
const io = socketIO(server)
server.listen(3000,()=>{
    console.log('server started !');
})