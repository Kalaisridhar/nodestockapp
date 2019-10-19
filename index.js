const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const PORT = process.env.PORT || 5000;

//use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

//APi Key - pk_bddb2801840e4cacb8f03b3761391b58
function call_api(finishedAPI, ticker){
	request("https://cloud.iexapis.com/stable/stock/" + ticker + "/quote?token=pk_bddb2801840e4cacb8f03b3761391b58", {json:true},(err,res,body)=>{
		if(err){return console.log(err);}
		console.log(body);
		if(res.statusCode == 200){
			finishedAPI(body);
		};
	});
};


//Set Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Set handlebars index GET route
app.get('/',function(req,res) {
	call_api(function(doneAPI){	
		res.render('home',{
			stock: doneAPI
		});
	});
});

//Set handlebars index POST route
app.post('/',function(req,res) {
	call_api(function(doneAPI){		
		// posted_stuff = req.body.stock_ticker;	
		res.render('home',{
			stock: doneAPI
		});
	}, req.body.stock_ticker);
});

//Create about page route
app.get('/about.html',function(req,res) {
	res.render('about');
});

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT,() => console.log('Server Listening on port '+ PORT));