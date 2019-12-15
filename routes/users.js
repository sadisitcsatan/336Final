var express = require('express');
var router = express.Router();
var mysql = require("mysql");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  
  if(req.session && req.session.username && req.session.username.length){
    res.render('user', {logged: req.session.username, loggedIn: true});
    return;
  }
  
  res.render('login', {layout: false});
});

router.post('/new', function (req, res, next) {
  console.log(req.body);
  let availability = false
  let username = req.body.username;
  const connection = mysql.createConnection({
      host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      user: 'ux0er26era80bb09',
      password: 'xn9oqgy1x6zuloe5',
      database: 'xrcczq694g92zyim'
  });
  connection.connect();
  connection.query(`
SELECT username
FROM user_table
WHERE username = "${username}" 
`, function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    //console.log('The quotes are: ', results);
    if (results.length != 0){
      res.json({
        success: false,
        message: "Username already in use"
      });
    }else{
      console.log("here");
      availability = true;
      let result = addUser(availability,req.body.username, req.body.fullname, req.body.password);
      res.json({
          success: true,
          message: "Account successfully made"
        })
    }
  });
  connection.end();
  console.log("over");
});
router.post('/review', function (req,res,next) {
  //Do a mysql call to database to add reviews
  //return success or failure
});
router.post('/movie',function (req,res,next) {
  //add movie to database if already not in database
  //use this link if a ajax call is made in adding movie gets a result in the movie page
});
router.post('/getuser',function (req,res,next) {
console.log(req.body);
});
let addUser = function(e,user,name,pass){
    if (e) {
                let password = bcrypt.hashSync(pass,salt);
                const nconnection = mysql.createConnection({
                    host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
                    user: 'ux0er26era80bb09',
                    password: 'xn9oqgy1x6zuloe5',
                    database: 'xrcczq694g92zyim'
                });
                nconnection.connect();
                nconnection.query(`
INSERT INTO user_table(username,password,fullname) VALUES(?, ?, ?)
`, [user, password, name], (error, results, fields) => {
                    console.log(results);
                    if (error) throw error;
                });
                nconnection.end();
    }
};



// SELECT *
// FROM review_table
// WHERE userid = "${pageOwnerId}"

// SELECT *
// FROM review_table
// LEFT JOIN movie_table
// ON review_table.movieid = movie_table.movieid;

router.post("/getbookings",function (req,res,next) {
    console.log(req.body);
    let pageOwnerId = req.session.userid;
  
    const dconnection = mysql.createConnection({
        host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'ux0er26era80bb09',
        password: 'xn9oqgy1x6zuloe5',
        database: 'xrcczq694g92zyim'
    });
    dconnection.connect();
    
    dconnection.query(`
SELECT *
FROM schedule_table
LEFT JOIN user_table
ON user_table.userId = schedule_table.userid
WHERE user_table.userId = "${pageOwnerId}";
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                response: "Successfully retrieved reviews",
                retrievedReviews: results
            });
    });
    dconnection.end();
});

router.post("/deletebooking",function (req,res,next) {
    console.log(req.body);
    let reviewid = req.body.reviewid
    console.log("js id", reviewid);
    const dconnection = mysql.createConnection({
        host: 'if0ck476y7axojpg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'ek6fr7bzgpv230y8',
        password: 'acdcp33j961libcw',
        database: 'c5qwwjxdop5awyw3'
    });
    dconnection.connect();
    dconnection.query(`
DELETE
FROM review_table
WHERE reviewid = "${reviewid}"
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                 response: "Successfully deleted review"
            });
    });
    
    dconnection.end();
});

router.post("/updatebooking",function (req,res,next) {
    console.log(req.body);
    let reviewid = req.body.reviewid
    let newReview = req.body.review;
    let newDate =  new Date();
    let newScore = req.body.score
    
    const dconnection = mysql.createConnection({
        host: 'if0ck476y7axojpg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'ek6fr7bzgpv230y8',
        password: 'acdcp33j961libcw',
        database: 'c5qwwjxdop5awyw3'
    });
    dconnection.connect();
    dconnection.query(`
UPDATE review_table
SET review = "${newReview}", score = "${newScore}"
WHERE reviewid = "${reviewid}"
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
            res.json({
                response: "Successfully updated review"
            });
    });
});
router.post("/review", function(req, res, next) {
    console.log(req.body);
    let date = req.body.Date;
    let start = req.body.Start;
    let end = req.body.End;
    console.log(req.session.userid);
    console.log(date);
    const dconnection = mysql.createConnection({
        host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'ux0er26era80bb09',
        password: 'xn9oqgy1x6zuloe5',
        database: 'xrcczq694g92zyim'
    });
    dconnection.connect();
    dconnection.query(`
INSERT INTO schedule_table(Start,End,date,userid) VALUES(?, ?, ?, ?, ?)
`, [start, end,date, req.session.userid], (error, results, fields) => {
        console.log(results);
        console.log(error);
        if (error) throw error;
        res.json({
            response: "Successfully added review"
        })
    });
    dconnection.end();
});

module.exports = router;
