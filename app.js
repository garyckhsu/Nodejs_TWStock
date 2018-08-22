'use strict';
//version
const packageInfo = require('./package.json');
//load config file
const config = require('./config');
//router
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
//database
const MongoClient = require('mongodb').MongoClient;
//Log
const Log = require('./logutil/log');
const http = require('http');
const jsdom = require("jsdom");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//app.use(indexRouter);

app.use(express.static('client'));
app.listen(5566, function () {
	Log.log('App start listen, version = ' + packageInfo.version);
});

//setInterval(getStockData, 60 * 60 * 1000);

app.route('/appversion').get((req, res) => {
		let result = {
			'appVersion': packageInfo.version
		}
		res.status(200).json(result);
});

app.route('/getStock').get((req, res) => {
	var now = new Date();
	var yesterday = now.getFullYear().toString() + '0' + (now.getMonth() + 1).toString() + (now.getDate() -1).toString();
	var stockdata = {};
	//stockdata.date = yesterday;
	//stockdata.stockData = getYesterDayStockData();
	getYesterDayStockData(function(callBack){
		res.write(callBack);
		res.end();
	});
});

app.route('/index.html'), function (req, res, next) {
	res.sendfile('./client/index.html');
}

app.route('/appversion').get((req, res) => {
	let result = {
		'appVersion': packageInfo.version
	}
	res.status(200).json(result);
});

function getYesterDayStockData(callBack) {
	var now = new Date();
	var yesterday = now.getFullYear().toString() + '0' + (now.getMonth() + 1).toString() + (now.getDate() -1).toString();
	Log.log(yesterday);
	var stockUrl = 'http://www.twse.com.tw/exchangeReport/MI_INDEX?response=html&date=' + yesterday + '&type=MS';
	Log.log(stockUrl);
	http.get(stockUrl, res => {
		let data = '';
		res.setEncoding('utf8');

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			const { JSDOM } = jsdom;
			const frag = JSDOM.fragment(data);
			//Log.log(frag.querySelector("tbody").childNodes.item(1).textContent);
			callBack(frag.querySelector("tbody").textContent);
		});

	}).on("error", (err) => {
		Log.log("Error: " + err.message);
	});
}

function getStockData() {
	var now = new Date();
	var today = now.getFullYear().toString() + '0' + (now.getMonth() + 1).toString() + now.getDate().toString()
	Log.log(today);
	var stockUrl = 'http://www.twse.com.tw/exchangeReport/MI_INDEX?response=html&date=' + today + '&type=MS';
	Log.log(stockUrl);
	http.get(stockUrl, res => {
		let data = '';
		res.setEncoding('utf8');

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			const { JSDOM } = jsdom;
			const frag = JSDOM.fragment(data);
			insertStockData(frag.querySelector("tbody").childNodes.item(1).textContent);
		});

	}).on("error", (err) => {
		Log.log("Error: " + err.message);
	});
}

function insertStockData(data) {
	MongoClient.connect(config.databaseUrl, { useNewUrlParser: true }, function (err, client) {
		if (err) {
			Log.log(err);
		}
		else {
			Log.log('connected to ' + config.databaseUrl);
			var now = new Date();
			var stock = {};
			stock.stock_time = now.getFullYear().toString() + (now.getMonth() + 1).toString() + now.getDate().toString();
			stock.stock_data = data;
			//Log.log(stockTimeStamp);
			client.db(config.databaseName).collection(config.collection).insertOne(stock, { upsert: true }, function (err, result) {
				client.close();
			});
		}
	})
}
