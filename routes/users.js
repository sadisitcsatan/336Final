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
router.post("/getbooking",function (req,res,next) {
    console.log(req.body);
    let pageOwnerId = req.body.slotId;

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
WHERE sheduleId = "${pageOwnerId}";
`, function(error, results, fields){
        console.log("here are the reviews: ", results);
        console.log(error);
        if (error) throw error;
        res.json({
            response: "Successfully retrieved review",
            retrievedReviews: results
        });
    });
    dconnection.end();
});

router.post("/deletebooking",function (req,res,next) {
    console.log(req.body);
    let reviewid = req.body.slotId;
    console.log("js id", reviewid);
    const dconnection = mysql.createConnection({
        host: 'd5x4ae6ze2og6sjo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'ux0er26era80bb09',
        password: 'xn9oqgy1x6zuloe5',
        database: 'xrcczq694g92zyim'
    });
    dconnection.connect();
    dconnection.query(`
DELETE
FROM schedule_table
WHERE sheduleId = "${reviewid}"
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

router.post("/booking", function(req, res, next) {
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
INSERT INTO schedule_table(Start,End,date,userid) VALUES(?, ?, ?, ?)
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
