// Sistema completo de login com validação e persistência (CORRIGIDO)

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário já está logado
    verificarLoginExistente();
    
    // Elementos do DOM
    const formularioLogin = document.getElementById('formulario-login');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');
    const erroEmail = document.getElementById('erro-email') || criarElementoErro('erro-email', campoEmail);
    const erroSenha = document.getElementById('erro-senha') || criarElementoErro('erro-senha', campoSenha);
    const botaoLogin = document.getElementById('botao-login');
    const mensagemSistema = document.getElementById('mensagem-sistema') || criarElementoMensagemSistema();
    const checkboxLembrar = document.getElementById('lembrar');
    
    // Função para criar elemento de erro se não existir
    function criarElementoErro(id, campoReferencia) {
        const erro = document.createElement('div');
        erro.id = id;
        erro.className = 'mensagem-erro';
        campoReferencia.parentNode.appendChild(erro);
        return erro;
    }
    
    // Função para criar elemento de mensagem do sistema se não existir
    function criarElementoMensagemSistema() {
        const mensagem = document.createElement('div');
        mensagem.id = 'mensagem-sistema';
        mensagem.className = 'mensagem-sistema escondido';
        if (formularioLogin) {
            formularioLogin.parentNode.insertBefore(mensagem, formularioLogin);
        }
        return mensagem;
    }
    
    // Configurar validação em tempo real para o campo de email
    if (campoEmail) {
        campoEmail.addEventListener('input', function() {
            validarCampoEmail();
        });
        
        // Configuração da validação ao sair do campo (blur)
        campoEmail.addEventListener('blur', function() {
            validarCampoEmail(true);
        });
    }
    
    // Configurar validação para o campo de senha
    if (campoSenha) {
        campoSenha.addEventListener('input', function() {
            validarCampoSenha();
        });
        
        campoSenha.addEventListener('blur', function() {
            validarCampoSenha(true);
        });
    }
    
    // Configurar botão mostrar/ocultar senha
    const botaoMostrarSenha = document.querySelector('.botao-mostrar-senha');
    
    if (botaoMostrarSenha && campoSenha) {
        // Inicializar com ícone de olho fechado
        botaoMostrarSenha.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-olho-fechado">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
        
        botaoMostrarSenha.addEventListener('click', function() {
            alternarVisibilidadeSenha();
        });
    }
    
    // Processar submissão do formulário
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(evento) {
            evento.preventDefault();
            
            // Validar todos os campos antes de enviar
            const emailValido = validarCampoEmail(true);
            const senhaValida = validarCampoSenha(true);
            
            if (emailValido && senhaValida) {
                realizarLogin();
            }
        });
    }
    
    // Funções de validação
    
    function validarCampoEmail(exibirErro = false) {
        if (!campoEmail || !erroEmail) return false;
        
        const email = campoEmail.value.trim();
        let valido = true;
        let mensagem = '';
        
        // Verificar se está vazio
        if (email === '') {
            valido = false;
            mensagem = 'O e-mail é obrigatório';
        } 
        // Verificar se é um formato de e-mail válido
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            valido = false;
            mensagem = 'Digite um e-mail válido';
        }
        
        // Aplicar classes e exibir mensagem se necessário
        if (!valido && exibirErro) {
            campoEmail.classList.add('campo-invalido');
            campoEmail.classList.remove('campo-valido');
            erroEmail.textContent = mensagem;
        } else if (valido) {
            campoEmail.classList.remove('campo-invalido');
            if (email !== '') {
                campoEmail.classList.add('campo-valido');
            } else {
                campoEmail.classList.remove('campo-valido');
            }
            erroEmail.textContent = '';
        }
        
        return valido;
    }
    
    function validarCampoSenha(exibirErro = false) {
        if (!campoSenha || !erroSenha) return false;
        
        const senha = campoSenha.value;
        let valido = true;
        let mensagem = '';
        
        // Verificar se está vazio
        if (senha === '') {
            valido = false;
            mensagem = 'A senha é obrigatória';
        } 
        // Verificar se atende ao tamanho mínimo
        else if (senha.length < 6) {
            valido = false;
            mensagem = 'A senha deve ter pelo menos 6 caracteres';
        }
        
        // Aplicar classes e exibir mensagem se necessário
        if (!valido && exibirErro) {
            campoSenha.classList.add('campo-invalido');
            campoSenha.classList.remove('campo-valido');
            erroSenha.textContent = mensagem;
        } else if (valido) {
            campoSenha.classList.remove('campo-invalido');
            if (senha !== '') {
                campoSenha.classList.add('campo-valido');
            } else {
                campoSenha.classList.remove('campo-valido');
            }
            erroSenha.textContent = '';
        }
        
        return valido;
    }
    
    function alternarVisibilidadeSenha() {
        if (!campoSenha || !botaoMostrarSenha) return;
        
        if (campoSenha.type === 'password') {
            campoSenha.type = 'text';
            botaoMostrarSenha.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-olho-aberto">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        } else {
            campoSenha.type = 'password';
            botaoMostrarSenha.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-olho-fechado">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        }
    }
    
    // Verificar se há um login salvo
    function verificarLoginExistente() {
        if (typeof estaAutenticado === 'function' && estaAutenticado()) {
            // Validar sessão existente com o servidor
            if (typeof validarSessao === 'function') {
                validarSessao().then(valido => {
                    if (valido && typeof redirecionarParaDashboard === 'function') {
                        redirecionarParaDashboard();
                    }
                });
            }
        }
    }
    
    // Função para realizar o login
    function realizarLogin() {
        let API_BASE_URL = 'http://127.0.0.1:8080'
        if (!campoEmail || !campoSenha || !botaoLogin) return;
        
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        
        // Mostrar estado de carregamento
        botaoLogin.classList.add('carregando');
        botaoLogin.disabled = true;
        if (typeof esconderMensagemSistema === 'function') {
            esconderMensagemSistema();
        }
        
        // Preparar dados para envio
        const dadosLogin = {
            email: email,
            senha: senha
        };
        
        // Fazer requisição para API
        fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
        })
        .then(response => response.json())
        .then(data => {
            botaoLogin.classList.remove('carregando');
            botaoLogin.disabled = false;
            
            if (data.code === 200) {
                // Login bem-sucedido
                if (typeof mostrarMensagemSistema === 'function') {
                    mostrarMensagemSistema('Login realizado com sucesso! Redirecionando...', 'sucesso');
                }
                
                // Salvar dados do usuário e token - CORRIGIDO
                if (typeof salvarSessaoUsuario === 'function') {
                    // Verificar a estrutura de resposta
                    const token = data.User?.Token || data.token;
                    const userData = {
                        nome: data.User?.nome || '',
                        email: data.User?.email || email,
                        telefone: data.User?.telefone || ''
                    };
                    
                    salvarSessaoUsuario(token, userData);
                }
                
                // Redirecionar após um pequeno delay
                setTimeout(function() {
                    if (typeof redirecionarParaDashboard === 'function') {
                        redirecionarParaDashboard();
                    } else {
                        window.location.href = '/index.html';
                    }
                }, 1500);
            } else {
                // Login falhou
                if (typeof mostrarMensagemSistema === 'function') {
                    mostrarMensagemSistema('E-mail ou senha incorretos. Tente novamente.', 'erro');
                }
                if (campoSenha) {
                    campoSenha.value = '';
                    campoSenha.classList.remove('campo-valido');
                    campoSenha.focus();
                }
            }
        })
        .catch(erro => {
            console.error('Erro ao realizar login:', erro);
            botaoLogin.classList.remove('carregando');
            botaoLogin.disabled = false;
            if (typeof mostrarMensagemSistema === 'function') {
                mostrarMensagemSistema('Erro ao conectar com o servidor. Tente novamente mais tarde.', 'erro');
            }
        });
    }
    
    // Inicializar validações de formulário se existirem
    if (typeof inicializarValidacoes === 'function') {
        inicializarValidacoes();
    }
});