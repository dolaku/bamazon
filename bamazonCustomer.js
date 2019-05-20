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

    // get data from database
    connection.query("SELECT * FROM products;", (err, products) => {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.table(products);
        console.log('\r');
        
        // Ask item to buy && quantity
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
            
            // if there is enough stock for the chosen product
            if ( checkAvail(products, itemID, quantity) ) {
                console.log(`Successfully purchased ${quantity}`);

                // Fulfill order - Update qty



            } else {
                console.log('Sorry, there is not enough in stock.');
            }
            
            
            
        });
        
        connection.end();
    });
});


// check if there is enough stock for order
let checkAvail = (data, id, qty) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].item_id === id && data[i].stock_quantity >= qty) {
            return true;
        }
    }
    return false;
}