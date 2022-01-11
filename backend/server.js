const express = require("express");
const path = require("path");
const cors = require("cors");
const client = require("./db");
const md5 = require("md5");
const dotenv = require("dotenv/config");
const nodemailer = require("nodemailer")
const app = express();

const Stripe = require("stripe");
const stripe = Stripe(process.env.SECRET_KEY);
client.connect(); //Connects to the SQL database.



//middleware
app.use(cors());
app.use(express.json()); //req.body

app.post("/signup", async (req, res) => {
  //async: wait for the function
  try {
    //maybe change back to const
    const name = req.body.username;
    const password = md5(req.body.password); //Encrypted
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    //Checks that pass and confirmpass in form are the same.
    if (req.body.password != req.body.confirm_password) {
      res.send({ message: "Passwords do not match!" });
      return;
    }
    //Require passwords with at least 8 characters.
    if (req.body.password.length < 8) {
      res.send({message: "Password must be more than 8 characters!"});
      return;
    }

    try {
      // user creation
      const post = await client.query(
        `INSERT INTO User_Info (username, user_first_name, user_last_name, user_password, user_email) VALUES('${name}',
        '${firstName}',
        '${lastName}' ,
        '${password}',
        '${email}') RETURNING *`
      );
      // Create instance of cart during user account creation
      const cart_insert = await client.query('INSERT INTO cart(cart_id) SELECT cart_id FROM user_info WHERE username = ' + name);
      const cart_total_insert = await client.query('INSERT INTO cart(cart_total) VALUES (0) WHERE cart_id = ' + '0');

      res.send({ message: "Sign-Up Successful" });
    } catch (err) {
      //Account not made because a user with that username exists.
      res.send({ message: "Username already exists!" });
    }
  } catch (err) {
    console.log("Server Error!");
  }
});

app.post('/mail/post', async (req, res) => {
  const {email} = req.body;
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'postmaster@sandboxeb34ccc3943540d29743bcc89961ebdc.mailgun.org', // generated ethereal user
        pass: '61390df47976064038f43dd4a0573e0e-7dcc6512-7272f935', // generated ethereal password
      },
    });

    console.log('transporter', transporter)

    let info = await transporter.sendMail({
      from: `"From Books2Go" postmaster@sandboxeb34ccc3943540d29743bcc89961ebdc.mailgun.org`, // sender address
      to: `${email}`, // list of receivers
      subject: "Payment Confirmation", // Subject line
      text: "Thank you for you purchase with Books2Go", // plain text body
      html: "<b>This is a payment confirmation email.</b>", // html body
    });

    console.log('info', info)
  } catch (err) {
    console.log(err);
  }
})

app.post('/payment/post', async (req, res) => {
  const {email,  number, name, exp_month, exp_year, cvc, city, country,price, postal_code, state, address } = req.body;

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
        card: {
          number: number,
          exp_month: exp_month,
          exp_year: exp_year,
          cvc: cvc,
        }
      ,
    })

    console.log(paymentMethod)

    const customer = await stripe.customers.create({
      // payment_method: payment_method,
      name: name,
      email: email,
      payment_method: paymentMethod.id,
      invoice_settings: {
        default_payment_method: paymentMethod.id
      },

      shipping: {
        address: {
          city: city,
          country: country,
          line1: address,
          postal_code: postal_code,
          state: state,
        },
        name: name,
      }
    });

    console.log(customer);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price*100,
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethod.id,
      receipt_email: email,
    })

    const confirm_payment = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {return_url: `https://books2go.herokuapp.com/Payment`}
    )

    console.log(confirm_payment)

    console.log(paymentIntent)

    const status = confirm_payment['status'];

    if (status === 'requires_action') {
      const url = confirm_payment['next_action']['redirect_to_url']['url'];
      res.send({ 'status': status, 'url': url})
    } else {
      res.send({ 'status': status })
    }

  } catch (err) {
    // const error = res.json({ error: {message: err.message }})
    console.log('err', err);
    switch (err.type) {
      case 'StripeCardError':
        // A declined card error
        console.log('err-message', err.message);
        res.send({ 'message' : err.message})// => e.g. "Your card's expiration year is invalid."
        break;
      case 'StripeRateLimitError':
        // Too many requests made to the API too quickly
        break;
      case 'StripeInvalidRequestError':
        console.log('err', err.message);
        res.send({ 'message': err.message })
        // Invalid parameters were supplied to Stripe's API
        break;
      case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        break;
      case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        break;
      case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        break;
      default:
        // Handle any other types of unexpected errors
        break;
    }
  }
})


app.post('/payment-intent/get', async (req, res) => {
  const {payment_intent_id} = req.body;
  // console.log('req', req.params)
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    console.log('payment-intent', paymentIntent);

    const status = paymentIntent['status'];
    const email = paymentIntent['receipt_email'];

    console.log(status);

    console.log(email);

    res.json({ 'status': status, 'email' : email })
  } catch (err) {
    console.log(err);
  }
})

app.post("/login", function (req, res) {
  let username = req.body.username;
  let password = md5(req.body.password); //encrypted
  let LoggedIn = false;

  //Below is the request sent to the SQL database.
  client.query(
    "Select * from user_info Where username='" +
      username +
      "' and user_password='" +
      password +
      "'",
    function (error, sqlinfo) {
      //console.log(rows);
      var size = Object.keys(sqlinfo["rows"]).length; //0 results means there is no such user with those credentials.

      if (size > 0) {
        LoggedIn = true; //The user exists.
        res.send({ message: "Login Successful!" });
      } else {
        LoggedIn = false; //The user with those credentials does not exist.
        res.send({ message: "Login Failed!" });
      }
    }
  );
});

//get all books
app.get("/books", async(req, res) =>{
  try{

    const allBooks = await client.query("SELECT * FROM books");
    // res.send({"books": "hi"});
    res.json(allBooks.rows);
    console.log("GET ALL BOOKS SERVER SIDE")
  } catch (err){
    console.error(err.message);
  }
});
// Check if cart exists for user
app.get("/cart", async(req, res) =>{
  try{
    const user_id_json = req.body.user_id
    const current_cart = await client.query("SELECT * FROM cart WHERE user_id =" + user_id_json)
    res.send({ message: "Cart Exists", dict: current_cart})
  } catch (err){
    res.send({ message: "No Cart Exists"})
  }
})

app.post("/cart", async(req, res) =>{
  try{
     console.log('cart');
  } catch (err) {
     console.log(err);
  }
})

// update user_info
app.post("/update", function (req, res) {
  let cart = req.body.bookList;
  let user_name = req.body.user_name;

  console.log("cart "+cart);
  console.log(user_name);


  //Below is the request sent to the SQL database.

  client.query(
    `UPDATE user_info SET cart_list = '${cart}' WHERE username = '${user_name}'`);

    res.send({ message: cart });
});

//get books for cart
app.get("/cartList", async(req, res) =>{
  try{
    const allBooks = await client.query("SELECT user_info.username, user_info.cart_list FROM user_info");
    // res.send({"books": "hi"});
    res.json(allBooks.rows);
  } catch (err){
    console.error(err.message);
  }
});


app.post("/get_cart", async(req, res) => {
  try{
    const cart = await client.query(`SELECT cart_json FROM user_info WHERE username='${req.body.name}'`)
    // console.log(cart.rows[0])
    res.json(cart.rows[0])
    console.log("GET CART SERVER SIDE")
  } catch (err){
    console.error(err.message);
  }
});

app.post("/update_cart", async(req, res) => {
  try {
    let username = req.body.name
    let cart = req.body.cart
    // console.log(JSON.stringify(username))
    // console.log(JSON.stringify(cart))

    update_query = "UPDATE user_info SET cart_json=" + "'" + JSON.stringify(cart) + "'" + " WHERE username=" + JSON.stringify(username)

    await client.query("UPDATE user_info SET cart_json=" + "'" + JSON.stringify(cart) + "'" + `WHERE username='${username}'`)
    // data = client.query(`SELECT * FROM user_info WHERE username='${username}'`)
    // res.send({ message: data });
    // console.log(update_query)
    // res.send({ message: data });
    // console.log("CART UPDATE SERVER SIDE")
    res.send({ message: "CART UPDATE SERVER SIDE"})
  } catch (err){
    console.error(err.message);
  }
});



// * means it's going to serve any path the client request
app.use(express.static("../build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});


const PORT = process.env.PORT || 8000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
