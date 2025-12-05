// ------------------ PRODUCTS ------------------
const PRODUCTS = [
  {id:1, title:'Ardunio', price:350, category:'electronics', img:'https://m.media-amazon.com/images/I/61wVnTtouNL.jpg'},
  {id:2, title:'Hoodie', price:650, category:'clothes', img:'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR7JT31sH2x8G_UZm691O9260aRMKtEEgVdQ4LGhWs4AK-WXqvMHQjPoNXeI3mNz4OAu8TU-Pom3-v61R6bapLYOP_AWbHjn3XNNZjetO0tF0JcHGRS0T0yUg'},
  {id:3, title:'Harry potter novel', price:299, category:'books', img:'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRj-0Myj4voCJSDJcb8bbC936I-OxwD2m_cugYrpcFgw2FDi4hAF0zkRHlXTnmmCb56TCwxySVbyu0QQTFv577CMWJ6b9732a4aafQnETtxlvDygB41D7I14Q'}
];

let cart = new Map();

// ------------------ SELECTORS ------------------
const productsEl = document.querySelector('.products');
const searchInput = document.querySelector('#search');
const filterBtns = document.querySelectorAll('.filter');
const cartBtn = document.querySelector('.cart-btn');
const cartPanel = document.querySelector('.cart-panel');
const closeCart = document.querySelector('.close-cart');
const cartItemsEl = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout');

// ------------------ RENDER PRODUCTS ------------------
function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(prod =>{
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${prod.img}" alt="">
      <h3>${prod.title}</h3>
      <p>₹${prod.price}</p>
      <button class="add-btn">Add to Cart</button>
    `;

    div.querySelector('button').addEventListener('click', ()=> addToCart(prod));
    productsEl.appendChild(div);
  });
}

// ------------------ ADD TO CART ------------------
function addToCart(product){
  if(cart.has(product.id)){
    cart.get(product.id).qty++;
  } else{
    cart.set(product.id, {product, qty:1});
  }
  updateCartUI();
}

// ------------------ CHANGE QTY ------------------
function changeQty(id, amount){
  const entry = cart.get(id);
  if(!entry) return;

  entry.qty += amount;
  if(entry.qty <= 0) cart.delete(id);

  updateCartUI();
}

// ------------------ REMOVE FROM CART ------------------
function removeFromCart(id){
  cart.delete(id);
  updateCartUI();
}

// ------------------ UPDATE CART UI ------------------
function updateCartUI(){
  let count = 0, total = 0;
  cartItemsEl.innerHTML = '';

  for(const [id, entry] of cart.entries()){
    count += entry.qty;
    total += entry.product.price * entry.qty;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${entry.product.img}" />
      <div class="meta">
        <strong>${entry.product.title}</strong>
        <div>₹${entry.product.price} × ${entry.qty}</div>
      </div>
      <div class="qty">
        <button class="minus">−</button>
        <span>${entry.qty}</span>
        <button class="plus">+</button>
        <button class="remove">Remove</button>
      </div>
    `;

    el.querySelector('.minus').addEventListener('click', ()=> changeQty(id, -1));
    el.querySelector('.plus').addEventListener('click', ()=> changeQty(id, +1));
    el.querySelector('.remove').addEventListener('click', ()=> removeFromCart(id));

    cartItemsEl.appendChild(el);
  }

  cartCount.textContent = count;
  cartTotalEl.textContent = total;
}

// ------------------ UI EVENTS ------------------
cartBtn.addEventListener('click', ()=>{
  cartPanel.classList.add('open');
});

closeCart.addEventListener('click', ()=>{
  cartPanel.classList.remove('open');
});

checkoutBtn.addEventListener('click', ()=>{
  if(cart.size === 0){
    alert('Your cart is empty');
    return;
  }

  const total = Array.from(cart.values())
    .reduce((sum, e)=> sum + e.product.price * e.qty, 0);

  alert(`Thank you! Your total is ₹${total}`);
  cart.clear();
  updateCartUI();
  cartPanel.classList.remove('open');
});

// ------------------ FILTER ------------------
filterBtns.forEach(btn =>{
  btn.addEventListener('click', ()=>{
    const cat = btn.dataset.cat;
    if(cat === 'all') renderProducts(PRODUCTS);
    else renderProducts(PRODUCTS.filter(p => p.category === cat));
  });
});

// ------------------ SEARCH ------------------
searchInput.addEventListener('input', e =>{
  const q = e.target.value.toLowerCase();
  renderProducts(PRODUCTS.filter(p => p.title.toLowerCase().includes(q)));
});

// ------------------ INITIAL ------------------
renderProducts(PRODUCTS);
updateCartUI();