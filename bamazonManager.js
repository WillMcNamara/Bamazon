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

function viewProd(callback){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, res){
        var tempArr = [];
        var ids = [];
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
        },
        {
            message: "How much inventory are we adding?",
            name: "add"
        }
    ]).then(function(res){

    })
}