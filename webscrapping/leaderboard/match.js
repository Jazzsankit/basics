// let request = require("request");
// let fs= require("fs");
// let cheerio= require("cheerio");
// const { stringify } = require("querystring");

// function getmatch(link){
//     request(link,cb);
// }


// function cb(error,response , html){
//     if(error == null && response.statusCode == 200)
//     {
//         parseData(html);
//     }
//     else if(response.statusCode == 404)
//     console.log("Page not found");
//     else
//     console.log(error);
// }

// function parseData(html){
//     let ch= cheerio.load(html);
//     let bothInngs = ch(".card.content-block.match-scorecard-table .Collapsible");
//     for(let i=0;i<bothInngs.length;i++){
//         let teamNames=ch(bothInngs[i]).find("h5").text();
//         let teamname=teamNames.split("INNINGS")[0].trim();
//         let alltrs=ch(bothInngs[i]).find(".table.batsman tbody tr");
//         //console.log(alltrs);
//         for(let j=0;j<alltrs.length-1;j++){
//             let alltds=ch(alltrs[j]).find("td");
//             if(alltds.length>1){
//                 let batsmanName=ch(alltds[0]).text().trim();
//                 let run=ch(alltds[2]).text().trim();
//                 let ball=ch(alltds[3]).text().trim();
//                 let four=ch(alltds[5]).text().trim();
//                 let six=ch(alltds[6]).text().trim();
            
//             // console.log(`Batsman Name= ${batsmanName} Run=${run} Ball= ${ball} Four= ${four} Six= ${six}`);
//             processDetails(teamname , batsmanName, run , ball, four, six);
//             }
//         }
//     }
// }

// function existTeam(teamname){
//     return fs.existsSync(teamname);
// }

// function existBatsmanName(teamname, batsmanName){
//     let batsmanPath=`${teamname}/${batsmanName}.json`;
//     return fs.existsSync(batsmanPath);
// }

// function createBatsman(teamname , batsmanName, run , ball, four, six){
//     // console.log(`Batsman Name= ${batsmanName} Run=${run} Ball= ${ball} Four= ${four} Six= ${six}`);
//     let batsmanPath=`${teamname}/${batsmanName}.json`;
//     let batsmanFile=[];
//     let innings = {
//         "runs":run,
//         balls:ball,
//         fours : four,
//         sixes : six,
//     }
//     batsmanFile.push(innings);
//     batsmanFile=stringify(batsmanFile);
//     fs.writeFileSync(batsmanPath, batsmanFile);
// }

// function createTeamName(teamname){
//     fs.mkdirSync(teamname);
// }

// function updatebatsman(teamname , batsmanName, run , ball, four, six){
//     // console.log(`Batsman Name= ${batsmanName} Run=${run} Ball= ${ball} Four= ${four} Six= ${six}`);
//     let batsmanPath=`${teamname}/${batsmanName}.json`;
//     let batsmanFile=fs.readFileSync(batsmanPath);
//     batsmanFile=JSON.parse(batsmanFile);
//     let innings = {
//         runs:run,
//         balls:ball,
//         fours : four,
//         sixes : six,
//     }
//     // let innings=wakao;
//     console.log(innings);
//     batsmanFile.push(innings);
//     batsmanFile=stringify(batsmanFile);
//     fs.writeFileSync(batsmanPath,batsmanFile);
// }
// function processDetails(teamname , batsmanName, run , ball, four, six){

//     if(existTeam(teamname)){
//         if(existBatsmanName(batsmanName)){
//             updatebatsman(teamname , batsmanName, run , ball, four, six)
//         }else{
//             createBatsman(teamname , batsmanName, run , ball, four, six);
//         }
//     }else{
//         createTeamName(teamname);
//         createBatsman(teamname , batsmanName, run , ball, four, six);
//     }

// }
// module.exports=getmatch;

let request = require("request");
let cheerio = require("cheerio");
const fs  = require("fs");
let path = require("path");
let count=0;
let leaderBoard=[];

function findDetails(link){
        console.log(count++);
      request(link, cb);
  }


function cb(error, response, data) {
  //succesfull data received
  if (error == null && response.statusCode == 200) {
      console.log(count);
      count--;
    parseData(data);
    if(count==0){
    console.table(leaderBoard);
    }
  }
  // page not found
  else if (response.statusCode == 404) {
    console.log("page Not found !!!!");
  }
  // error occured
  else {
    console.log(response);
    console.log(error);
  }
}

function parseData(data){

let ch = cheerio.load(data);
let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");

for(let i=0 ; i<bothInnings.length ; i++){
    let teamName = ch(bothInnings[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();
    // console.log(teamName);
    if(!teamName.includes("Team")){
    let allRows = ch(bothInnings[i]).find(".table.batsman tbody tr");
    for(let j=0 ; j<allRows.length ; j++){

        let allCols = ch(allRows[j]).find("td");
        if(allCols.length > 1){

            let batsmanName = ch(allCols[0]).text().trim();
            let runs = ch(allCols[2]).text().trim();
            let balls = ch(allCols[3]).text().trim();
            let fours = ch(allCols[5]).text().trim();
            let sixes = ch(allCols[6]).text().trim();
            let strikeRate = ch(allCols[7]).text().trim();
            
            // console.log( `Batsman-> ${batsmanName} Runs-> ${runs} balls-> ${balls} fours-> ${fours} sixes-> ${sixes} SR-> ${strikeRate}`);
            if(batsmanName!="Extras")
            LeaderBoard(teamName , batsmanName , runs , balls , fours , sixes );
            //processDetails(teamName , batsmanName , runs , balls , fours , sixes , strikeRate);
            // console.log("------------------------------------------------------");
        }
    }
}
}

}

function LeaderBoard(teamName , batsmanName , runs , balls , fours , sixes ){
    runs=Number(runs);
    balls=Number(balls);
    fours=Number(fours);
    sixes=Number(sixes);

    for(let i=0;i<leaderBoard.length;i++){
        if(teamName==leaderBoard[i].TeamName && batsmanName == leaderBoard[i].BatsmanName){
            leaderBoard[i].Runs+=runs;
            leaderBoard[i].Balls+=balls;
            leaderBoard[i].Fours+=fours;
            leaderBoard[i].Sixes+=sixes;
            return;
        }
    }

    let innings={
        TeamName : teamName,
        BatsmanName: batsmanName,
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes
    }
    leaderBoard.push(innings);
}



// module.exports=leaderBoard;
module.exports = findDetails;

