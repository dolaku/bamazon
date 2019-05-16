const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});


connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    displayAllProducts()

    connection.end();
});


let displayAllProducts = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.table(res);
    });
}