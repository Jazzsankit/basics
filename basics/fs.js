let fs= require("fs");
let cheerio=require("cheerio");

let filedata=fs.readFileSync("./activity/index.html","utf-8")
let ch=cheerio.load(filedata);
let htmldata=ch("h1").text();

console.log(htmldata);