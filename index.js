var express= require("express");
var app=express();
var multer = require('multer');
var fs = require('fs');
var {spawn}=require('child_process');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
const bodyParser = require('body-parser');
const upload =  multer({dest: 'uploads/'});
app.get("/s1",function(req,res)
{
    var dataToSend;
    const python = spawn('python', ['script1.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    // console.log(dataToSend);
    });
    res.render("test.ejs");
});
app.get("/s2",function(req,res)
{
    var dataToSend;
    const python = spawn('python', ['script2.py','Aditya','Jain']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    });
    python.stderr.on('data',(data)=>{
        console.log("The Error is "+data.toString());
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log(dataToSend);
    res.send(dataToSend)
    });
});
app.get("/s3",function(req,res)
{
    var largeDataSet = [];
    // spawn new child process to call the python script
    const python = spawn('python', ['script3.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    console.log(data);
    largeDataSet.push(data);
    });
    // in close event we are sure that stream is from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log(largeDataSet.join(""));
    res.send(largeDataSet.join(""))
    });
    console.log("Hello");
});

var dataToSend=null;

app.get("/canvas",function(req,res)
{
    console.log("on canvas");
    res.render("canvas",{dataToSend:dataToSend});
})
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
   limit: '50mb',
   extended: true
}));
const url = require('url')
app.post('/canvas',(req, res) => {
    console.log("on sendimage");
    const image=req.body.myimage;
    console.log(image);
    fs.writeFile("uploads/fromclient.png", image,{encoding:'base64'}, function(err) 
    {
        console.log("image created!");
        console.log(err);
    }
    );
    const python = spawn('python', ['model.py']);
    // collect data from script 
    python.stdout.on('data', function (data) {
    // console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log("Data got from python file:"+dataToSend);
    });
    python.stderr.on('data',(data)=>{
        console.log("The Error is "+data.toString());
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log("redirecting to canvas");
    res.redirect('/canvas');
    });
 
});
var port = process.env.PORT||3000;
app.listen(port,function(){
    console.log("The Test Server Has Started!");
 });