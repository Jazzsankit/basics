let fs=require("fs");

console.log("Before");
 
let a=fs.readFile("./f1.txt",cb);
function cb(error,a){
    console.log("content"+a);
}

console.log("After");