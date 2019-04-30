var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    display();
  });

//inital display of table
function display(){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        var tempArr = [];
        var ids = [];
        for (i = 0; i < res.length; i++){
            tempArr.push(res[i]);
            ids.push(res[i].id);
        }
        console.table(tempArr);
        itemPrompt(ids, tempArr);
    })
}

//ask for item prompt
function itemPrompt(ids, tempArr){
    inquirer.prompt([
        {
            message: "Enter the ID of the item would you like to purchase? [Press q to quit]",
            name: "id",
        }
    ]).then(function(resp){
        if (resp.id.toLowerCase() === "q"){
            connection.end();
        }
        else if (0 < resp.id && resp.id <= tempArr.length){
            quantityPrompt(ids, tempArr, resp);
        }
        else {
            console.log("\nNot a valid input, try again.\n");
            display();
        }
    })
}

function quantityPrompt(ids, tempArr, resp){
    inquirer.prompt([
        {
            type: "number",
            message: "How many would you like to buy?",
            name: "amount",
        }
    ]).then(function(response){
        if (response.amount > tempArr[ids.indexOf(parseInt(resp.id))].stock){
            console.log("Not enough in stock.");
        }
        else {
            query = "UPDATE products SET stock = " + (tempArr[ids.indexOf(parseInt(resp.id))].stock - response.amount) + " WHERE id = " + resp.id;
            connection.query(query, function(err, res){
                console.log("Bought " + response.amount + " " + tempArr[ids.indexOf(parseInt(resp.id))].product_name + "s!\n")
            })
        }
        display();
})
}
