"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");


const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function startServer() {
  app.set("view engine", "ejs");

  app.use(bodyParser.urlencoded({extended: true}));


  app.get("/", (req, res) => {
    res.end("Hello!");
  });

  app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  })
  .post("/urls/", (req, res) => {
    let shortURL = generateRandomString(urlDatabase);
    urlDatabase[shortURL] = req.body.longURL;
    let output = "Ok. " + req.body.longURL + " has been received and attached to database as:  " + shortURL;
    console.log(urlDatabase);
    //console.log(res)
    res.statusCode = 302
    res.redirect("/urls/"+shortURL)
  });

  app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL]
    console.log(longURL);
    res.redirect(longURL);
  });

  app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id,
                         urls: urlDatabase
                        };
    res.render("urls_show", templateVars);
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
}


function generateRandomString(checkObj) {
  let randStr = crypto.randomBytes(3).toString('hex');
  if (checkObj.hasOwnProperty(randStr)){
    return generateRandomString(checkObj);
  };
  return randStr;
}


//console.log(generateRandomString(urlDatabase))
startServer();