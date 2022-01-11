if (document.readyState == 'loading') {
    console.log("waiting for content to be loaded")
    document.addEventListener('DOMContentLoaded', buttons)
} else {
    buttons()
    console.log("Testing add to cart button")
}

function buttons() {
  console.log("button rans?")
  var addToCartButtons = document.getElementsByClassName('add-to-cart-btn')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCart)
    }
}

function addToCart(event) {
    var button = event.target
    var bookData = button.parentElement.parentElement
    console.log(bookData)
    var book_name = bookData.getElementsByClassName('book-name')[0].innerText
    var book_price = bookData.getElementsByClassName('book-price')[0].innerText
    var imageSrc = bookData.getElementsByClassName('book-image')[0].src
    var id = bookData.dataset.bookId

    console.log(book_name)
    console.log(book_price)
}
