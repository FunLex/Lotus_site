// Глобальный массив автомобилей (id, название, цена)
const productsData = [
    { id: 1, name: "Lotus Emira", price: 85000 },
    { id: 2, name: "Lotus Evora", price: 75000 },
    { id: 3, name: "Lotus Exige", price: 95000 },
    { id: 4, name: "Lotus Elise", price: 55000 }
];

// Массив корзины (хранит объекты { id, name, price })
let cart = [];

// Сохранение корзины в localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Загрузка корзины из localStorage при инициализации
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart(); // отображаем восстановленную корзину
    }
}

// ---------- ОТРИСОВКА КОРЗИНЫ ----------
const renderCart = () => {
    const cartContainer = document.getElementById("cartItemsList");
    const totalSpan = document.getElementById("cartTotal");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Корзина пуста</p>";
        totalSpan.textContent = "$0";
        return;
    }

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

    // Навесить обработчики удаления
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.dataset.index);
            removeFromCart(idx);
        });
    });
};

// ---------- ОПЕРАЦИИ С КОРЗИНОЙ (с сохранением) ----------
const removeFromCart = (index) => {
    if (index >= 0 && index < cart.length) {
        const removed = cart[index];
        cart.splice(index, 1);
        renderCart();
        saveCartToLocalStorage();
        alert(`${removed.name} удалён из корзины`);
    }
};

const addToCart = (product) => {
    cart.push({ ...product });
    renderCart();
    saveCartToLocalStorage();
    alert(`${product.name} добавлен в корзину`);
};

const clearCart = () => {
    if (cart.length === 0) {
        alert("Корзина уже пуста");
        return;
    }
    cart = [];
    renderCart();
    saveCartToLocalStorage();          // сохраняем очистку
    alert("Корзина очищена");
};

const checkout = () => {
    if (cart.length === 0) {
        alert("Корзина пуста! Добавьте хотя бы один автомобиль.");
    } else {
        alert("Покупка прошла успешно! Спасибо за заказ.");
        cart = [];
        renderCart();
        saveCartToLocalStorage();      // сохраняем пустую корзину
    }
};

// ---------- ФИЛЬТРАЦИЯ (без изменений) ----------
const filterProducts = () => {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const price = parseFloat(card.dataset.price);
        card.style.display = (price >= min && price <= max) ? "" : "none";
    });
};

const resetFilter = () => {
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 200000;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.style.display = "");
};

// ---------- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ----------
document.addEventListener("DOMContentLoaded", () => {
    // 1. Восстанавливаем корзину из localStorage (если есть)
    loadCartFromLocalStorage();

    // 2. Навесить обработчики на кнопки "В корзину"
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            const card = btn.closest(".card");
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            addToCart({ id, name, price });
        });
    });

    // 3. Кнопка "Очистить корзину"
    document.getElementById("clearCartBtn").addEventListener("click", clearCart);

    // 4. Кнопка "Оплатить"
    document.getElementById("checkoutBtn").addEventListener("click", checkout);

    // 5. Фильтрация
    document.getElementById("applyFilterBtn").addEventListener("click", filterProducts);
    document.getElementById("resetFilterBtn").addEventListener("click", resetFilter);

    // 6. Если корзина не была восстановлена (например, localStorage пуст) – отображаем пустую
    if (cart.length === 0) {
        renderCart();
    }
});