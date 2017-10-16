var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889,
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
                for (var i = 0; i < res.length; i++) {
            
                inquirer.prompt([{
                    name: "item",
                    message: "Which item?",
                    type: "list",
                    choices: [res[i].product_name]
                }])
            }
        }
        })
        connection.end();
    })

}