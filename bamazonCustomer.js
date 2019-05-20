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

    displayAll();
});

// get data from database and ask which item to buy
let displayAll = () => {
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
                }, {
                    type: 'input',
                    name: 'quantity',
                    message: 'How many?'.green
                }
            ]).then((answer) => {
                let itemID = parseFloat(answer.itemID);
                let quantity = parseFloat(answer.quantity);

                // if there is enough stock for the chosen product
                if (checkAvail(products, itemID, quantity)) {

                    // Fulfill order - Update qty
                    updateProducts(itemID, quantity);

                } else {
                    console.log('Sorry, there is not enough in stock.');
                }
            });
    });
}

// check if there is enough stock for order
let checkAvail = (data, id, qty) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].item_id === id && data[i].stock_quantity >= qty) {
            return true;
        }
    }
    return false;
}

// get data from database
let updateProducts = (id, orderQty) => {
    connection.query('SELECT * FROM products WHERE ?;',
        { item_id: id },
        (err, product) => {
            if (err) throw err;

            let productName = product[0].product_name.toUpperCase();
            let initialQty = product[0].stock_quantity;
            let updatedQty = initialQty - orderQty;
            let totalPrice = orderQty * product[0].price;
            totalPrice = totalPrice.toFixed(2);

            // Target the item being bought
            connection.query('UPDATE products SET ? WHERE ?',
                [
                    { stock_quantity: updatedQty },
                    { item_id: id }
                ],
                (err, product) => {
                    if (err) throw err;

                    console.log('\nOrder Complete:'.cyan.bold);
                    console.log(`Product Name: ${productName}`);
                    console.log(`Quantity: ${orderQty}`);
                    console.log(`Total: $${totalPrice}\n`);

                    // buy more or exit
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'buyMore',
                                message: 'Continue shopping?'.green,
                                choices: ['Yes, I want to buy more.', 'No, exit.']
                            }
                        ]).then((answer) => {
                            switch (answer.buyMore) {
                                case 'Yes, I want to buy more.':
                                    displayAll();
                                    break;
                                case 'No, exit.':
                                    connection.end();
                                    break;
                            }
                        })
                });
        });
}