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

function display(){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        var tempArr = [];
        var items = [];
        for (i = 0; i < res.length; i++){
            tempArr.push(res[i]);
            items.push(res[i].product_name);
        }
        console.table(tempArr);
        itemPrompt(items, tempArr);
    })
}

function itemPrompt(items, tempArr){
    inquirer.prompt([
        {
            message: "Which item would you like to purchase? [Press q to quit]",
            name: "item",
        }
    ]).then(function(resp){
        if (resp.item.toLowerCase() === "q"){
            connection.end();
        }
        else{
            quantityPrompt(items, tempArr, resp);
        }
    })
}

function quantityPrompt(items, tempArr, resp){
    inquirer.prompt([
        {
            type: "number",
            message: "How many would you like to buy?",
            name: "amount",
        }
    ]).then(function(response){
        console.log(resp.item);
        if (response.amount > tempArr[items.indexOf(resp.item)].stock){
            console.log("Not enough in stock.");
        }
        else {
            query = "UPDATE products SET stock = " + (tempArr[items.indexOf(resp.item)].stock - response.amount) + " WHERE product_name = '" + resp.item + "'";
            connection.query(query, function(err, res){
                console.log("Bought " + response.amount + " " + resp.item + "s!\n")
            })
        }
        display();
})
}
