const inquirer = require('inquirer');
let colors = require('colors');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});


connection.connect((err) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    displayAllProducts();

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'itemID',
                message: 'Enter product ID to purchase:'.green
            },{
                type: 'input',
                name: 'quantity',
                message: 'How many?'.green
            }
        ]).then( (answer) => {
            let itemID = parseFloat(answer.itemID);
            let quantity = parseFloat(answer.quantity);
            console.log('itemID ' + itemID);
            console.log('qty ' + quantity);
        });

    connection.end();
});


let displayAllProducts = () => {
    connection.query("SELECT item_id AS ID, product_name AS Product, price AS Price FROM products;", (err, data) => {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.log('\r');
        console.table(data);
    });
}