let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Sanitize cart: Ensure every item has required properties
cart = cart.map(item => ({
  name: item.name || 'Unknown Item',
  price: item.price || 0,
  image: item.image || '',
  description: item.description || 'No description available.',
  scent: item.scent || 'Unscented',
  size: item.size || 'Standard',
  quantity: item.quantity !== undefined ? item.quantity : 1,
}));

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initial cart:', cart);

  const cartCount = document.getElementById('cart-count');
  const updateCartCount = () => {
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      cartCount.textContent = isNaN(totalItems) ? '0' : totalItems;
    }
  };
  updateCartCount();

  // Add to Cart (for index.html, shop.html, and product pages)
  const addToCartButtons = document.querySelectorAll('.addToCart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price').replace('$', ''));
      const image = button.getAttribute('data-image');
      const description = button.getAttribute('data-description') || 'No description available.';
      const scent = button.getAttribute('data-scent') || 'Unscented';
      const size = button.getAttribute('data-size') || 'Standard';
      const quantityInput = document.getElementById(`quantity-${name.replace(/\s+/g, '-')}`);
      const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

      if (!name || !price || !image) {
        console.error('Missing required attributes on button:', button);
        return;
      }

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ name, price, image, description, scent, size, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert(`Added ${quantity} x ${name} ($${price.toFixed(2)}) to your cart!`);
      console.log('Updated cart:', cart);
    });
  });

  // Render Cart/Checkout Items
  const cartItemsDiv = document.getElementById('cart-items') || document.getElementById('checkout-items');
  const cartTotal = document.getElementById('cart-total') || document.getElementById('checkout-total');
  if (cartItemsDiv && cartTotal) {
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
      cartTotal.textContent = 'Total: $0.00';
    } else {
      let total = 0;
      cartItemsDiv.innerHTML = '';
      cart.forEach((item, index) => {
        if (!item.name || !item.price || !item.image) {
          console.error(`Invalid cart item at index ${index}:`, item);
          return;
        }
        total += item.price * item.quantity;
        cartItemsDiv.innerHTML += `
          <div class="cartItem">
            <img src="${item.image}" alt="${item.name}" class="cartImg">
            <div class="cartDetails">
              <span>${item.name} - $${item.price.toFixed(2)} (x${item.quantity})</span>
              <p><strong>Description:</strong> ${item.description}</p>
              <p><strong>Scent:</strong> ${item.scent}</p>
              <p><strong>Size:</strong> ${item.size}</p>
            </div>
            ${cartItemsDiv.id === 'cart-items' ? `<button class="removeItem" data-index="${index}">Remove</button>` : ''}
          </div>`;
      });
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;

      if (cartItemsDiv.id === 'cart-items') {
        document.querySelectorAll('.removeItem').forEach(button => {
          button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
          });
        });
      }
    }
  }

  // PayPal Integration
  if (document.getElementById('paypal-button-container')) {
    paypal.Buttons({
      style: { color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: (data, actions) => {
        const firstName = document.getElementById('shipping-first-name').value.trim();
        const lastName = document.getElementById('shipping-last-name').value.trim();
        const address = document.getElementById('shipping-address').value.trim();
        const city = document.getElementById('shipping-city').value.trim();
        const zip = document.getElementById('shipping-zip').value.trim();

        if (!firstName || !lastName || !address || !city || !zip) {
          alert('Please fill in all shipping details before proceeding to payment.');
          return;
        }

        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (total === 0) {
          alert('Your cart is empty or invalid. Please add items.');
          return;
        }

        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2), currency_code: 'USD' },
            shipping: {
              name: { full_name: `${firstName} ${lastName}` },
              address: { address_line_1: address, admin_area_2: city, postal_code: zip, country_code: 'US' }
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          alert('Payment completed! Thank you, ' + details.payer.name.given_name);
          cart = [];
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
          window.location.href = 'index.html';
        });
      },
      onError: (err) => {
        console.error('PayPal Error:', err);
        alert('An error occurred during payment. Please try again.');
      }
    }).render('#paypal-button-container');
  }

  // Search Functionality
  const searchInput = document.querySelector('.searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const input = searchInput.value.toLowerCase();
      const products = document.querySelectorAll('.productCard, .productItem');
      products.forEach(product => {
        const productName = (product.querySelector('h3') || product.querySelector('.productName')).innerText.toLowerCase();
        product.style.display = productName.includes(input) ? 'block' : 'none';
      });
    });
  }
});

function filterProducts(scent) {
  document.querySelectorAll('.productItem').forEach(card => {
    card.style.display = (card.dataset.scent === scent || scent === 'all') ? 'block' : 'none';
  });
}
