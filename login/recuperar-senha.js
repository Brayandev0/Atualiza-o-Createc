// Sistema de recuperação de senha

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const formularioRecuperacao = document.getElementById('formulario-recuperacao');
    const formularioCodigo = document.getElementById('formulario-codigo');
    const formularioNovaSenha = document.getElementById('formulario-nova-senha');
    const campoEmail = document.getElementById('email');
    const campoCodigo = document.getElementById('codigo-verificacao');
    const campoNovaSenha = document.getElementById('nova-senha');
    const campoConfirmarSenha = document.getElementById('confirmar-senha');
    const erroEmail = document.getElementById('erro-email');
    const erroCodigo = document.getElementById('erro-codigo');
    const erroNovaSenha = document.getElementById('erro-nova-senha');
    const erroConfirmarSenha = document.getElementById('erro-confirmar-senha');
    const botaoRecuperar = document.getElementById('botao-recuperar');
    const botaoVerificar = document.getElementById('botao-verificar');
    const botaoSalvarSenha = document.getElementById('botao-salvar-senha');
    const reenviarCodigo = document.getElementById('reenviar-codigo');
    const mensagemSistema = document.getElementById('mensagem-sistema');
    const textoInstrucao = document.getElementById('texto-instrucao');
    
    // Variáveis de controle
    let emailRecuperacao = '';
    let codigoGerado = '';
    let tentativasRestantes = 3;
    
    // Configurar validação em tempo real para o campo de email
    campoEmail.addEventListener('input', function() {
        validarCampoEmail();
    });
    
    // Validação ao sair do campo (blur)
    campoEmail.addEventListener('blur', function() {
        validarCampoEmail(true);
    });
    
    // Validação para o campo de código
    campoCodigo.addEventListener('input', function() {
        validarCampoCodigo();
    });
    
    campoCodigo.addEventListener('blur', function() {
        validarCampoCodigo(true);
    });
    
    // Validação para os campos de senha
    campoNovaSenha.addEventListener('input', function() {
        validarCampoNovaSenha();
        validarConfirmacaoSenha();
    });
    
    campoNovaSenha.addEventListener('blur', function() {
        validarCampoNovaSenha(true);
    });
    
    campoConfirmarSenha.addEventListener('input', function() {
        validarConfirmacaoSenha();
    });
    
    campoConfirmarSenha.addEventListener('blur', function() {
        validarConfirmacaoSenha(true);
    });
    
    // Configurar botões mostrar/ocultar senha
    const botoesOcultarSenha = document.querySelectorAll('.botao-mostrar-senha');
    
    botoesOcultarSenha.forEach(botao => {
        botao.addEventListener('click', function() {
            const campoAlvo = document.getElementById(this.getAttribute('data-target'));
            alternarVisibilidadeSenha(campoAlvo, this);
        });
    });
    
    // Evento de reenvio de código
    reenviarCodigo.addEventListener('click', function(evento) {
        evento.preventDefault();
        enviarCodigoRecuperacao(emailRecuperacao, true);
    });
    
    // Processar submissão do formulário de recuperação (etapa 1)
    formularioRecuperacao.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Validar email antes de enviar
        const emailValido = validarCampoEmail(true);
        
        if (emailValido) {
            enviarCodigoRecuperacao(campoEmail.value.trim());
        }
    });
    
    // Processar submissão do formulário de código (etapa 2)
    formularioCodigo.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Validar código antes de verificar
        const codigoValido = validarCampoCodigo(true);
        
        if (codigoValido) {
            verificarCodigo();
        }
    });
    
    // Processar submissão do formulário de nova senha (etapa 3)
    formularioNovaSenha.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Validar campos de senha antes de salvar
        const senhaValida = validarCampoNovaSenha(true);
        const confirmacaoValida = validarConfirmacaoSenha(true);
        
        if (senhaValida && confirmacaoValida) {
            salvarNovaSenha();
        }
    });
    
    // Funções de validação
    
    function validarCampoEmail(exibirErro = false) {
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
    
    function validarCampoCodigo(exibirErro = false) {
        const codigo = campoCodigo.value.trim();
        let valido = true;
        let mensagem = '';
        
        // Verificar se está vazio
        if (codigo === '') {
            valido = false;
            mensagem = 'O código é obrigatório';
        } 
        // Verificar se tem exatamente 6 dígitos
        else if (!/^\d{6}$/.test(codigo)) {
            valido = false;
            mensagem = 'O código deve ter 6 dígitos numéricos';
        }
        
        // Aplicar classes e exibir mensagem se necessário
        if (!valido && exibirErro) {
            campoCodigo.classList.add('campo-invalido');
            campoCodigo.classList.remove('campo-valido');
            erroCodigo.textContent = mensagem;
        } else if (valido) {
            campoCodigo.classList.remove('campo-invalido');
            if (codigo !== '') {
                campoCodigo.classList.add('campo-valido');
            } else {
                campoCodigo.classList.remove('campo-valido');
            }
            erroCodigo.textContent = '';
        }
        
        return valido;
    }
    
    function validarCampoNovaSenha(exibirErro = false) {
        const senha = campoNovaSenha.value;
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
        // Verificar se tem pelo menos uma letra e um número
        else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(senha)) {
            valido = false;
            mensagem = 'A senha deve conter pelo menos uma letra e um número';
        }
        
        // Aplicar classes e exibir mensagem se necessário
        if (!valido && exibirErro) {
            campoNovaSenha.classList.add('campo-invalido');
            campoNovaSenha.classList.remove('campo-valido');
            erroNovaSenha.textContent = mensagem;
        } else if (valido) {
            campoNovaSenha.classList.remove('campo-invalido');
            if (senha !== '') {
                campoNovaSenha.classList.add('campo-valido');
            } else {
                campoNovaSenha.classList.remove('campo-valido');
            }
            erroNovaSenha.textContent = '';
        }
        
        return valido;
    }
    
    function validarConfirmacaoSenha(exibirErro = false) {
        const senha = campoNovaSenha.value;
        const confirmacao = campoConfirmarSenha.value;
        let valido = true;
        let mensagem = '';
        
        // Verificar se está vazio
        if (confirmacao === '') {
            valido = false;
            mensagem = 'A confirmação de senha é obrigatória';
        } 
        // Verificar se as senhas coincidem
        else if (senha !== confirmacao) {
            valido = false;
            mensagem = 'As senhas não coincidem';
        }
        
        // Aplicar classes e exibir mensagem se necessário
        if (!valido && exibirErro) {
            campoConfirmarSenha.classList.add('campo-invalido');
            campoConfirmarSenha.classList.remove('campo-valido');
            erroConfirmarSenha.textContent = mensagem;
        } else if (valido) {
            campoConfirmarSenha.classList.remove('campo-invalido');
            if (confirmacao !== '') {
                campoConfirmarSenha.classList.add('campo-valido');
            } else {
                campoConfirmarSenha.classList.remove('campo-valido');
            }
            erroConfirmarSenha.textContent = '';
        }
        
        return valido;
    }
    
    function alternarVisibilidadeSenha(campoSenha, botao) {
        if (campoSenha.type === 'password') {
            campoSenha.type = 'text';
            botao.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-olho-aberto">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        } else {
            campoSenha.type = 'password';
            botao.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icone-olho-fechado">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        }
    }
    
    // Exibir mensagem do sistema (sucesso, erro, info)
    function mostrarMensagemSistema(mensagem, tipo = 'info') {
        mensagemSistema.textContent = mensagem;
        mensagemSistema.className = 'mensagem-sistema';
        mensagemSistema.classList.add(tipo);
        mensagemSistema.classList.remove('escondido');
        
        // Rolar para a mensagem se necessário
        mensagemSistema.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Esconder mensagem do sistema
    function esconderMensagemSistema() {
        mensagemSistema.classList.add('escondido');
    }
    
    // Alternar entre formulários
    function mostrarFormulario(formulario) {
        // Ocultar todos os formulários
        formularioRecuperacao.classList.add('escondido');
        formularioCodigo.classList.add('escondido');
        formularioNovaSenha.classList.add('escondido');
        
        // Exibir apenas o formulário solicitado
        formulario.classList.remove('escondido');
    }
    
    // Funções para o fluxo de recuperação de senha
    
    function enviarCodigoRecuperacao(email, reenvio = false) {
        email = email.trim();
        emailRecuperacao = email;
        
        // Mostrar estado de carregamento
        botaoRecuperar.classList.add('carregando');
        esconderMensagemSistema();
        
        // Simulação de chamada para API (pode ser substituída por uma chamada real)
        setTimeout(function() {
            botaoRecuperar.classList.remove('carregando');
            
            // Verificar se o email existe (simulado)
            const emailExiste = verificarEmailExistente(email);
            
            if (emailExiste) {
                // Gerar código de verificação de 6 dígitos
                codigoGerado = gerarCodigo();
                
                // Em um sistema real, o código seria enviado por email
                console.log(`Código de verificação para ${email}: ${codigoGerado}`);
                
                if (reenvio) {
                    mostrarMensagemSistema('Um novo código foi enviado para seu email.', 'sucesso');
                } else {
                    mostrarMensagemSistema('Um código de verificação foi enviado para seu email.', 'sucesso');
                    
                    // Após 2 segundos, mostrar o próximo formulário
                    setTimeout(function() {
                        mostrarFormulario(formularioCodigo);
                        textoInstrucao.textContent = "Digite o código de 6 dígitos enviado para seu email";
                        esconderMensagemSistema();
                        campoCodigo.focus();
                    }, 2000);
                }
            } else {
                // Email não encontrado
                mostrarMensagemSistema('Email não encontrado em nossa base de dados.', 'erro');
                campoEmail.focus();
            }
        }, 1500); // Simular delay de rede
    }
    
    function verificarCodigo() {
        // Mostrar estado de carregamento
        botaoVerificar.classList.add('carregando');
        esconderMensagemSistema();
        
        const codigoDigitado = campoCodigo.value.trim();
        
        // Simulação de chamada para API
        setTimeout(function() {
            botaoVerificar.classList.remove('carregando');
            
            if (codigoDigitado === codigoGerado) {
                // Código correto
                mostrarMensagemSistema('Código verificado com sucesso!', 'sucesso');
                
                // Após 1.5 segundos, mostrar formulário de nova senha
                setTimeout(function() {
                    mostrarFormulario(formularioNovaSenha);
                    textoInstrucao.textContent = "Defina sua nova senha";
                    esconderMensagemSistema();
                    campoNovaSenha.focus();
                }, 1500);
            } else {
                // Código incorreto
                tentativasRestantes--;
                
                if (tentativasRestantes > 0) {
                    mostrarMensagemSistema(
                        `Código incorreto. Você tem mais ${tentativasRestantes} tentativa${tentativasRestantes > 1 ? 's' : ''}.`, 
                        'erro'
                    );
                    campoCodigo.value = '';
                    campoCodigo.focus();
                } else {
                    // Excedeu número de tentativas
                    mostrarMensagemSistema(
                        'Número de tentativas excedido. Solicite um novo código.', 
                        'erro'
                    );
                    
                    // Voltar para o primeiro formulário após 3 segundos
                    setTimeout(function() {
                        mostrarFormulario(formularioRecuperacao);
                        textoInstrucao.textContent = "Digite seu e-mail para receber as instruções de recuperação";
                        tentativasRestantes = 3; // Resetar contador
                        campoCodigo.value = '';
                        campoEmail.value = '';
                        campoEmail.focus();
                    }, 3000);
                }
            }
        }, 1500);
    }
    
    function salvarNovaSenha() {
        // Mostrar estado de carregamento
        botaoSalvarSenha.classList.add('carregando');
        esconderMensagemSistema();
        
        const novaSenha = campoNovaSenha.value;
        
        // Simulação de chamada para API
        setTimeout(function() {
            botaoSalvarSenha.classList.remove('carregando');
            
            // Simulação de atualização de senha (em um sistema real, isso seria feito no backend)
            if (atualizarSenhaUsuario(emailRecuperacao, novaSenha)) {
                // Senha atualizada com sucesso
                mostrarMensagemSistema(
                    'Senha alterada com sucesso! Redirecionando para o login...', 
                    'sucesso'
                );
                
                // Redirecionar para a página de login após 3 segundos
                setTimeout(function() {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                // Erro ao atualizar senha
                mostrarMensagemSistema(
                    'Ocorreu um erro ao atualizar sua senha. Tente novamente mais tarde.', 
                    'erro'
                );
            }
        }, 1500);
    }
    
    // Funções auxiliares
    
    function gerarCodigo() {
        // Gerar código aleatório de 6 dígitos
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    function verificarEmailExistente(email) {
        // Lista de usuários simulada (a mesma do login.js)
        const usuarios = [
            {
                id: 1,
                nome: 'João Silva',
                email: 'joao@exemplo.com',
                senha: '123456'
            },
            {
                id: 2,
                nome: 'Maria Souza',
                email: 'maria@exemplo.com',
                senha: 'senha123'
            },
            {
                id: 3,
                nome: 'Admin',
                email: 'admin@site.com',
                senha: 'admin123'
            }
        ];
        
        // Verificar se o email existe na lista
        return usuarios.some(usuario => usuario.email === email);
    }
    
    function atualizarSenhaUsuario(email, novaSenha) {
        // Em um sistema real, isso seria uma chamada para o backend
        // que atualizaria a senha no banco de dados
        
        // Simular sucesso na atualização (95% de chance de sucesso)
        return Math.random() < 0.95;
    }
});