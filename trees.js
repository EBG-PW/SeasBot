var fs = require('fs');
const request = require('request');
var Output = "";
let url = 'https://teamtrees.org/'

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/www'));
app.listen('3333');

const Telebot = require('telebot');
const bot = new Telebot({
	token: 'Token',
	limit: 1000,
        usePlugins: ['commandButton']
});
//getTrees()

console.log("Start Time: " + getHourUTC(new Date()));


function getTrees() {
	console.log("Pushed: getTrees");
	request(url, (err, res, body) => {
			var Trees = "";
			var LT = fs.readFileSync('./www/data/TeamTrees.csv');
			var LTarr = LT.toString().split(/\s+/);
			var LTarr = LTarr.toString().split(",");
			var LastTree = LTarr[LTarr.length-2]
			if (err) { return console.log(err); }
			
			var bodyarr = body.split('"')
			/*console.log(bodyarr.length)

			for(var i = 0; i < bodyarr.length;i++){
				Output = Output + i + ":" + bodyarr[i] + " ";
				console.log(i);
			}*/
			if(typeof bodyarr[111] !== 'undefined'){
				
			
			var TreeDiff = bodyarr[111] - LastTree;
			Trees = "\n" + getDateTime(new Date()) + "," + bodyarr[111] + "," + TreeDiff
			TreesChart = "\n" + getDateTime(new Date()) + "," + bodyarr[111]/1000 + "," + TreeDiff
			
			fs.appendFile('./www/data/TeamTrees.csv', Trees, (err) => {if (err) console.log(err);
				log("Trees: " + bodyarr[111] + " Diff " + TreeDiff)
			});
			fs.appendFile('./www/data/TeamTreesChart.csv', TreesChart, (err) => {if (err) console.log(err);
				log("Trees: " + bodyarr[111]/1000 + " Diff " + TreeDiff)
			});
			//console.log(bodyarr[111])
			bot.sendMessage(-1001423197733, "Trees planted: " + numberWithCommas(bodyarr[111]) + "\nNew trees: " + numberWithCommas(TreeDiff) + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}else{
			Trees = "\n" + getDateTime(new Date()) + "," + LastTree + "," + "0"
			TreesChart = "\n" + getDateTime(new Date()) + "," + LastTree/1000 + "," + "0"
			
			fs.appendFile('./www/data/TeamTrees.csv', Trees, (err) => {if (err) console.log(err);
				log("Trees: " + bodyarr[111] + " Diff " + TreeDiff)
			});
			fs.appendFile('./www/data/TeamTreesChart.csv', TreesChart, (err) => {if (err) console.log(err);
				log("Trees: " + bodyarr[111]/1000 + " Diff " + TreeDiff)
			});
			bot.sendMessage(-1001423197733, "The Webpadge is down..." + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}
	});
}

function getTrees24() {
	console.log("Pushed: getTrees24");
	setTimeout(function(){
		request(url, (err, res, body) => {
			var Trees = "";
			var LT = fs.readFileSync('./www/data/TeamTrees.csv');
			var LTarr = LT.toString().split(/\s+/);
			var LTarr = LTarr.toString().split(",");
			if(LTarr.length >= 146){
			var LastTree24 = LTarr[LTarr.length-146]
			//console.log(LastTree24)
			}
			if (err) { return console.log(err); }
			
			var bodyarr = body.split('"')
			
			if(typeof bodyarr[111] !== 'undefined'){
			/*console.log(bodyarr.length)

			for(var i = 0; i < bodyarr.length;i++){
				Output = Output + i + ":" + bodyarr[i] + " ";
				console.log(i);
			}*/
			
			
			var TreeDiff24 = bodyarr[111] - LastTree24;
            bot.sendMessage(-1001068986550, "Trees planted: " + numberWithCommas(bodyarr[111]) + "\nNew trees(24h): " + numberWithCommas(TreeDiff24) + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
			}else{
			bot.sendMessage(-1001068986550, "The Webpadge is down..." + "\n[View Graph](home.bolverblitz.net:3333)" + "\n\n[Plant more!](teamtrees.org)", { parseMode: 'markdown' });
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
	//2019-010-26
	//return day + "." + month + "." + year;
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

bot.start();

bot.on('/id',(msg) => {
msg.reply.text(msg.chat.id);
bot.deleteMessage(msg.chat.id, msg.message_id);
});

bot.on('/start',(msg) => {
msg.reply.text("Hello, i´ll post the stats every 30min to @TeamTreesLog and once a day to @EverythingScience");
bot.deleteMessage(msg.chat.id, msg.message_id);
});

/*setInterval(function(){
	getTrees();
}, 1800000); //3600000
      //1800000
*/
setInterval(function(){
	if(getHourUTC(new Date()) === '1200'){
		getTrees24();
	}else{
		console.log("Not Time for ES: " + getHourUTC(new Date()))
	}
	if(getMinUTC(new Date()) === '15'){
		getTrees();
	}
	if(getMinUTC(new Date()) === '45'){
		getTrees();
	}
}, 60000); //60000
