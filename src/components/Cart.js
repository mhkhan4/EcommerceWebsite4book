import React, { useState } from "react";
import Navbar from './Navbar'
import "./Cart.css"
import { useCookies } from 'react-cookie';

function Cart() {
  const [user, setUser] = useCookies(['user']);
  const [cart, setCart] = useCookies(['cart']);
  const [books, setBooks] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [bookPrice, setBookPrice] = useState([]);

  var name = user.userName
  if (name === undefined) {
    name = "Your";
  } else {
    name += "'s"
  }

  var book_count = 0
  var book_name = ""
  var total = 0


  if (cart.cart !== undefined){
    for (const num of Object.values(cart.cart)) {
        book_count += parseInt(num.quantity)
        total += parseInt(num.quantity) * parseInt(num.price)
    }
    for (const num of Object.keys(cart.cart)) {
      book_name = num
      console.log("book names: ", num)
    }
    console.log(cart.cart);
    // console.log(Object.keys(cart))
    // console.log(Object.keys(cart.cart))
    // console.log(Object.keys(cart.cart).map((item, i) => (i)))
  } else {
    cart.cart = {}
  }


  function totalPrice(){
    var holder = 0;
    for (var k = 0; k < bookPrice.length;k++){
        holder+=Number(bookPrice[k][1]);
    }
    localStorage.setItem('total_price', holder);
    return holder;
  }

  const change_input = async (key, event) => {
    // console.log("change_input changed")
    // console.log(event.target.value)
    // console.log(key)
    // console.log(cart.cart[key]["quantity"])
    cart.cart[key]["quantity"] = event.target.value
    setCart('cart', cart.cart, { path: '/' , sameSite: 'strict'})
  };

  function Remove_Books(key) {
    delete cart.cart[key]
    setCart('cart', cart.cart, { path: '/' , sameSite: 'strict'})
  }

  const update_database = async (event) => {
    if (name !== "Your" && name !== undefined) {
      try {
        const body = { name: user.userName, cart: cart.cart };
        const response = fetch("/update_cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = response.json();
        console.log("DATA FROM SERVER", data.message)
      } catch (err) {
        console.error(err.message);
      }
    }
  };


    return (
        <div>
            <Navbar />
            <div class="your-cart">
              <h1 class="cart-head">{name} Cart</h1>
              <span class= "item-count">({book_count} Items)</span>
            </div>
            <div style={{marginLeft:25 + 'px'}}>
              <table class= "book-table">
                <thead>
                  <tr>
                    <th class="item-header">Item</th>
                    <th class="price-header">Price</th>
                    <th class="quantity-header">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.keys(cart.cart).map(function (key, index) {
                      return(
                        <tr>
                          <td style={{fontSize:"150%"}}><img src={'images/' + key + '.jpg'} alt="Book Item" height="100"/> { key} </td>
                          <td style={{fontSize:"150%"}}>${cart.cart[key]["price"]}</td>
                          <td>
                            <form action="/quantity-change">
                              <input type="number" id="quantity" name="quantity" min="1" value={cart.cart[key]["quantity"]} onChange={(event) => change_input(key, event)}/>
                              <button class= "remove-btn" type="button" onClick={() => Remove_Books(key)}>REMOVE</button>
                            </form>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
            <div class="cart-total">
                <strong class="cart-total-title">Total</strong>
                <span class="cart-total-price">${total}</span>
            </div>
            <form action='../Checkout'>
            <button class="button-checkout" onClick={update_database}>Checkout</button>
            </form>
        </div>
)}


export default Cart
