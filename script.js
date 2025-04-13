// Menu Data (unchanged from previous script)
const menuData = {
    meals: [
        { name: 'Pork Inasal', price: 8.99, image: 'pics/porkinasal.jpg' },
        { name: 'Paa Inasal', price: 9.49, image: 'pics/paainasal.jpg' },
        { name: 'Pecho Inasal', price: 7.99, image: 'pics/pechoinasal.jpg' }
    ],
    burgers: [
        { name: 'Fish Fillet Silog', price: 5.99, image: 'pics/fishfilletsilog.png' },
        { name: 'LongSilog', price: 6.49, image: 'pics/longsilog.png' },
        { name: 'TapSilog', price: 6.49, image: 'pics/tapsilog.png' },
        { name: 'CornSilog', price: 6.49, image: 'pics/cornsilog.png' },
        { name: 'ChickSilog', price: 6.49, image: 'pics/chicksilog.webp' },
        { name: 'Shanghai Silog', price: 2.99, image: 'pics/shanghaisilog.png' }
    ],
    drinks: [
        { name: 'Coca-Cola', price: 2.29, image: 'pics/Cola.png' },
        { name: 'Sprite', price: 2.29, image: 'pics/sprite.webp' },
        { name: 'Fanta', price: 2.29, image: 'pics/fanta.jpg' }
    ],
    sides: [
        { name: 'Chicken McNuggets', price: 4.99, image: 'pics/mcnnuggets.png' },
        { name: 'Apple Pie', price: 2.29, image: 'pics/applepie.png' },
        { name: 'Mozzarella Sticks', price: 3.99, image: 'pics/mozzarelasticks.webp' },
        { name: 'Onion Rings', price: 3.99, image: 'pics/onionrings.png' },
        { name: 'Hash Browns', price: 2.49, image: 'pics/hashbrowns.webp' },
        { name: 'Side Salad', price: 2.99, image: 'pics/sidesalad.jpg' },
        { name: 'Side Salad with Chicken', price: 4.99, image: 'pics/sidesaladwithchicken.jpg' },
        { name: 'Side Salad with Bacon', price: 5.99, image: 'pics/sidesaladwbacon.jpg' },
        { name: 'Side Salad with Chicken and Bacon', price: 6.99, image: 'pics/sidesaladwchickenwbacon.jpg' },
        { name: 'Side Salad with Grilled Chicken', price: 5.99, image: 'pics/sidesaladwchickenwbacon.jpg' },
    ]
};

let cart = [];
let selectedItem = null;
let currentCategory = 'meals';

// Load cart from sessionStorage if available (clears when browser closes)
function loadCartFromStorage() {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Save cart to sessionStorage (clears when browser closes)
function saveCartToStorage() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item', 'menu-item-enter');
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)}</p>
    `;
    menuItem.onclick = () => openQuantityModal(item);
    
    // Remove enter class after animation
    setTimeout(() => {
        menuItem.classList.remove('menu-item-enter');
    }, 300);
    
    return menuItem;
}

function showMenu(category) {
    const menuContainer = document.getElementById('menu-container');
    
    // Add exit animation to current items
    const currentItems = menuContainer.querySelectorAll('.menu-item');
    currentItems.forEach(item => {
        item.classList.add('menu-item-exit');
    });

    // Wait for exit animation to complete
    setTimeout(() => {
        menuContainer.innerHTML = '';
        
        // Create and add new menu items
        menuData[category].forEach(item => {
            const menuItem = createMenuItemElement(item);
            menuContainer.appendChild(menuItem);
        });
        
        // Update current category
        currentCategory = category;
        
        // Highlight active category button
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active-category');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active-category');
            }
        });
    }, 300); // Match this with CSS transition duration
}

function openQuantityModal(item) {
    selectedItem = item;
    document.getElementById('item-name-modal').textContent = item.name;
    document.getElementById('quantity-input').value = 1;
    document.getElementById('quantity-modal').style.display = 'block';
}

function closeQuantityModal() {
    document.getElementById('quantity-modal').style.display = 'none';
}

// New functions for quantity buttons
function incrementQuantity() {
    const input = document.getElementById('quantity-input');
    input.value = parseInt(input.value) + 1;
}

function decrementQuantity() {
    const input = document.getElementById('quantity-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCart() {
    const quantity = parseInt(document.getElementById('quantity-input').value);
    const cartItem = {
        ...selectedItem,
        quantity: quantity
    };
    cart.push(cartItem);
    updateCart();
    saveCartToStorage();
    closeQuantityModal();
}

function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeFromCart(index);
        
        li.appendChild(removeBtn);
        cartItemsList.appendChild(li);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToStorage();
}

function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

let selectedServiceType = null;

function selectServiceType(type) {
    selectedServiceType = type;
    document.getElementById('service-type-modal').style.display = 'none';
    
    // Enable UI elements after selection
    document.querySelectorAll('nav button, #cart button').forEach(btn => {
        btn.disabled = false;
    });
    
    // Initialize with Meals menu and highlight Meals button
    showMenu('meals');
    document.querySelector('nav button[data-category="meals"]').classList.add('active-category');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    // Skip showing service type modal if already selected
    if (selectedServiceType) {
        processCheckout();
    } else {
        document.getElementById('service-type-modal').style.display = 'block';
    }
}

function processCheckout() {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const currentDate = new Date();
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const tax = subtotal * 0.07;
    const total = subtotal + tax;
    
    // Create and save order
    const serviceType = selectedServiceType; // Get the selected service type
    
    // Clear the service type selection after saving the order
    selectedServiceType = null;
    const order = {
        orderNumber: orderNumber,
        date: currentDate,
        items: [...cart], // Create a copy of the cart
        total: total,
        serviceType: serviceType // Include service type in the order
    };
    saveOrder(order);
    
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-date').textContent = formatDate(currentDate);
    document.getElementById('service-type').textContent = order.serviceType;
    
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = '';
    
    // Add each item to the receipt
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const receiptItem = document.createElement('div');
        receiptItem.className = 'receipt-item';
        receiptItem.innerHTML = `
            <div class="receipt-item-name">${item.name} x${item.quantity}</div>
            <div class="receipt-item-dots"></div>
            <div class="receipt-item-price">$${itemTotal.toFixed(2)}</div>
        `;
        receiptItems.appendChild(receiptItem);
    });
    
    document.getElementById('receipt-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('receipt-tax').textContent = tax.toFixed(2);
    document.getElementById('receipt-total').textContent = total.toFixed(2);
    
    document.getElementById('order-confirmation').style.display = 'block';
    
    // Reset cart after checkout and clear session storage
    cart = [];
    sessionStorage.removeItem('cart');
    updateCart();
}

function closeOrderConfirmation() {
    document.getElementById('order-confirmation').style.display = 'none';
}

function printReceipt() {
    const receiptContent = document.querySelector('.receipt');
    const printWindow = window.open('', '', 'width=600,height=600');
    
    printWindow.document.write('<html><head><title>McDonald\'s Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: 'Courier New', monospace; max-width: 300px; margin: 0 auto; }
        .receipt-header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
        .receipt-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .receipt-item-dots { flex: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px; }
        .receipt-divider { border-top: 1px dashed #000; margin: 10px 0; }
        .receipt-total { text-align: right; }
        .receipt-total-amount { font-weight: bold; }
        .receipt-footer { text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(receiptContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print the document after a short delay to ensure it's fully loaded
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// IndexedDB setup
const dbName = 'OrderDB';
const dbVersion = 1;
let db;

function initDB() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('orderNumber', 'orderNumber', { unique: true });
        objectStore.createIndex('date', 'date', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };
}

function saveOrder(order) {
    const transaction = db.transaction(['orders'], 'readwrite');
    const objectStore = transaction.objectStore('orders');
    const request = objectStore.add(order);

    request.onsuccess = () => {
        console.log('Order saved to database:', order);
    };

    request.onerror = (event) => {
        console.error('Error saving order:', event.target.error);
    };
}

function getOrderHistory() {
    return new Promise((resolve) => {
        const transaction = db.transaction(['orders'], 'readonly');
        const objectStore = transaction.objectStore('orders');
        const request = objectStore.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error('Error getting orders:', event.target.error);
            resolve([]);
        };
    });
}

async function showOrderHistory() {
    const historyItems = document.getElementById('history-items');
    historyItems.innerHTML = ''; // Clear previous content
    const orders = await getOrderHistory();
    
    if (orders.length === 0) {
        historyItems.innerHTML = '<p class="no-orders">No past orders found</p>';
        return;
    }

    orders.reverse().forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'menu-item';
        
        // Create list of items
        const itemsList = order.items.map(item => 
            `${item.name} x${item.quantity}`
        ).join(', ');

        orderDiv.innerHTML = `
            <h3>Order #${order.orderNumber}</h3>
            <p>${formatDate(new Date(order.date))}</p>
            <p>Items: ${itemsList}</p>
            <p>Service Type: ${order.serviceType}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <button onclick="viewOrderDetails(${order.id})" class="remove-btn">View Details</button>
        `;
        historyItems.appendChild(orderDiv);
    });
    
    document.getElementById('order-history').style.display = 'block';
}

function closeOrderHistory() {
    document.getElementById('order-history').style.display = 'none';
}

function viewOrderDetails(orderId) {
    const transaction = db.transaction(['orders'], 'readonly');
    const objectStore = transaction.objectStore('orders');
    const request = objectStore.get(orderId);

    request.onsuccess = () => {
        const order = request.result;
        alert(`Order #${order.orderNumber}\nDate: ${formatDate(new Date(order.date))}\nItems: ${
            order.items.map(i => `${i.name} x${i.quantity}`).join(', ')
        }\nTotal: $${order.total.toFixed(2)}`);
    };
}

// Initialize on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    loadCartFromStorage();
    
    // Show service type modal first
    document.getElementById('service-type-modal').style.display = 'block';
    
    // Disable other UI elements until service type is selected
    document.querySelectorAll('nav button, #cart button').forEach(btn => {
        btn.disabled = true;
    });

    // Set up category navigation
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => showMenu(btn.dataset.category));
    });
});

// Modified selectServiceType to enable UI after selection
function selectServiceType(type) {
    selectedServiceType = type;
    document.getElementById('service-type-modal').style.display = 'none';
    
    // Enable UI elements after selection
    document.querySelectorAll('nav button, #cart button').forEach(btn => {
        btn.disabled = false;
    });
    
    // Initialize with Meals menu and highlight Meals button
    showMenu('meals');
    document.querySelector('nav button[data-category="meals"]').classList.add('active-category');
}
