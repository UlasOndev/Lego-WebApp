/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Ulas Cagin Ondev Student ID: 123734220 Date: March 6, 2024
*
* Published URL: https://sore-pear-alligator-tux.cyclic.app/
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.static('public')); 

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get('/lego/sets', (req, res) => {
  const themeQuery = req.query.theme;
  if (themeQuery) {
      legoData.getSetsByTheme(themeQuery)
          .then(sets => {
              if (sets.length > 0) {
                  res.render('sets', {sets: sets});
              } else {
                  res.status(404).render("404", {message: "No sets found for the specified theme."});
              }
          })
          .catch(error => res.status(404).render("404", {message: "Error fetching sets by theme."}));
  } else {
      legoData.getAllSets()
          .then(sets => res.render('sets', {sets: sets}))
          .catch(error => res.status(500).send(error));
  }
});

app.get('/lego/sets/:setNum', (req, res) => {
  const setNum = req.params.setNum;
  legoData.getSetByNum(setNum)
      .then(set => {
          if (set) {
              res.render('set', { set: set });
          } else {
              res.status(404).render("404", {message: `No set found with number ${setNum}.`});
          }
      })
      .catch(error => {
          res.status(404).render("404", {message: `Set with number ${setNum} not found.`});
      });
});

app.use((req, res) => {
  res.status(404).render("404", {message: "The page you are looking for does not exist."});
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

