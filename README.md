# Lego

This project is a place for me to piece together all the different skills and technologies I've learned in school so far, in addition to learning more about Git and GitHub. Here, I can practice my front-end skills, currently using HTML5, CSS, JavaScript, jQuery, and Bootstrap, and my back-end skills, utilizing a DigitalOcean server set up with phpMyAdmin that contains a database I created, with which I interact via my PHP scripts. This is also a valuable way of learning to manage a Linux server. My current goals are to replicate some of the functionality of the sites Rebrickable and Bricklink using all the knowledge I've acquired during my studies. I'm using Rebrickable's API to send AJAX requests for JSON objects containing information about specific Lego sets, pieces, themes, categories, etc. The idea is to then add these sets/pieces/items into the database on my server, where I can manage my own Lego collection and do cool things with that data, like replicating Rebrickable's feature that tells you how many pieces you have of a set that you don't currently own.

What I'm working on right now...
-
  - Add sets and their pieces to DB by taking advantage of Rebrickable's API


What works so far...
-
  - Get info on a specific set from Rebrickable's API
  - Add the set and its info to DB
  - Add the set pieces to DB
  - Graceful handling of invalid/duplicate set ID
  
What still needs to be done...
-
  - Add the pieces from to the DB (aka add to the pieces table, not the set_pieces table)
  
