// Script.js

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('data') === null) {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('data', JSON.stringify(data));
        loadPage();
      });
  } else {
    loadPage();
  };
});

const loadPage = () => {
  // variables needed
  const addToCart = 'Add to Cart';
  const removeFromCart = 'Remove from Cart';

  const cartCount = document.getElementById('cart-count');

  const allData = JSON.parse(localStorage.getItem('data'));
  var cartSize = localStorage.getItem('cartSize') === null ? 0 : JSON.parse(localStorage.getItem('cartSize'));
  var cartItems = localStorage.getItem('cartItems') === null ? [] : JSON.parse(localStorage.getItem('cartItems'));

  // set the cart size upon reloading page
  cartCount.innerText = cartSize;

  // loop over all the stuff we got from API/localstorage
  allData.forEach(data => {
    const element = document.createElement('product-item');
    element.setAttribute('id', data['id']);
    element.shadowRoot.childNodes[3].childNodes[0].src = data['image'];
    element.shadowRoot.childNodes[3].childNodes[0].alt = data['title'];
    element.shadowRoot.childNodes[3].childNodes[1].innerText = data['title'];
    element.shadowRoot.childNodes[3].childNodes[2].innerText = "$" + data['price'];

    // assigning correct text on page reload
    element.shadowRoot.childNodes[3].childNodes[3].innerText = cartItems.includes(JSON.stringify(data['id'])) ? removeFromCart : addToCart;

    document.getElementById('product-list').appendChild(element);
  });

  const productList = document.querySelectorAll('product-item');

  // checkout cart logic
  productList.forEach(productItem => {
    const button = productItem.shadowRoot.querySelector('button');
    button.addEventListener('click', () => {
      if (button.innerText === addToCart) {
        cartSize += 1;
        button.innerText = removeFromCart;
        alert('Added to Cart!');

        // add to cart
        cartItems.push(productItem.id);
      } else {
        cartSize -= 1;
        button.innerText = addToCart;
        alert('Removed from Cart!');

        // remove from cart
        const index = cartItems.indexOf(productItem.id);
        cartItems.splice(index, 1);
      }

      // throw stuff to local storage
      localStorage.setItem('cartSize', JSON.stringify(cartSize));
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // update the count thing
      cartCount.textContent = cartSize;
    });
  });
}