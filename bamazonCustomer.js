var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("----------------------")
            console.log(res[i].id + ". " + res[i].product_name + " ---- $" + res[i].price);
        }
        inquirer.prompt([{
            name: "product",
            message: "Would you like to purchase an item?",
            type: "list",
            choices: ["Yes", "No"]
        }]).then(function(answer) {
            if (answer.product === "Yes") {
                inquirer.prompt([{
                    name: "choice",
                    type: "list",
                    choices: function() {
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
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }]).then(function(item) {
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
                })
            }
            if (answer.product === "No") {
                console.log("Give me your money!")
                connection.end()
            }
        })
    })
}