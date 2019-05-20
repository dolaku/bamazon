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


connection.connect( (err) => {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?'.green,
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Nothing, exit'
            ]
        }
    ]).then( (answer) => {
        switch (answer.buyMore) {
            case 'View Products for Sale':
                
                break;
            case 'View Low Inventory':
                
                break;
            case 'Add to Inventory':
                
                break;
            case 'Add New Product':
                
                break;
            case 'Nothing, exit':
                connection.end();
                break;
        }
    })


});
