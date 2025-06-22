function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.classList.toggle('active');

    // Criar ou remover overlay ao abrir/fechar o carrinho
    if (cartPopup.classList.contains('active')) {
        // Verifica se já existe o overlay
        if (!document.querySelector('.cart-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'cart-overlay active';
            overlay.onclick = toggleCart;
            document.body.appendChild(overlay);
        } else {
            document.querySelector('.cart-overlay').classList.add('active');
        }
    } else {
        // Remove a classe active do overlay se existir
        const overlay = document.querySelector('.cart-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}