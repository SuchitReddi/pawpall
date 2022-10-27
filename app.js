const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
const session = require('express-session');
const _ = require("lodash");
var path = require('path');
const { reset } = require("nodemon");
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mysql',
    database : 'puparazzi'
})
const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res){
    res.sendFile(__dirname + "/sign.html");
});
db.connect(function(err) {
    if(err){
        throw err;
    }
    //playmates:
   /* var pet1id=1, pet2id=2, R="F";
    var sql="INSERT into relation values ("+pet1id+","+pet2id+",'"+R+"')";
    db.query(sql,function(err,result){
        if(err) throw err;
        console.log("record created in relation"); 
    });
    if(R=="F")
    var sql1="UPDATE relation SET status='F' where Pet2="+pet2id;
    if(R=="D")
    var sql1="Delete from relation where Pet2="+pet2id;
    db.query(sql1,function(err,result){
        if(err) throw err;
        console.log("record updated in relation"); 
    });
    //petcare:
    var petid1=1, petid2=2, Req="A"
    var sql="INSERT into petcare values ("+petid1+","+petid2+",'"+Req+"')";
    db.query(sql,function(err,result){
        if(err) throw err;
        console.log("record created in relation"); 
    });
    if(Req=="A")
    var sql1="UPDATE request SET status='A' where Pet2="+petid2;
    if(Req=="D")
    var sql1="Delete from request where Pet2="+petid2;
    db.query(sql1,function(err,result){
        if(err) throw err;
        console.log("record updated in relation"); 
    }); */

}) ;
/*
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res){
    res.sendFile(__dirname + "/sign.html");

}); */


app.get("/:pagename", function (req, res){
    const pgname = _.capitalize(req.params.pagename);
    console.log(req.params);
    if(pgname == "Home"){
        res.sendFile(__dirname + "/index.html");
    }
    if(pgname == "Sign"){
        res.sendFile(__dirname + "/sign.html");
    }
    if(pgname == "Signup"){
        res.sendFile(__dirname + "/signup.html");
    }
    if(pgname == "Playmates"){
        res.sendFile(__dirname + "/playmates.html");
    }
})
app.post('/add', (req, res, next)=>{
        var pupid=req.body.pID;
        var pupname = req.body.pName;
        var pupbreed = req.body.Breed;
        var pupage = req.body.Age;
        var location= req.body.Loc;
        var username=req.body.Uname;
        var pwd=req.body.Pwd;
        var ownername=req.body.OName;
        var ownerage=req.body.Oage;
        var phone=req.body.Pnumber;
        var sql="INSERT into profile values ("+pupid+",'"+pupname+"','"+ pupbreed +"', "+ pupage + ", '"+ location +"','"+username+"','" +pwd+"','"+ownername+"',"+ownerage+","+phone+")";
        db.query(sql,function(err,result){
        if(err) throw err
        console.log("record created in profile"); 
        res.redirect('/home')
    })    
})
/*
app.get('/check', (req, res, next)=>{
    var UName=req.body.UName;
    var Passport=req.body.Passport
    var sql="SELECT Username, Password from profile where Username='"+UName+"'";
    db.query(sql,function(err,result){
    if(err) throw err
    console.log("record created in profile"); 
    res.redirect('/home')    
})
}) */
app.post('/check', function(request, response) {
	// Capture the input fields
	let username = request.body.UName;
	let password = request.body.Password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		// connection.query('SELECT * FROM profile WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        var sql="SELECT * from profile where username ='"+username+"' AND Password ='"+password+"';"
        db.query(sql,function(err,result){
        if(err) throw err
        console.log("Logged In Successfully"); 
        // response.redirect('/home')
			// If there is an issue with the query, output the error
			// if (error) throw error;
			// If the account exists
			if (result.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				 response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen("3000", function(){
    console.log("Server started at port 3000");
})
