const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const request = require('request');
const apiKey = 'b6e957f0267b184fe8f1bfc0487d9679';

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    res.render("../app/views/index", {weather : null, error : null});
})

app.post('/', (req, res) => {

    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, (err, response, body) => {
        if(err){
            res.render('../app/views/index', {weather : null, error : 'Please try again'});
        }else{
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('../app/views/index',{weather : null, error : 'Please try again'})
            }else{
                let weatherText = `It's ${Number(((weather.main.temp - 32) * (5/9)).toFixed(2) )} degrees in ${weather.name}!`;
                res.render('../app/views/index', {weather : weatherText, error : null});
            }
        }
    });
})

app.listen(3000, () => {
    console.log('Running on Port 3000')
})