const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
//const { request } = require("http");
const path = require("path");
var rpath;
app.use(express.static(path.join(__dirname,"../")+"public"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    //console.log(__dirname);
    //res.send("success");
    rpath = path.join(__dirname,"../");
    res.sendFile(rpath+"dist\\signup.html");
})

app.post("/",(req,res)=>{

    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ],
        update_existing: true
    };
    var jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/899fd51438";
    const options={
        method: "POST",
        auth: "ronak:240c7c6894d892cc071674911a628241-us14"
    }
    const request = https.request(url,options,(response)=>{
        if(response.statusCode === 200){
           res.sendFile(rpath+"dist/sucess.html");
        } else{
            res.sendFile(rpath+"dist/failure.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen(3000,(err)=>{
    if(err)
      console.log(err);
    console.log("Server is up and running");
})


//240c7c6894d892cc071674911a628241-us14  apikey
//899fd51438.                            listId