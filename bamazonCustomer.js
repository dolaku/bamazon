const inquirer = require('inquirer');
const colors = require('colors');
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
    connection.query("SELECT item_id AS ID, product_name AS Product, price AS Price, stock_quantity AS 'Qty Available' FROM products;", (err, products) => {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.table(products);
        console.log('\r');

        // Ask item to buy && quantity
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'itemID',
                    message: 'Select the product ID to purchase:'.green,
                    choices: () => {
                        // list all items available from db
                        var availItemsArr = [];
                        for (let i = 0; i < products.length; i++) {
                            availItemsArr.push(products[i].ID);
                        }
                        return availItemsArr;
                    }
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
                    console.log('\nSorry, there is not enough in stock.');
                    shopOrExit();
                }
            });
    });
}

// check if there is enough stock for order
let checkAvail = (data, id, qty) => {
    for (let i = 0; i < data.length; i++) {
        let prodID = data[i].ID;
        let prodQty = data[i]['Qty Available'];
        if (prodID === id && prodQty >= qty) {
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

                    shopOrExit();
                });
        });
}


// buy more or exit
let shopOrExit = () => {
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
}