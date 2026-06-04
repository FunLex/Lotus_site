// Глобальный массив автомобилей (id, название, цена)
// Используется для синхронизации и фильтрации
const productsData = [
    { id: 1, name: "Lotus Emira", price: 85000 },
    { id: 2, name: "Lotus Evora", price: 75000 },
    { id: 3, name: "Lotus Exige", price: 95000 },
    { id: 4, name: "Lotus Elise", price: 55000 }
];

// Массив корзины (хранит объекты { id, name, price })
let cart = [];

// Функция перерисовки корзины (стрелочная)
const renderCart = () => {
    const cartContainer = document.getElementById("cartItemsList");
    const totalSpan = document.getElementById("cartTotal");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Корзина пуста</p>";
        totalSpan.textContent = "$0";
        return;
    }

    // Отрисовка каждого автомобиля с кнопкой удаления
    let html = "";
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                </div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <button class="remove-item" data-index="${index}">Удалить</button>
            </div>
        `;
    });
    cartContainer.innerHTML = html;
    totalSpan.textContent = `$${total.toLocaleString()}`;

    // Навесить обработчики удаления на каждую кнопку (стрелочные функции)
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.dataset.index);
            removeFromCart(idx);
        });
    });
};

// --- Удаление автомобиля по индексу ---
const removeFromCart = (index) => {
    if (index >= 0 && index < cart.length) {
        const removed = cart[index];
        cart.splice(index, 1);
        renderCart();
        alert(`${removed.name} удалён из корзины`);
    }
};

// --- Добавление автомобиля в корзину ---
const addToCart = (product) => {
    cart.push({ ...product }); // создаём копию объекта
    renderCart();
    alert(`${product.name} добавлен в корзину`);
};

// --- Очистка всей корзины ---
const clearCart = () => {
    if (cart.length === 0) {
        alert("Корзина уже пуста");
        return;
    }
    cart = [];
    renderCart();
    alert("Корзина очищена");
};

// --- Оформление заказа (оплата) ---
const checkout = () => {
    if (cart.length === 0) {
        alert("Корзина пуста! Добавьте хотя бы один автомобиль.");
    } else {
        alert("Покупка прошла успешно! Спасибо за заказ.");
        cart = [];
        renderCart();
    }
};

// --- Функция фильтрации автомобилей (по цене) ---
const filterProducts = () => {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const price = parseFloat(card.dataset.price);
        if (price >= min && price <= max) {
            card.style.display = "";      // показать
        } else {
            card.style.display = "none";  // скрыть
        }
    });
};

// --- Сброс фильтра (показать все автомобили) ---
const resetFilter = () => {
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 200000;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.style.display = "");
};

// --- Инициализация страницы (загрузка DOM) ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Навесить обработчики на кнопки "В корзину"
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();   // чтобы случайно не перейти по ссылке
            const card = btn.closest(".card");
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            addToCart({ id, name, price });
        });
    });

    // 2. Кнопка "Очистить корзину"
    document.getElementById("clearCartBtn").addEventListener("click", clearCart);

    // 3. Кнопка "Оплатить"
    document.getElementById("checkoutBtn").addEventListener("click", checkout);

    // 4. Фильтрация
    document.getElementById("applyFilterBtn").addEventListener("click", filterProducts);
    document.getElementById("resetFilterBtn").addEventListener("click", resetFilter);

    renderCart();
});