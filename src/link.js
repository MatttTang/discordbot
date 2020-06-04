const mysql = require('mysql');

var con = mysql.createConnection({
    user: "root",
    password: "hihimatt601601",
    database: "player"
});

con.connect((err) =>{
    if (err) throw err;
    console.log("Connected");
});

module.exports = con;