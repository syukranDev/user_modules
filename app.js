const express = require('express')
const app = express();
const PORT = 3003

const bodyParser = require('body-parser')
const UserRouter = require('./router/userRoutes')

app.use(bodyParser.json({ limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '1mb', extended : true}))
app.use (function (err, req, res, next){
    if (err) res.status(400).json({ message: 'Invalid JSON'});
    else next();
});

app.use('/api/user', UserRouter)

app.listen(PORT, () => {
    console.log(`Connected to server at port ${PORT}`)
})