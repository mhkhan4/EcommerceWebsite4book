import React, { useEffect, useState } from "react";
import "./Marketplace.css";
import { useCookies } from "react-cookie";
import song from "../music/ambient-piano-amp-strings-10711.mp3";
import Popup from "./Popup";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function Marketplace() {
  const history = useHistory();
  const [buttonPopup, setButtonPopup] = useState(false);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState([]);
  const [track, setTrack] = useState([]);
  const [bookList, setBookList] = useState("");
  const [genres, setGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);
  const [bookData, setBookData] = useState(false);
  const [genreData, setGenreData] = useState(false);
  const [cart, setCart] = useState([]);
  const [cookies, setCookie] = useCookies(['cart']); //cookies stuff
  const [user, setUser] = useCookies(['user']);
  const listingBooks = async () => {
    try {
      const response = await fetch("/books");
      const data = await response.json();
      console.log(data)
      setBooks(data);
      setFilter(data);
    } catch (err) {
      console.log(err);
    }
    setBookData(true);
  };

  const listingGenre = async () => {
    var genreList = [];
    var holdingList = [];
    for (var i = 0; i < books.length; i++) {
      if (holdingList.includes(books[i].genre) === false) {
        holdingList.push(books[i].genre);
        genreList.push([books[i].genre, 1]);
      } else {
        for (var j = 0; j < genreList.length; j++) {
          if (genreList[j][0] === books[i].genre) {
            genreList[j][1] = genreList[j][1] + 1;
          }
        }
      }
    }
    setGenres(genreList);
    setGenreData(true);
  };
  const listingSubGenre = async () => {
    var subGenreList = [];
    var exploredList = [];
    for (var k = 0; k < books.length; k++) {
      if (!exploredList.includes(books[k].sub_genre)) {
        subGenreList.push([books[k].genre, books[k].sub_genre, 1]);
        exploredList.push(books[k].sub_genre);
      } else {
        for (var j = 0; j < subGenreList.length; j++) {
          if (subGenreList[j][1] === books[k].sub_genre) {
            console.log(subGenreList[j][1]);
            subGenreList[j][2] = subGenreList[j][2] + 1;
          }
        }
      }
    }
    setSubGenres(subGenreList);
  };

  useEffect(() => {
    listingBooks();
    if (bookData === true) {
      listingGenre();
    }

    // Will implement later
    // cartSetup();
    // if (genreData === true){
    //   listingSubGenre();
    // }
  }, [bookData]);

  // add to cart fnctionality

  const cartSetup = async () => {
    try {
      var holder = "";
      const response = await fetch("/cartList");
      const data = await response.json();
      for (var i = 0; i < data.length; i++) {
        if (data[i].username === user.userName) {
          holder = data[i].cart_list;
        }
      }
      setBookList(holder);
    } catch (err) {
      console.log(err);
    }
  };

  function cartList(b) {
    var holder = bookList;
    if (holder.includes(b.name) === false) {
      holder += b.name;
      holder += ";";
    }
    setBookList(holder);
    setButtonPopup(true);
  }

  /// update user_info
  const updateInfo = async () => {
    try {
      var user_name = user.userName;
      const body = { user_name, bookList };
      const response = await fetch("/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      //alert(data.message);   data.message might not be string, need convert
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
    // if (genreData === true){
    //   listingSubGenre();
    // }
  }
  // , [bookData, genreData]);


  const addToCart = (book_data) => {
      if (cookies.hasOwnProperty("cart")) {
        if (cookies.cart.hasOwnProperty(book_data.name)) {
          console.log("increase cart")
          cookies.cart[book_data.name]["quantity"] += 1;
        } else {
          console.log("new book existing cart");
          cookies["cart"][book_data.name] = {"quantity": 1, "price": book_data.price};
        }
        console.log("Cookies after alter", cookies)
        setCookie('cart', cookies.cart, { path: '/' , sameSite: 'strict'});
      } else{
        console.log("new");
        var object = {};
        object[book_data.name] = {"quantity": 1, "price": book_data.price};
        // cookies[book_data.name] = {"quantity": 1, "price": book_data.price};
        setCookie('cart', object, { path: '/' , sameSite: 'strict'})
      }
      setButtonPopup(true);
  }


  if (bookList !== "") {
    updateInfo();
  }

  // Book Description Function
  function bookDescription(book_desc) {
    alert(book_desc);
  }

  const useAudio = (song) => {
    const [audio] = useState(new Audio(song));
    const [playing, setPlaying] = useState(false);

    const status = () => setPlaying(!playing);

    useEffect(() => {
      playing ? audio.play() : audio.pause();
    }, [playing]);
    return [playing, status];
  };
  const [playing, status] = useAudio(song);

  // filtering
  function filtering(event) {
    var filters = [];
    if (event.target.checked) {
      var genree = event.target.value;
      track.push(genree);
      for(var j = 0; j <track.length; j++){
        for (var i = 0; i < books.length; i++) {
          if (books[i].genre === track[j]) {
            filters.push(books[i]);
          }
        }
      }
    } else {
      var index = track.indexOf(event.target.value);
      if (index > -1) {
        track.splice(index, 1);
      }
      if(track.length === 0){
        filters = books;
      }
      else{
        for(j = 0; j <track.length; j++){
          for (i = 0; i < books.length; i++) {
            if (books[i].genre === track[j]) {
              filters.push(books[i]);
            }
          }
        }
      }
    }
    console.log(filters);
    setFilter(filters);
  }

  return (

    <div>
      <div class="container-fluid mt-5 mb-5">
        <div class="row g-2">
          <div class="col-md-3">
            <div class="t-products p-2">
              <h6 class="text-uppercase">Genres</h6>

              {/* rendering genre starts here */}

              {genres.map((genre) => (
                <div class="p-lists">
                  <div class="d-flex justify-content-between mt-2">
                    {" "}
                    <span>{genre[0]}</span> <span>{genre[1]}</span>{" "}
                  </div>
                </div>
              ))}
            </div>
            {/* rendering genre ends here */}

            {/* filtering starts*/}

            <div class="processor p-2">
              <div class="heading d-flex justify-content-between align-items-center">
                <h6 class="text-uppercase">Filter</h6> <span>--</span>
              </div>

              {/* loop through length */}

              {genres.map((genre) => (
                <div class="d-flex justify-content-between mt-2">
                  <div class="form-check">
                    {" "}
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={genre[0]}
                      id="flexCheckDefault"
                      onClick={(e) => {
                        if (bookData === true) {
                          filtering(e);
                        }
                      }}
                    />{" "}
                    <label class="form-check-label" for="flexCheckDefault">
                      {" "}
                      {/* need to have an if condition */}
                      {genre[0]}{" "}
                    </label>{" "}
                  </div>{" "}
                  <span>{genre[1]}</span>
                </div>
              ))}
            </div>
            <div>
              <button class="btn btn-primary text-uppercase" onClick={status}>
                {playing ? "Pause Music" : "Play Music"}
              </button>
            </div>
          </div>
          {/* filtering stuff ends here*/}

          <div class="col-md-9">
            <div class="row g-2">
              {/* work start here */}
              {filter.map((book) => (
                <div class="col-md-4">
                  <div class="product py-4">
                    {" "}
                    {/* <span class="off bg-success">-25% OFF</span> */}
                    <div class="text-center">
                      {" "}
                      <button
                        type={"submit"}
                        onClick={() => bookDescription(`${book.book_desc}`)}
                      >
                        <img
                          src={`images/${book.name}.jpg`}
                          alt=""
                          width="200"
                          height="250"
                        />{" "}
                      </button>
                    </div>
                    <div class="about text-center">
                      <h5>{book.name}</h5> <span>{`$${book.price}`}</span>
                    </div>
                    <div class="cart-button mt-3 px-2 d-flex justify-content-center">
                      {" "}
                      {/*<button class="btn btn-primary text-uppercase">*/}
                      {/*  Buy Now*/}
                      {/*</button>*/}
                      <button
                        onClick={() => addToCart(book)}
                        class="btn btn-default text-uppercase"
                      >
                        Add to cart
                      </button>
                      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                        <p class = "textStyle">Added to cart</p>
                        <div class="cart-button mt-3 px-2 d-flex justify-content-between align-items-center">
                        {" "}

                        <Link to="/cart"class="nav-link" href="#">
                          <button class="btn btn-primary text-uppercase">
                            Go to cart
                          </button>
                        </Link>


                        {/* <button class="btn btn-primary text-uppercase">
                          Continue Shopping
                        </button> */}
                      </div>
                      </Popup>
                    </div>
                  </div>
                </div>
              ))}

              {/* end here */}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Marketplace;
