document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!estaAutenticado()) {
        redirecionarParaLogin();
        return;
    }
    
    // Validar sessão com servidor
    validarSessao().then(valido => {
        if (!valido) {
            redirecionarParaLogin();
            return;
        }
        
        // Carregar dados do usuário na interface
        carregarDadosUsuarioInterface();
    });
    
    // Função para carregar dados do usuário na interface
    function carregarDadosUsuarioInterface() {
        const dadosUsuario = obterDadosUsuario();
        
        if (!dadosUsuario) {
            redirecionarParaLogin();
            return;
        }
        
        // Preencher elementos da interface com os dados do usuário
        const elementosNome = document.querySelectorAll('.usuario-nome');
        const elementosEmail = document.querySelectorAll('.usuario-email');
        const elementosTelefone = document.querySelectorAll('.usuario-telefone');
        
        elementosNome.forEach(el => {
            el.textContent = dadosUsuario.nome;
        });
        
        elementosEmail.forEach(el => {
            el.textContent = dadosUsuario.email;
        });
        
        elementosTelefone.forEach(el => {
            el.textContent = dadosUsuario.telefone || 'Não informado';
        });
        
        // Mostrar a interface após carregar dados
        const conteudoProtegido = document.getElementById('conteudo-protegido');
        if (conteudoProtegido) {
            conteudoProtegido.classList.remove('escondido');
        }
        
        const loaderPagina = document.getElementById('loader-pagina');
        if (loaderPagina) {
            loaderPagina.classList.add('escondido');
        }
    }
    
    // Event listener para botão de logout
    const botaoLogout = document.getElementById('botao-logout');
    if (botaoLogout) {
        botaoLogout.addEventListener('click', function(event) {
            event.preventDefault();
            limparSessao();
            redirecionarParaLogin();
        });
    }
    
    // Event listener para botão de redefinir dados (se existir)
    const formRedefinirDados = document.getElementById('form-redefinir-dados');
    if (formRedefinirDados) {
        formRedefinirDados.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const novoNome = document.getElementById('novo-nome').value.trim();
            const novoEmail = document.getElementById('novo-email').value.trim();
            const novoTelefone = document.getElementById('novo-telefone').value.trim();
            
            const botaoRedefinir = formRedefinirDados.querySelector('button[type="submit"]');
            botaoRedefinir.classList.add('carregando');
            botaoRedefinir.disabled = true;
            
            const dadosAtualizacao = {
                nome: novoNome || undefined,
                email: novoEmail || undefined,
                telefone: novoTelefone || undefined
            };
            
            // Remover campos undefined
            Object.keys(dadosAtualizacao).forEach(key => {
                if (dadosAtualizacao[key] === undefined) {
                    delete dadosAtualizacao[key];
                }
            });
            
            // Enviar requisição para API
            fetch(`${API_BASE_URL}/dash/redefinir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${obterToken()}`
                },
                body: JSON.stringify(dadosAtualizacao)
            })
            .then(response => response.json())
            .then(data => {
                botaoRedefinir.classList.remove('carregando');
                botaoRedefinir.disabled = false;
                
                if (data.code === 200) {
                    mostrarMensagemSistema('Dados atualizados com sucesso!', 'sucesso');
                    
                    // Atualizar dados na sessão e cookies
                    const dadosAtuais = obterDadosUsuario();
                    const dadosAtualizados = {
                        ...dadosAtuais,
                        ...dadosAtualizacao
                    };
                    
                    sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosAtualizados));
                    setCookie('userName', dadosAtualizados.nome, 3);
                    setCookie('userEmail', dadosAtualizados.email, 3);
                    setCookie('userTelefone', dadosAtualizados.telefone || '', 3);
                    
                    // Recarregar a interface
                    setTimeout(() => {
                        carregarDadosUsuarioInterface();
                    }, 1000);
                } else {
                    mostrarMensagemSistema(data.msg || 'Erro ao atualizar dados. Tente novamente.', 'erro');
                }
            })
            .catch(erro => {
                console.error('Erro ao atualizar dados:', erro);
                botaoRedefinir.classList.remove('carregando');
                botaoRedefinir.disabled = false;
                mostrarMensagemSistema('Erro ao conectar com o servidor. Tente novamente mais tarde.', 'erro');
            });
        });
    }
});