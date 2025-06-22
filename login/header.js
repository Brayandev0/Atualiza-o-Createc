// Sistema de autenticação do header otimizado
document.addEventListener('DOMContentLoaded', function() {

    function inicializarHeader() {
        if (typeof estaAutenticado !== 'function') {
            console.error('auth.js não carregado');
            return;
        }

        const headerContainer = document.querySelector('.header-links-container');
        if (!headerContainer) {
            console.error('Container header não encontrado');
            return;
        }

        adicionarEstilos();
        atualizarInterface(headerContainer);

        if (estaAutenticado()) {
            validarSessao()
                .then(() => atualizarInterface(headerContainer))
                .catch(() => atualizarInterface(headerContainer));
        }
    }

    function adicionarEstilos() {
        if (document.getElementById('header-auth-styles')) return;

        const style = document.createElement('style');
        style.id = 'header-auth-styles';
        style.textContent = `
            .perfil-container, .login-container {
                position: relative;
                display: inline-block;
            }

            .perfil-button, .login-button {
                display: flex;
                margin-top: 10px; 
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: linear-gradient(45deg, #ff2e51, #8b002e);
                color: white;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                font-size: 15px;
                transition: all 0.3s ease;
            }

            .perfil-button:hover, .login-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 46, 81, 0.3);
            }
            
            .perfil-dropdown, .login-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 220px;
                background-color: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 8px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                margin-top: 5px;
            }
            
            .perfil-container:hover .perfil-dropdown,
            .login-container:hover .login-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .perfil-dropdown ul, .login-dropdown ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .perfil-dropdown li, .login-dropdown li {
                padding: 0;
                border-bottom: 1px solid #eee;
            }
            
            .perfil-dropdown li:last-child, .login-dropdown li:last-child {
                border-bottom: none;
            }
            
            .perfil-dropdown a, .login-dropdown a {
                display: block;
                padding: 12px 16px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.2s;
            }
            
            .perfil-dropdown a:hover, .login-dropdown a:hover {
                background-color: #f5f5f5;
            }
            
            #botao-logout {
                color: #e74c3c;
            }

            #botao-logout:hover {
                background-color: #fee;
            }

            @media (max-width: 1024px) {
                .perfil-button, .login-button {
                    display: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function atualizarInterface(container) {
        const usuario = obterUsuarioAtivo();

        limparContainers(container);

        if (usuario) {
            criarPerfilDropdown(container, usuario);
        } else {
            criarLoginDropdown(container);
        }
    }

    function limparContainers(container) {
        const elementos = container.querySelectorAll('.perfil-container, .login-container');
        elementos.forEach(el => el.remove());
    }

    function criarPerfilDropdown(container, usuario) {
        const perfilContainer = document.createElement('div');
        perfilContainer.className = 'perfil-container';

        const nomeUsuario = usuario.nome ? usuario.nome.split(' ')[0] : 'Perfil';

        perfilContainer.innerHTML = `
            <button class="perfil-button">
                <i class="fas fa-user"></i>
                <span>${nomeUsuario}</span>
            </button>
            <div class="perfil-dropdown">
                <ul>
                    <li><a href="/perfil">Editar Dados</a></li>
                    <li><a href="/perfil">Processos em Andamento</a></li>
                    <li><a href="/perfil">Histórico de Compras</a></li>
                    <li><a href="#" id="botao-logout">Sair</a></li>
                </ul>
            </div>
        `;

        container.appendChild(perfilContainer);

        configurarLogout(perfilContainer);
    }

    function criarLoginDropdown(container) {
        const loginContainer = document.createElement('div');
        loginContainer.className = 'login-container';

        loginContainer.innerHTML = `
            <button class="login-button">
                <i class="fas fa-sign-in-alt"></i> Login
            </button>
            <div class="login-dropdown">
                <ul>
                    <li><a href="/login/login.html">Fazer Login</a></li>
                    <li><a href="/login/cadastro.html">Cadastre-se</a></li>
                </ul>
            </div>
        `;

        container.appendChild(loginContainer);
    }

    function configurarLogout(container) {
        const botaoLogout = container.querySelector('#botao-logout');
        botaoLogout.addEventListener('click', function(e) {
            e.preventDefault();

            if (typeof limparSessao === 'function') {
                limparSessao();
            }

            window.location.href = '/index.html';
        });
    }

    function obterUsuarioAtivo() {
        if (typeof estaAutenticado === 'function' && estaAutenticado()) {
            return typeof obterDadosUsuario === 'function' ? obterDadosUsuario() : null;
        }
        return null;
    }

    // Inicializar
    try {
        inicializarHeader();
    } catch (erro) {
        console.error('Erro ao inicializar header:', erro);
    }
});