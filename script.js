let cartCount = 0;
const cartItems = [];

// Fungsi untuk memformat harga dengan pemisah ribuan dan spasi setelah Rp
function formatCurrency(price) {
    return 'Rp ' + price.toLocaleString('id-ID'); // Format harga sesuai dengan mata uang Indonesia (Rp)
}

// Fungsi untuk menambah kuantitas produk di keranjang
function increaseQuantity(productName) {
    const quantityInput = document.getElementById(`quantity-${productName}`);
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity++;
    quantityInput.value = currentQuantity;
}

// Fungsi untuk mengurangi kuantitas produk di keranjang
function decreaseQuantity(productName) {
    const quantityInput = document.getElementById(`quantity-${productName}`);
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
    }
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName, price, image) {
    const quantity = parseInt(document.getElementById(`quantity-${productName}`).value);
    cartCount += quantity;
    document.getElementById("cart-count").textContent = cartCount;

    const productInCart = cartItems.find(item => item.name === productName);
    if (productInCart) {
        productInCart.quantity += quantity;
    } else {
        cartItems.push({ name: productName, price: price, image: image, quantity: quantity });
    }
    alert(`Produk ${productName} sebanyak ${quantity} ditambahkan ke keranjang!`);
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(productName) {
    const productIndex = cartItems.findIndex(item => item.name === productName);
    if (productIndex !== -1) {
        cartItems.splice(productIndex, 1);
        cartCount--;
        document.getElementById("cart-count").textContent = cartCount;
        alert(`Produk ${productName} telah dihapus dari keranjang!`);
        showCart(); // Menampilkan ulang keranjang setelah penghapusan
    }
}

// Fungsi untuk menampilkan keranjang belanja
function showCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalAmountContainer = document.getElementById("total-amount");
    cartItemsContainer.innerHTML = "";

    // Cek apakah keranjang kosong
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Keranjang Anda kosong. Silakan pesan produk terlebih dahulu.</p>";
        totalAmountContainer.textContent = "Total: Rp 0";
        document.getElementById("cart-modal").style.display = "flex";
        return; // Jika kosong, hentikan eksekusi fungsi lebih lanjut
    }
    function filterProducts(filter) {
        console.log("Filter applied:", filter);
        // Menambahkan logika untuk menampilkan produk yang difilter
        // Misalnya, berdasarkan filter yang dipilih, tampilkan produk yang sesuai
        // Ini adalah contoh implementasi sederhana:
        
        // Misalnya: Menyembunyikan atau menampilkan produk berdasarkan filter
        let allProducts = document.querySelectorAll('.product');
        allProducts.forEach(product => {
            if (filter === 'all') {
                product.style.display = 'block'; // Menampilkan semua produk
            } else {
                if (product.classList.contains(filter)) {
                    product.style.display = 'block'; // Menampilkan produk yang sesuai dengan filter
                } else {
                    product.style.display = 'none'; // Menyembunyikan produk yang tidak sesuai
                }
            }
        });
    }
    
    let totalAmount = 0;
    cartItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        // Menambahkan gambar produk terlebih dahulu
        const productImage = document.createElement("img");
        productImage.src = item.image;
        productImage.alt = item.name;
        productImage.classList.add("product-image"); // Menambahkan kelas untuk mengatur gaya gambar
        itemDiv.appendChild(productImage);

        // Membuat elemen untuk nama produk
        const productName = document.createElement("div");
        productName.classList.add("product-name");
        productName.textContent = item.name;

        // Membuat elemen untuk harga satuan
        const productPrice = document.createElement("div");
        productPrice.classList.add("product-price");
        productPrice.textContent = `Harga satuan: ${formatCurrency(item.price)}`;

        // Membuat elemen untuk kuantitas
        const productQuantity = document.createElement("div");
        productQuantity.classList.add("product-quantity");
        productQuantity.textContent = `Qyt: ${item.quantity}`;

        // Menambahkan tombol hapus
        const removeButton = document.createElement("button");
        removeButton.textContent = "Hapus";
        removeButton.classList.add("remove-button");
        removeButton.onclick = function() {
            removeFromCart(item.name); // Menghapus produk ketika tombol hapus diklik
        };

        // Menambahkan elemen-elemen tersebut ke dalam itemDiv
        itemDiv.appendChild(productName);
        itemDiv.appendChild(productPrice);
        itemDiv.appendChild(productQuantity);
        itemDiv.appendChild(removeButton); // Menambahkan tombol hapus ke dalam item

        // Menambahkan itemDiv ke container keranjang
        cartItemsContainer.appendChild(itemDiv);

        // Menghitung total harga
        totalAmount += item.price * item.quantity;
    });

    // Menampilkan total amount
    totalAmountContainer.textContent = `Total: ${formatCurrency(totalAmount)}`;

    // Menampilkan modal keranjang
    document.getElementById("cart-modal").style.display = "flex";

    // Menambahkan tombol untuk pengiriman lewat WhatsApp
    const whatsappButton = document.createElement("button");
    whatsappButton.textContent = "Kirim Pesanan lewat WhatsApp";
    whatsappButton.classList.add("whatsapp-button");

    // Menambahkan event listener untuk mengirim pesan lewat WhatsApp
    whatsappButton.onclick = function () {
        const orderDetails = cartItems.map(item =>
            `${item.name} - ${formatCurrency(item.price)}\nQyt: ${item.quantity}\nTotal Qyt: ${formatCurrency(item.price * item.quantity)}`
        ).join("\n\n"); // Memisahkan produk dengan dua baris kosong

        const message = encodeURIComponent(`Pesanan saya: \n${orderDetails}\n\nTotal Keseluruhan: ${formatCurrency(totalAmount)}`);
        window.open(`https://wa.me/6287877611218?text=${message}`, '_blank');
    };

    // Menambahkan tombol ke modal keranjang
    cartItemsContainer.appendChild(whatsappButton);
}

// Fungsi untuk menutup modal keranjang
function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

// Fungsi untuk memfilter produk berdasarkan kategori
function filterProducts(category) {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function toggleFilterMenu() {
    const filterColumn = document.getElementById("filterColumn");
    filterColumn.classList.toggle("active");
}
// Menambahkan tanggal lengkap (tanggal, bulan, tahun)
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('current-date').textContent = today.toLocaleDateString('id-ID', options);