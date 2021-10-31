require('dotenv').config()
var fs = require('fs');
const request = require('request');
var Output = "";
let url = 'https://tscache.com/donation_total.json'
var DataPath = './www/data/trash.csv'

let Sekunde = 1000;
let Minute = Sekunde*60;
let Stunde = Minute*60;
let Tag = Stunde*24;
let Monat = Tag*(365/12);
let Jahr = Tag*365;

const Telebot = require('telebot');
const bot = new Telebot({
	token: process.env.Token,
	limit: 1000,
        usePlugins: ['commandButton']
});

console.log("Start Time: " + getHourUTC(new Date()));

const express = require('express');
const app = express();
app.use('/', express.static('www'));
app.listen(process.env.Port);

//getPounds()

function getPounds() {
	console.log("Pushed: getPounds");
	request(url, (err, res, body) => {
			let Pounds = JSON.parse(body)

			if(typeof Pounds.count !== null){

				var LT = fs.readFileSync('./www/data/trash.csv');
				var LTarr = LT.toString().split(/\s+/);
				var LTarr = LTarr.toString().split(",");
				var LastTree = LTarr[LTarr.length-2]

				var TreeDiff = Pounds.count - LastTree;
				
				Trees = "\n" + getDateTime(new Date()) + "," + Pounds.count + "," + TreeDiff
				TreesChart = "\n" + getDateTime(new Date()) + "," + Pounds.count/1000 + "," + TreeDiff
			
				fs.appendFile('./www/data/trash.csv', Trees, (err) => {if (err) console.log(err);
					log("Trees: " + Pounds.count + " Diff " + TreeDiff)
				});
				fs.appendFile('./www/data/trashC.csv', TreesChart, (err) => {if (err) console.log(err);
					log("Trees: " + Pounds.count/1000 + " Diff " + TreeDiff)
				});
				bot.sendMessage(-1001653433862, "Pounds removed: " + numberWithCommas(Pounds.count) + "\nPounds removeds (last 30 min): " + numberWithCommas(TreeDiff) + "\n[View Graph](https://teamseas.ebg.pw)" + "\n\n[Remove more!](https://teamseas.org)", { parseMode: 'markdown' });
			}else{
				Trees = "\n" + getDateTime(new Date()) + "," + LastTree + "," + "0"
				TreesChart = "\n" + getDateTime(new Date()) + "," + LastTree/1000 + "," + "0"
				console.log(Pounds.count)
				fs.appendFile('./www/data/trash.csv', Trees, (err) => {if (err) console.log(err);
					log("Trash: " + Pounds.count + " Diff " + TreeDiff)
				});
				fs.appendFile('./www/data/trashC.csv', TreesChart, (err) => {if (err) console.log(err);
					log("Trash: " + Pounds.count/1000 + " Diff " + TreeDiff)
				});
			}
	});
}

function getPounds24() {
	console.log("Pushed: getPounds24");
	setTimeout(function(){
		request(url, (err, res, body) => {
			let Pounds = JSON.parse(body)
			let Trees = "";
			let LT = fs.readFileSync('./www/data/trash.csv');
			let LTarr = LT.toString().split(/\s+/);
			LTarr = LTarr.toString().split(",");
			if(LTarr.length >= 146){
			let LastTree24 = LTarr[LTarr.length-146]
			//console.log(LastTree24)
			}
			if (err) { return console.log(err); }
			
			if(typeof Pounds.count !== 'undefined'){
				let TreeDiff24 = Pounds.count - LastTree24;
				bot.sendMessage(-1001653433862, "Pounds removed: " + numberWithCommas(Pounds.count) + "\nPounds removed (24h): " + numberWithCommas(TreeDiff24) + "\n[View Graph](https://teamseas.ebg.pw)\n\n" + getDiffTotalToCurrentRateWeek() + "\n\n[Remove more!](https://teamseas.org)", { parseMode: 'markdown' });
			}else{
				bot.sendMessage(-1001653433862, "The Webpage is down..." + "\n[View Graph](https://teamseas.ebg.pw)" + "\n\n[Remove more!](https://teamseas.org)", { parseMode: 'markdown' });
			}
		});
	}, 1);//900000
}
		
function getDateTime(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return year + "-" + month + "-" + day;
}

function getHourUTC(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	return hour-1 + "" + min;
}

function getMinUTC(date) {

	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	return min;
}
	
function log(info) {
	console.log("[" + getDateTime(new Date()) + "]" + " " + info)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getlast24h() {
    var LT = fs.readFileSync('./www/data/trash.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	var LastTree24 = Number(LTarr[LTarr.length-2]);
	var LastTree24end = Number(LTarr[LTarr.length-146]);
	var last24hTrees = LastTree24 - LastTree24end;
	return last24hTrees;
}

function getlast7d() {
    var LT = fs.readFileSync('./www/data/trash.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	var LastTree24 = Number(LTarr[LTarr.length-2]);
	var LastTree24end = Number(LTarr[LTarr.length-1010]);
	var last24hTrees = LastTree24 - LastTree24end;
	return last24hTrees;
}

function getCurrentTrees() {
	var LT = fs.readFileSync('./www/data/trash.csv');
	var LTarr = LT.toString().split(/\s+/);
	var LTarr = LTarr.toString().split(",");
	return Number(LTarr[LTarr.length-2]);
}

function getDiffTotalToCurrentRateWeek() {
	var newDate = "01/01/2022"; //Must Be Completed at!
	
	var startDateUnix = new Date().getTime();
	var TimeDoneUnix = new Date(newDate).getTime()
	
	var DiffSekunden = startDateUnix/1000 - TimeDoneUnix/1000;
	
	if(DiffSekunden < 0){
		var DiffSekundenZukunft = DiffSekunden*(-1);
		var TageVerbleibend = Math.floor(DiffSekundenZukunft/(Tag/1000))
		
		var TreesPerDayForLast7Days = Math.floor(getlast7d()/7);
		var TreesPlantetForVerbleibendeTage = TageVerbleibend * TreesPerDayForLast7Days;
		
		var currentTrees = getCurrentTrees();
		var TreesHochgerechnet = Number(currentTrees) + Number(TreesPlantetForVerbleibendeTage);
		
		if(TreesHochgerechnet >= 30000000) { //Check if we will win!
			return "Yeha! At the current rate, we will remove " + numberWithCommas(TreesHochgerechnet) +" pounds of waste out of 30M by the end of 2021\nWe currently have " + numberWithCommas(currentTrees) + " and remove ~" + numberWithCommas(TreesPerDayForLast7Days) + " per day\n\nTimeStamp: " + getDateTimeUTC(new Date()) + " (UTC)"
		}else{ //Or Loose
			return "Oh NO! At the current rate, we will only remove " + numberWithCommas(TreesHochgerechnet) +" pounds of waste out of 30M by the end of 2021\nWe currently have " + numberWithCommas(currentTrees) + " and remove ~" + numberWithCommas(TreesPerDayForLast7Days) + " per day\n\nTimeStamp: " + getDateTimeUTC(new Date()) + " (UTC)"
		}

		
	}else{
		return "Its Over. Its 2022!"
	}
}

function getDateTimeUTC(date) {
		var hour = date.getUTCHours();
		hour = (hour < 10 ? "0" : "") + hour;

		var min  = date.getUTCMinutes();
		min = (min < 10 ? "0" : "") + min;

		var sec  = date.getUTCSeconds();
		sec = (sec < 10 ? "0" : "") + sec;

		var year = date.getUTCFullYear();

		var month = date.getUTCMonth() + 1;
		month = (month < 10 ? "0" : "") + month;

		var day  = date.getUTCDate();
		day = (day < 10 ? "0" : "") + day;

		return day + "." + month + "." + year + " " + hour + ":" + min + ":" + sec;
	}

bot.start();

bot.on('/id',(msg) => {
	msg.reply.text(msg.chat.id);
	bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on(['/start', '/help'],(msg) => {
	msg.reply.text("Hello, i´ll post the stats every 30min to @TeamSeasLog and once a day to [@EverythingScienceChat](https://t.me/joinchat/BVSfuz-3cLYa38iD3ISeOg)\nYou can get the data with /pushdata\n\nYou can also use /last24h or /last7d to get the amount of pounds removed in that given timespan\n\nWanna see if we can make it? Well i can´t tell you for sure but i can look at the last week and extrapolate it for you with /canwewin", { parseMode: 'markdown', webPreview: false });
	bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/last24h',(msg) => {
	if(!isNaN(getlast24h())){
		msg.reply.text("In the last 24h " + numberWithCommas(getlast24h()) + " pounds of waste were removed from the ocean.");
		bot.deleteMessage(msg.chat.id, msg.message_id);
	}else{
		msg.reply.text("I do not have enough data yet.");
	}
});

bot.on('/last7d',(msg) => {
	if(!isNaN(getlast7d())){
		msg.reply.text("In the last 7d " + numberWithCommas(getlast7d()) + " pounds of trash were removed from the ocean.");
		bot.deleteMessage(msg.chat.id, msg.message_id);
	}else{
		msg.reply.text("I do not have enough data yet.");
	}
});

bot.on('/canwewin',(msg) => {
	if(!isNaN(getlast7d())){
		msg.reply.text("Well: " + getDiffTotalToCurrentRateWeek());
		bot.deleteMessage(msg.chat.id, msg.message_id);
	}else{
		msg.reply.text("Well: I do not have enough data yet.");
	}
});

bot.on('/pushdata',(msg) => {
	console.log("PushData from User " + msg.from.username + " in Chat " + msg.chat.username);
	bot.sendDocument(msg.chat.id, DataPath);
	msg.reply.text("If there is a 0 in the colum \"Diff\", that means the webpage was not reachable.\nThis file starts at 2021-30-10 00.00 UTC and was measured every 60 min from then.");
	bot.deleteMessage(msg.chat.id, msg.message_id);
});

setInterval(function(){
	if(getHourUTC(new Date()) === '1200'){
		getPounds24();
	}else{
		console.log("Not Time for ES: " + getHourUTC(new Date()))
	}
	if(getMinUTC(new Date()) === '15'){
		getPounds();
	}
	if(getMinUTC(new Date()) === '45'){
		getPounds();
	}
}, 60000); //60000
