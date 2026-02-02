const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Tejasi@123'
});
let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};
//HOME ROUTE
app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM user";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
//SHOW ROUTE
app.get("/user", (req, res) => {
    let q = "SELECT * from user";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.render("showusers.ejs", { result });
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
//Edit Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
//Update Route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password, username } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            if (password != user.password) {
                res.send("Wrong Password!!");
            } else {
                let q2 = `UPDATE user SET username='${username}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            }
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
//ADD Route
app.get("/user/new", (req, res) => {
    res.render("new.ejs");
})
app.post("/user", (req,res) => {
    let {id, username, email, password} = req.body;
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
//Delete Route
app.get("/user/:id/dlt", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("dlt.ejs", { user });
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            if (password != user.password) {
                res.send("Wrong Password!!");
            } else {
                let q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                })
            }
        });
    }
    catch (err) {
        console.log(err);
        res.send("Some Error in Database!!!")
    }
})
app.listen("8080", () => {
    console.log("Server is listening on port 8080");
})