const http = require("http");
const express = require('express');

const app = express(); // request Handler


app.use("/",(req,res,next)=>{
    console.log("MiddleWare1");
    res.send.json
    
}); 


app.use((req,res,next)=>{
    console.log("MiddleWare2");
    // res.send('<h1>Heyyyy</h1>');
}); 


app.listen(3000);