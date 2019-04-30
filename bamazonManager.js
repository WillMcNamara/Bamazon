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
    managePrompt();
  });

function managePrompt(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "manage",
            choices: ["View products", "View low inv", "Add to inv", "Add product"]
        }
    ]).then(function(res){
        switch (res.manage){
            case "View products":
            viewProd(managePrompt);
            break;
            
            case "View low inv":
            viewLow();
            break;
            
            case "Add to inv":
            viewProd(addInv);
            break;
            
            case "Add product":
            addProd();
            break;
        }
    })
}

var tempArr = [];
var ids = []

function viewProd(callback){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        tempArr = [];
        ids = [];
        for (i = 0; i < res.length; i++){
            tempArr.push(res[i]);
            ids.push(res[i].id);
        }
        console.table(tempArr);
        callback();
    })
}

function viewLow(){
    var query = "SELECT * FROM products WHERE stock BETWEEN 0 AND 5"
    connection.query(query, function(err, res){
        var tempArr = [];
        var ids = [];
        for (i = 0; i < res.length; i++){
            tempArr.push(res[i]);
            ids.push(res[i].id);
        }
        console.table(tempArr);
        managePrompt();
    })
}

function addInv(){
    
    inquirer.prompt([
        {
            message: "Enter the ID of the item would you like to update.",
            name: "id",
            type: "number"
        },
        {
            message: "How much inventory are we adding?",
            name: "add",
            type: "number"
        }
    ]).then(function(res){
        if (0 < res.id && res.id <= tempArr.length && res){
            var index = tempArr[ids.indexOf(res.id)];

            query = "UPDATE products SET stock = " + (index.stock + res.add) + " WHERE id = " + res.id;
            connection.query(query, function(err, resp){
                console.log("\n" + index.product_name + " updated!\n");
                managePrompt();
            })        
        }
        else {
            console.log("\nNot a valid input, try again.\n");
            addInv();
        }
    })
}

function addProd(){
    inquirer.prompt([
        {
            message: "Name of product?",
            name: "product_name"
        },
        {
            message: "Name of department?",
            name: "department_name"
        },
        {
            message: "Price?",
            name: "price",
            type: "number"
        },
        {
            message: "Number in Stock?",
            name: "stock",
            type: "number"
        }
    ]).then(function(res){
        query = "INSERT INTO products (product_name, department_name, price, stock) VALUES ('" + res.product_name + "', '" + res.department_name + "', " + res.price + ", " + res.stock + ")";
        console.log(query);
        connection.query(query, function(err, resp){
            console.log(res.product_name + " added!");
            managePrompt();
        })
    })
}