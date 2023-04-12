//variables
let allContainerCart = document.querySelector(".products");
let containerBuyCart = document.querySelector(".card-items");
let priceTotal = document.querySelector(".price-total");
let amountProduct = document.querySelector(".count-product");

let buyThings = [];
let totalCard = 0;
let countProduct = 0;

//Carga items del local storage
loadItemsFromLocalStorage();

//Funciones
loadEventListeners();
function loadEventListeners() {
  allContainerCart.addEventListener("click", addProduct);
  containerBuyCart.addEventListener("click", deleteProduct);
  document.querySelector(".btn-checkout").addEventListener("click", checkout);
}

function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-add-cart")) {
    const selectProduct = e.target.parentElement;
    readTheContent(selectProduct);
  }
}

function deleteProduct(e) {
  if (e.target.classList.contains("delete-product")) {
    const deleteId = e.target.getAttribute("data-id");
    buyThings = buyThings.filter((product) => product.id !== deleteId);
    updateCart();
  }
}

function checkout() {
  // Guarda los productos seleccionados en localStorage
  localStorage.setItem("checkoutProducts", JSON.stringify(buyThings));

  // Redirecciona a la página de métodos de pago
  window.location.href = "./Pages/mediosdepago.html";
}

function readTheContent(product) {
  const infoProduct = {
    image: product.querySelector("div img").src,
    title: product.querySelector(".title").textContent,
    price: product.querySelector("div p span").textContent,
    id: product.querySelector("a").getAttribute("data-id"),
    amount: 1,
  };

  const exist = buyThings.some((product) => product.id === infoProduct.id);
  if (exist) {
    const pro = buyThings.map((product) => {
      if (product.id === infoProduct.id) {
        product.amount++;
        return product;
      } else {
        return product;
      }
    });
    buyThings = [...pro];
  } else {
    buyThings = [...buyThings, infoProduct];
  }
  updateCart();
}

function updateCart() {
  saveItemsToLocalStorage();
  totalCard = 0;
  countProduct = 0;

  buyThings.forEach((product) => {
    const { price, amount } = product;
    totalCard += parseFloat(price) * parseFloat(amount);
    countProduct += parseInt(amount);
  });

  totalCard = totalCard.toFixed(2);
  priceTotal.innerHTML = totalCard;
  amountProduct.innerHTML = countProduct;

  clearHtml();
  buyThings.forEach((product) => {
    const { image, title, price, amount, id } = product;
    const row = document.createElement("div");
    row.classList.add("item");
    row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${price}$</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

    containerBuyCart.appendChild(row);
  });
}

function clearHtml() {
  containerBuyCart.innerHTML = "";
}

function saveItemsToLocalStorage() {
  localStorage.setItem("buyThings", JSON.stringify(buyThings));
}

function loadItemsFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem("buyThings"));
  if (items) {
    buyThings = items;
    updateCart();
  }
}

// 1er intento de uso de sweetaler2 (esto seria la implementacion de AJAX)
function addProduct(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-add-cart")) {
    const selectProduct = e.target.parentElement;
    readTheContent(selectProduct);

    // Mostrar mensaje de confirmación con SweetAlert2
    Swal.fire({
      title: "Producto agregado al carrito",
      text: "¿Quieres seguir comprando o ir al carrito?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Ir al carrito",
      cancelButtonText: "Seguir comprando",
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirigir al usuario al carrito
        document.getElementById("products-id").style.display = "block";
      }
    });
  }
}

fetch("./js/data.json")
  .then((response) => response.json())
  .then((data) => {
    const cardsHtml = data
      .map(
        (item) => `
    <div class="carts">
    <div>
      <img
        src="${item.imgSrc}"
        alt=""
      />
      <p><span>${item.price}</span>$</p>
    </div>
    <p class="title">
      ${item.title}
    </p>
    <a href="" data-id="${item.dataId}" class="btn-add-cart">add to cart</a>
  </div>    `
      )
      .join("");

    document.getElementById("productosDOM").innerHTML = cardsHtml;
  })

  .catch((error) => console.error(error));

const productosDOM = document.getElementById("productosDOM");

const botonVaciarCarrito = document.getElementById("vaciar-carrito");

botonVaciarCarrito.addEventListener("click", () => {
  clearHtml();
  priceTotal.innerHTML = 0;
  totalCard = 0;
  amountProduct.innerHTML = 0;
  buyThings = [];
  localStorage.clear();
});
