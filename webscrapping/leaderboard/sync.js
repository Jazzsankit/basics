let fs=require("fs");

console.log("Before");
 
let a =fs.readFileSync("./f1.txt");
console.log("content"+a);

console.log("After");