function calculateTotal() {
    let total = 0;
    const itemRows = document.querySelectorAll('.item-row');

    itemRows.forEach(row => {
        const priceInput = row.querySelector('.item-price-input');
        const price = parseFloat(priceInput.value) || 0;
        const quantityInput = row.querySelector('.item-quantity');
        const quantity = parseInt(quantityInput.value) || 0;

        if (quantity > 0) {
            total += price * quantity;
        }
    });

    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.innerText = '$' + total;
    }
}
window.calculateTotal = calculateTotal;

function initApp() {
    const quantityInputs = document.querySelectorAll('.item-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value !== '') {
                input.value = Math.max(0, parseInt(input.value) || 0);
            }
            calculateTotal();
        });

        input.addEventListener('change', () => {
            if (input.value === '' || input.value < 0) {
                input.value = 0;
            }
            calculateTotal();
        });
    });

    const priceInputs = document.querySelectorAll('.item-price-input');
    priceInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value !== '') {
                input.value = Math.max(0, parseFloat(input.value) || 0);
            }
            calculateTotal();
        });

        input.addEventListener('change', () => {
            if (input.value === '' || input.value < 0) {
                input.value = 0;
            }
            calculateTotal();
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
