const APP_URL = 'https://better-carts.dev-test.pro';

(function initializeBetterCarts() {
  if (window.customer) {
    initializeObserver();

    const cookie = getCartCookie();

    getCart(window.customer.id, window.customer.shop, cookie)
    
    initializeObserver();
  }
})()

function initializeObserver() {
  const target = document.body;

  const config = {
    childList: true
  }

  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      swapAddToCartBtn();
    }
  }

  const observer = new MutationObserver(callback);
  observer.observe(target, config);
}

function getCartCookie() {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('cart='))
    ?.split('=')[1];

  return cookie;
}

async function getCart(id, shop, cart_id) {
  const cart = await fetch(`${APP_URL}/storefront/cart/update?user_id=${id}&shop_id=${shop}&cart_id=${cart_id}`)
  // ---------------------------------------
  console.log(cart)
  // ---------------------------------------
}

function swapAddToCartBtn() {
  const addToCartBtn = document.querySelector('form[action="/cart/add"] button[type="submit"]');

  if (addToCartBtn) {
    const betterCartBtn = addToCartBtn.cloneNode(true);

    betterCartBtn.setAttribute('type', 'button')
    betterCartBtn.addEventListener('click', addToCart);
    
    addToCartBtn.parentNode.insertBefore(betterCartBtn, addToCartBtn);
    addToCartBtn.style.display = "none";
  } 
}

async function addToCart() {
  const addCart = await fetch(`${APP_URL}/storefront/cart/add`, {
    method: 'POST',
    body: JSON.stringify()
  })
  const data = await addCart.json()

  console.log(data)

  const button = document.querySelector('form[action="/cart/add"] button[type="submit"]');
  button.click()
}
