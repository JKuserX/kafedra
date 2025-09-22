const products = [
    {
        id: 1,
        name: 'Смартфон XYZ',
        img: '📱',
        price: 29900,
        oldPrice: 34900
    },
    {
        id: 2,
        name: 'Ноутбук Ultra',
        img: '💻',
        price: 74900,
        oldPrice: 84900
    },
    {
        id: 3,
        name: 'Наушники Pro',
        img: '🎧',
        price: 12900,
        oldPrice: 15900
    },
    {
        id: 4,
        name: 'Умные часы',
        img: '⌚',
        price: 19900,
        oldPrice: 24900
    },
    {
        id: 5,
        name: 'Планшет Max',
        img: '📟',
        price: 42900,
        oldPrice: 49900
    },
    {
        id: 6,
        name: 'Фотоаппарат',
        img: '📷',
        price: 59900,
        oldPrice: 69900
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsContainer = document.getElementById('products-container');
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const checkoutBtn = document.getElementById('checkout-btn');
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name-input');
const telInput = document.getElementById('tel-input');
const cartCount = document.querySelector('.cart-count');

function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">${product.img}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="old-price">${formatPrice(product.oldPrice)}</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(price);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            img: product.img,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    
    showNotification(`Товар "${product.name}" добавлен в корзину`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4a6bdf;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1001;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        checkoutBtn.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        checkoutBtn.style.display = 'block';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">${item.img}</div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">🗑️</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                changeQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                changeQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCartToStorage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) return;
    
    cart = [];
    updateCart();
    saveCartToStorage();
    
    alert('Заказ успешно оформлен! Спасибо за покупку!');
    closeCartSidebar();
}

function openCartSidebar() {
    cartOverlay.style.display = 'block';
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartOverlay.style.display = 'none';
    cartSidebar.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });
            
            document.querySelectorAll('.accordion-btn span').forEach(span => {
                span.textContent = '+';
            });
            
            if (!isActive) {
                content.classList.add('active');
                button.querySelector('span').textContent = '-';
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const tel = telInput.value.trim();
    
    if (!name || !tel) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    console.log({ name, tel });
    
    contactForm.reset();
    
    alert('Спасибо! Ваши данные отправлены. Мы свяжемся с вами в ближайшее время.');
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
    initAccordion();
    
    cartBtn.addEventListener('click', openCartSidebar);
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);
    checkoutBtn.addEventListener('click', checkout);
    
    contactForm.addEventListener('submit', handleFormSubmit);
});