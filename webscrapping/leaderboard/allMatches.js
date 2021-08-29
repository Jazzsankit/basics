let request = require("request");
let fs= require("fs");
let cheerio= require("cheerio");
const findDetails = require("./match");
const leaderBoard = require("./match");

function getAllmatches(link){
    request(link,cb);
}

function cb(error,response , html){
    if(error == null && response.statusCode == 200)
    {
        parseData(html);
    }
    else if(response.statusCode == 404)
    console.log("Page not found");
    else
    console.log(error);
}

function parseData(html){
    let ch =cheerio.load(html);

    let allTAgs=ch('a[data-hover="Scorecard"]');
    for(let i=0;i<allTAgs.length;i++){
        let links=ch(allTAgs[i]).attr("href");
        let completeLink = "https://www.espncricinfo.com"+links;
        findDetails(completeLink);
    }
//    console.log(leaderBoard);
    // console.log(allTAgs.length);
}
module.exports = getAllmatches;