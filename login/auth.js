// Arquivo auth.js - Funções de autenticação centralizadas (CORRIGIDO)

// Configuração da API
const API_BASE_URL = 'https://chefnow.shop';

// Função para manipular cookies
function setCookie(nome, valor, diasExpiracao) {
    const data = new Date();
    data.setTime(data.getTime() + (diasExpiracao * 24 * 60 * 60 * 1000));
    const expiracao = `expires=${data.toUTCString()}`;
    document.cookie = `${nome}=${valor};${expiracao};path=/`;
}

function getCookie(nome) {
    const nomeCookie = `${nome}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nomeCookie) === 0) {
            return cookie.substring(nomeCookie.length, cookie.length);
        }
    }
    return null;
}

function deleteCookie(nome) {
    document.cookie = `${nome}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Funções para gestão da sessão do usuário
function salvarSessaoUsuario(token, dadosUsuario) {
    // Salvar token no localStorage para persistência
    localStorage.setItem('authToken', token);
    
    // Salvar dados do usuário em cookies para diminuir requisições
    setCookie('userName', dadosUsuario.nome, 3); // 3 dias
    setCookie('userEmail', dadosUsuario.email, 3);
    setCookie('userTelefone', dadosUsuario.telefone || '', 3);
    
    // Salvar dados completos na sessão
    sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
}

function obterDadosUsuario() {
    // Primeiro tenta obter do sessionStorage (completo)
    const dadosSession = sessionStorage.getItem('usuarioLogado');
    if (dadosSession) {
        return JSON.parse(dadosSession);
    }
    
    // Se não houver no sessionStorage, construir com cookies
    const nome = getCookie('userName');
    const email = getCookie('userEmail');
    const telefone = getCookie('userTelefone');
    
    if (nome && email) {
        return { nome, email, telefone };
    }
    
    return null;
}

function obterToken() {
    return localStorage.getItem('authToken');
}

function limparSessao() {
    // Limpar token
    localStorage.removeItem('authToken');
    
    // Limpar cookies
    deleteCookie('userName');
    deleteCookie('userEmail');
    deleteCookie('userTelefone');
    
    // Limpar dados da sessão
    sessionStorage.removeItem('usuarioLogado');
}

// Verifica se o usuário está autenticado
function estaAutenticado() {
    const token = obterToken();
    return !!token; // Converter para booleano
}

// Função para fazer o redirecionamento após autenticação
function redirecionarParaDashboard() {
    window.location.href = '/index.html';
}

// Função para redirecionar para login quando não autenticado
function redirecionarParaLogin() {
    window.location.href = '/login/login.html';
}

// Função para verificar se o token ainda é válido
function validarToken(token) {
    if (!token) return false;
    
    try {
        // Verificar se o token não está expirado
        // Neste exemplo, apenas verificamos se existe
        return true;
    } catch (e) {
        console.error('Erro ao validar token:', e);
        return false;
    }
}

// Validar dados de usuário
function validarSessao() {
    if (!estaAutenticado()) {
        return Promise.resolve(false);
    }
    
    const token = obterToken();
    if (!token) {
        limparSessao();
        return Promise.resolve(false);
    }
    
    // Fazer requisição para /dash/ para verificar se o token ainda é válido
    return fetch(`${API_BASE_URL}/dash/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        // Se não for 2xx, limpar sessão e retornar falso
        limparSessao();
        return Promise.reject('Token inválido');
    })
    .then(data => {
        // Atualizar dados do usuário com os dados recebidos
        // Verificando se o objeto usa 'user' ou 'User'
        const userData = data.user || data.User || {};
        
        if (userData) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(userData));
            setCookie('userName', userData.nome, 3);
            setCookie('userEmail', userData.email, 3);
            setCookie('userTelefone', userData.telefone || '', 3);
        }
        return true;
    })
    .catch(erro => {
        console.error('Erro ao validar sessão:', erro);
        limparSessao();
        return false;
    });
}

// Função para mostrar mensagem de sistema (comum a várias páginas)
function mostrarMensagemSistema(mensagem, tipo = 'info') {
    const mensagemSistema = document.getElementById('mensagem-sistema');
    if (!mensagemSistema) return;
    
    mensagemSistema.textContent = mensagem;
    mensagemSistema.className = 'mensagem-sistema';
    mensagemSistema.classList.add(tipo);
    mensagemSistema.classList.remove('escondido');
    
    // Rolar para a mensagem se necessário
    mensagemSistema.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function esconderMensagemSistema() {
    const mensagemSistema = document.getElementById('mensagem-sistema');
    if (mensagemSistema) {
        mensagemSistema.classList.add('escondido');
    }
}

// Exportar funções para uso global
window.estaAutenticado = estaAutenticado;
window.obterDadosUsuario = obterDadosUsuario;
window.limparSessao = limparSessao;
window.validarSessao = validarSessao;
window.validarToken = validarToken;  // Exportar a função validarToken
window.mostrarMensagemSistema = mostrarMensagemSistema;
window.esconderMensagemSistema = esconderMensagemSistema;
window.redirecionarParaLogin = redirecionarParaLogin;
window.redirecionarParaDashboard = redirecionarParaDashboard;
window.salvarSessaoUsuario = salvarSessaoUsuario;  // Exportar para uso global