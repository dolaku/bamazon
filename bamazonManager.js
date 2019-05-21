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

    managerView();
});
let managerView = () => {
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
        ]).then((answer) => {
            switch (answer.action) {
                case 'View Products for Sale':
                    viewProd();
                    break;
                case 'View Low Inventory':
                    viewLow();
                    break;
                case 'Add to Inventory':
                    addInv();
                    break;
                case 'Add New Product':
                    addProd();
                    break;
                default:
                    connection.end();
            }
        });

}




let viewProd = () => {
    // list all items
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products;',
        (err, products) => {
            if (err) throw err;

            console.table(products);
            console.log('\r');
        });
    setTimeout(managerView, 500);
}

let viewLow = () => {
    // all items with less than 5 in stock
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;',
        (err, products) => {
            if (err) throw err;

            console.table(products);
            console.log('\r');
        });
    setTimeout(managerView, 500);
}

let addInv = () => {
    connection.query('SELECT * FROM products;',
        (err, products) => {
            if (err) throw err;

            console.table(products);
            console.log('\r');

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'addItem',
                        message: 'Which item?'.green,
                        choices: () => {
                            // list all items available from db
                            var availItemsArr = [];
                            for (let i = 0; i < products.length; i++) {
                                availItemsArr.push(products[i].item_id);
                            }
                            return availItemsArr;
                        }
                    }, {
                        type: 'input',
                        name: 'addQty',
                        message: 'Quantity to add:'.green

                    }
                ]).then((answer) => {
                    let targetItem = answer.addItem;
                    let targetQty = parseFloat(answer.addQty);

                    connection.query(`
                        UPDATE products
                        SET stock_quantity = stock_quantity + ?
                        WHERE item_id = ?`,
                        [targetQty, targetItem],
                        (err, product) => {
                            if (err) throw err;

                            connection.query('SELECT * FROM products;',
                                (err, products) => {
                                    if (err) throw err;

                                    console.table(products);
                                    console.log('\r');
                                    setTimeout(managerView, 500);
                                });
                        });
                });
        });
}

let addProd = () => {
    connection.query('SELECT * FROM products;',
        (err, products) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Product name:'.green
                    },{
                        type: 'input',
                        name: 'dept',
                        message: 'Department name:'.green
                    },{
                        type: 'input',
                        name: 'price',
                        message: 'Price:'.green
                    },{
                        type: 'input',
                        name: 'stock',
                        message: 'Total Stock:'.green
                    }
                ]).then((answer) => {
                    let name = answer.name;
                    let dept = answer.dept;
                    let price = parseFloat(answer.price);
                    let stock = parseFloat(answer.stock);

                    connection.query(`
                    INSERT INTO products (
                        product_name,
                        department_name,
                        price,
                        stock_quantity)
                    VALUES (?, ?, ?, ?)`,
                        [name, dept, price, stock],
                        (err, product) => {
                            if (err) throw err;

                            connection.query('SELECT * FROM products;',
                                (err, products) => {
                                    if (err) throw err;

                                    console.table(products);
                                    console.log('\r');
                                    setTimeout(managerView, 500);
                                });
                        });
                })
        });
}