const inquirer = require('inquirer');
let colors = require('colors');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});


connection.connect((err) => {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");


});
