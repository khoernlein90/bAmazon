var mysql = require('mysql');
var inquirer = require("inquirer");
const {
    table
} = require('table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    wrapperFunction()
});

function wrapperFunction() {
    connection.query("SELECT * FROM products", function (err, res) {
        afterConnection()

        function afterConnection() {
            if (err) throw err;
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
            data = [
                [res[0].id + ".", res[0].product_name, "$" + res[0].price],
                [res[1].id + ".", res[1].product_name, "$" + res[1].price],
                [res[2].id + ".", res[2].product_name, "$" + res[2].price],
                [res[3].id + ".", res[3].product_name, "$" + res[3].price],
                [res[4].id + ".", res[4].product_name, "$" + res[4].price],
                [res[5].id + ".", res[5].product_name, "$" + res[5].price],
                [res[6].id + ".", res[6].product_name, "$" + res[6].price]
            ];
            output = table(data, config);
            console.log("     -----------------------")
            console.log("    ---- Available Items ----")
            console.log("     -----------------------")

            console.log(output);

            initialQuestion()
        }

        function initialQuestion() {
            inquirer.prompt([{
                name: "product",
                message: "Would you like to purchase an item?",
                type: "list",
                choices: ["Yes", "No"]
            }]).then(function (answer) {
                if (answer.product === "Yes") {
                    itemSelection()
                } else {
                    console.log("C'mon and spend your money!")
                    connection.end()
                }
            })
        }

        function itemSelection() {
            if (err) throw err;
            inquirer.prompt([{
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which item would you like to purchase?"
            }, {
                name: "amount",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }]).then(function (item) {
                var chosenItem;
                var newQuantity = 0;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === item.choice) {
                        chosenItem = res[i];
                    }
                }
                if (chosenItem.stock_quantity >= item.amount) {
                    newQuantity = chosenItem.stock_quantity - item.amount;
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQuantity
                    }, {
                        id: chosenItem.id
                    }])
                } else {
                    console.log("Insufficient Quantity! There are only " + chosenItem.stock_quantity + " " + chosenItem.product_name + " left!")
                }
                anotherItem()
            })

            if (answer.product === "No") {
                console.log("Give me your money!")
                connection.end();
            }
        }

        function anotherItem() {
            inquirer.prompt([{
                name: "another",
                message: "Would you like to purchase another item?",
                type: "list",
                choices: ["Yes", "No"]
            }]).then(function (another) {
                if (another.another === "Yes") {
                    itemSelection();
                } else {
                    console.log("Give me your money!")
                    connection.end();
                }
            })
        }
    })
}