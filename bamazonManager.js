var mysql = require('mysql');
var inquirer = require("inquirer");
const { table } = require('table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: "bamazon"
});

let config,
    data,
    output;

config = {
    columns: {
        0: {
            alignment: 'left',
            minWidth: 10
        },
        1: {
            alignment: 'center',
            minWidth: 10
        },
        2: {
            alignment: 'right',
            minWidth: 10
        }
    }
};

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

function initialPrompt() {
    inquirer.prompt([{
        name: "manager",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "What would you like to do?"
    }])
}

function lowInventory(item) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                // console.log(res[i].product_name)
                data = [
                    ["Item", "Stock Quantity"],
                    [res[i].product_name, res[i].stock_quantity]
                ]
                output = table(data, config)
                console.log(output)
            }
        }
    })
}


lowInventory()




function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        if (err) throw err;

        data = [
            [res[i].id + ".", res[0].product_name, "$" + res[0].price],
            [res[i].id + ".", res[1].product_name, "$" + res[1].price],
            [res[2].id + ".", res[2].product_name, "$" + res[2].price],
            [res[3].id + ".", res[3].product_name, "$" + res[3].price],
            [res[4].id + ".", res[4].product_name, "$" + res[4].price],
            [res[5].id + ".", res[5].product_name, "$" + res[5].price],
            [res[6].id + ".", res[6].product_name, "$" + res[6].price],
            [res[7].id + ".", res[7].product_name, "$" + res[7].price],
            [res[8].id + ".", res[8].product_name, "$" + res[8].price],
            [res[9].id + ".", res[9].product_name, "$" + res[9].price]
        ];
        output = table(data, config);
        console.log("            -----------------------")
        console.log("           ---- Available Items ----")
        console.log("            -----------------------")

        console.log(output);
    })
}