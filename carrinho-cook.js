// Função para adicionar item ao carrinho
function addToCart(planName, planPrice, planUUID, planIcon, descricao) {
    // Obter o carrinho atual dos cookies ou criar um novo array vazio
    let cart = getCookie('shopping-cart');
    if (cart) {
        try {
            cart = JSON.parse(cart);
        } catch (e) {
            cart = [];
        }
    } else {
        cart = [];
    }

    // Adicionar o item ao carrinho
    cart.push({
        uuid: planUUID,
        name: planName,
        price: planPrice,
        icon: planIcon,
        desc: descricao
    });

    // Salvar o carrinho atualizado nos cookies (válido por 7 dias)
    setCookie('shopping-cart', JSON.stringify(cart), 7);

    // Atualizar a contagem de itens no ícone do carrinho
    updateCartIcon();

    // Mostrar popup de confirmação
    showCartNotification(planName);

    // Atualizar o conteúdo do carrinho
    updateCartContent();
}

// Função para definir um cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Função para obter o valor de um cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// Função para mostrar notificação de item adicionado
function showCartNotification(planName) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>"${planName}" adicionado ao carrinho!</span>
        </div>
    `;

    // Adicionar ao corpo do documento
    document.body.appendChild(notification);

    // Mostrar notificação com animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Função para atualizar o ícone do carrinho com a contagem de itens
function updateCartIcon() {
    const cart = getCookie('shopping-cart');
    let itemCount = 0;

    if (cart) {
        try {
            const cartItems = JSON.parse(cart);
            itemCount = cartItems.length;
        } catch (e) {
            itemCount = 0;
        }
    }

    // Verificar se o contador já existe
    let cartCounter = document.querySelector('.cart-counter');

    if (itemCount > 0) {
        if (!cartCounter) {
            // Criar contador se não existir
            cartCounter = document.createElement('span');
            cartCounter.className = 'cart-counter';

            // Adicionar ao botão do carrinho
            const cartButton = document.querySelector('.cart-button');
            if (cartButton) {
                cartButton.appendChild(cartCounter);
            }
        }

        // Atualizar contagem
        cartCounter.textContent = itemCount;
        cartCounter.style.display = 'flex';
    } else if (cartCounter) {
        // Esconder contador se não houver itens
        cartCounter.style.display = 'none';
    }
}

// Função para determinar a classe do ícone com base no nome do plano
function getIconClass(planName) {
    planName = planName.toLowerCase();
    if (planName.includes('starter') || planName.includes('básic')) {
        return 'icon-basic';
    } else if (planName.includes('standard') || planName.includes('tradic')) {
        return 'icon-standard';
    } else {
        return 'icon-premium';
    }
}

// Função para atualizar o conteúdo do carrinho
function updateCartContent() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    const cart = getCookie('shopping-cart');

    if (cart && cart !== '[]') {
        try {
            const items = JSON.parse(cart);

            if (items.length > 0) {
                let content = '';
                let total = 0;
                let subtotal = 0;

                items.forEach((item, index) => {
                    // Converter preço para número e somar ao total
                    const priceText = item.price.toString();
                    const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
                    subtotal += price;

                    // Determinar classe do ícone
                    const iconClass = getIconClass(item.name);

                    // Criar tags para features
                    let featureTags = '';
                    if (item.features && item.features.length > 0) {
                        item.features.forEach(feature => {
                            featureTags += `<span class="feature-tag">${feature}</span>`;
                        });
                    } else {
                        // Features padrão baseadas no nome do plano
                        if (item.name.toLowerCase().includes('starter') || item.name.toLowerCase().includes('básic')) {
                            featureTags = `
                                <span class="feature-tag">5 usuários</span>
                                <span class="feature-tag">20GB espaço</span>
                            `;
                        } else if (item.name.toLowerCase().includes('standard') || item.name.toLowerCase().includes('tradic')) {
                            featureTags = `
                                <span class="feature-tag">25 usuários</span>
                                <span class="feature-tag">50GB espaço</span>
                            `;
                        } else {
                            featureTags = `
                                <span class="feature-tag">Usuários ilimitados</span>
                                <span class="feature-tag">100GB espaço</span>
                            `;
                        }
                    }

                    content += `
                        <div class="cart-item">
                            <div class="icon-basic">
                                <div class="${item.icon}"></div>
                            </div>
                            <div class="item-details">
                                <div class="item-name"><h3>${item.name}</h3></div>
                                <div class="item-name"><p>${item.desc}</p></div>
                            </div>
                            <div class="item-price">R$ ${priceText}</div>
                            <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
                        </div>
                    `;
                });

                // Calcular o total (podem ser adicionadas lógicas para frete ou desconto aqui)
                const shipping = 0; // Frete (se houver)
                const discount = 0; // Desconto (se houver)
                total = subtotal + shipping - discount;

                // Adicionar o resumo do carrinho com design moderno
                content += `
                    <div class="cart-summary">
                        <div class="summary-container">
                            <div class="summary-row">
                                <div class="summary-label">Subtotal:</div>
                                <div class="summary-value">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-row total">
                                <div class="summary-label">Total:</div>
                                <div class="summary-value">R$ ${total.toFixed(2).replace('.', ',')}</div>
                            </div>
                            <a href="opcoes.html" class="checkout-button">Finalizar Compra</a>
                        </div>
                    </div>
                `;

                cartItems.innerHTML = content;
            } else {
                cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            }
        } catch (e) {
            console.error('Erro ao processar carrinho:', e);
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        }
    } else {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
    }
}

// Função para remover item do carrinho
function removeFromCart(index) {
    const cart = getCookie('shopping-cart');

    if (cart) {
        try {
            const items = JSON.parse(cart);
            items.splice(index, 1);
            setCookie('shopping-cart', JSON.stringify(items), 7);
            updateCartIcon();
            updateCartContent();
        } catch (e) {
            console.error('Erro ao remover item do carrinho:', e);
        }
    }
}

// Função para finalizar a compra
function checkout() {
    // Aqui você pode redirecionar para uma página de checkout
    window.location.href = 'opcoes.html';
}

// Função para alternar a visibilidade do carrinho
// Modificação opcional na função toggleCart para garantir que o menu mobile está fechado
function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    const cartOverlay = document.getElementById('cart-overlay');

    // Garantir que o menu mobile esteja fechado
    const menuIcon = document.getElementById('menu-mobile');
    const menuHeader = document.querySelector('.header-mobile');
    const backgroundBlur = document.getElementById('desfoque-de-fundo-mobile');

    if (menuIcon.classList.contains('active')) {
        menuIcon.classList.remove('active');
        menuHeader.style.display = 'none';
        backgroundBlur.style.display = 'none';
    }

    // Atualizar o conteúdo do carrinho quando aberto
    cartPopup.classList.toggle('active');
    if (cartOverlay) {
        cartOverlay.classList.toggle('active');
    }

    if (cartPopup.classList.contains('active')) {
        updateCartContent();
    }
}

// Função para chamar o carrinho a partir do menu mobile
function chamarCarrinho() {
    // Primeiro, fechar o menu mobile
    const menuIcon = document.getElementById('menu-mobile');
    const menuHeader = document.querySelector('.header-mobile');
    const backgroundBlur = document.getElementById('desfoque-de-fundo-mobile');

    // Verifica se o menu está aberto para então fechá-lo
    if (menuIcon.classList.contains('active')) {
        menuIcon.classList.remove('active');
        menuHeader.style.display = 'none';
        backgroundBlur.style.display = 'none';
    }

    // Em seguida, abrir o carrinho
    // Pequeno delay para garantir que o menu tenha fechado completamente
    setTimeout(() => {
        toggleCart();
    }, 100);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {


    // Adicionar eventos aos botões
    const serviceButtons = document.querySelectorAll('.service-button-class');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Obter informações do plano
            const card = this.closest('.pricing-card');
            const planName = card.querySelector('h2').textContent;
            const planPrice = card.querySelector('.price').textContent.match(/R\$\s*([0-9.,]+)/)[1];

            // Obter informações adicionais do plano ou usar valores padrão
            const planInfo = planInfo[planName] || {
                uuid: `plan-${Math.random().toString(36).substr(2, 9)}`,
                icon: '🚀',
                period: 'Assinatura Mensal',
                features: []
            };

            // Adicionar ao carrinho
            addToCart(planName, planPrice, planInfo.uuid, planInfo.icon, planInfo.period, planInfo.features);
        });
    });

    // Inicializar contagem do carrinho na carga da página
    updateCartIcon();

    // Atualizar conteúdo do carrinho se estiver aberto
    const cartPopup = document.getElementById('cart-popup');
    if (cartPopup && cartPopup.classList.contains('active')) {
        updateCartContent();
    }
});