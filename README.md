# Books2Go
Books2Go is a E-Commerce website for everyone would like to sell their own books. This project uses Reactjs, Nodejs, Express and Postgresql to make books purchases possible by including carts, order tracking, user accounts, and book information.

## Installation
Clone this repo to your desktop and run `npm install` to get all dependencies.
Make sure to install packages and programs below:

Nodejs: All of our backend stuff is running with node server. To get started with node, you have to install node and npm in you local machine. run `npm install -g npm` to do that.
Express: We used a node library express for our APIs. Install express by running `npm install express`. You'll see we imported express on our server.js. And there is already a post and get request on server.
Reactjs: All of our frontend stuff is with reactjs. To get started with reactjs you have to install react by running this command `npm install create_react_app`.
Postgresql: We used Postgresql as our database. We used heroku database to run our app. You could use Pgadmin to build your database.

## Usage
After you clone the repo, go to the root directroy and run `npm install` again to make sure you install all dependencies.
After the dependencies install, you can run `npm start` to build and run the application. The website will be available on localhost:8000.

## Security
Passwords will be stored in the database using md5 encryption.
Use "npm install md5" to have the encryption working.

## Routing 
we'll be using routing to route from landing page to marketpace.
Use "npm install --save react-router-dom" to have the routing working.

## Cookies
Cookie implementation in this site uses the react-cookie library.
Can be downloaded:  "npm install react-cookie"
Will create a session cookie for the user once they are logged in. 

## Products on marketplace

To add more books on the marketplace, add the book to the database(table name is "books"), then download an image and put it on public/images. Image name has to be same name as the book name then .jpg

## Special Feature - Music
Our special and unique feature of this website is that we have music that will play when a user is in the marketplace. 
The music is an mp3 file in the src/music folder. The music is free and available for public use. 
The website used to get the music file was: https://pixabay.com/music/search/mood/relaxing/
