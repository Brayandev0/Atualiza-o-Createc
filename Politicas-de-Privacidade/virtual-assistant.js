import config from './config.js';

class VirtualAssistant {
  constructor() {
    this.config = config.assistant;
    this.isOpen = false;
    this.messages = [];
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    this.createBubble();
    this.createChatContainer();
    this.addMessage(this.config.welcomeMessage, 'assistant');
    this.addMessage(this.config.emailPrompt, 'assistant');
    
    // Handle resize events for better responsiveness
    window.addEventListener('resize', () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== this.isMobile) {
        this.isMobile = newIsMobile;
        this.adjustForScreenSize();
      }
    });
  }
  
  adjustForScreenSize() {
    if (this.isMobile) {
      // Adjust for mobile screens
      if (this.isOpen) {
        this.container.style.height = '80vh';
        this.container.style.width = '90%';
        this.container.style.right = '5%';
        this.container.style.left = '5%';
        this.container.style.bottom = '10px';
        
        // Ensure the input area doesn't get hidden
        const inputArea = this.container.querySelector('.assistant-input-area');
        if (inputArea) {
          inputArea.style.position = 'sticky';
          inputArea.style.bottom = '0';
          inputArea.style.backgroundColor = '#f5f5f5';
          inputArea.style.zIndex = '1';
        }
        
        // Adjust quick options to be more mobile-friendly
        const quickOptions = this.container.querySelectorAll('.quick-option-btn');
        quickOptions.forEach(btn => {
          btn.style.whiteSpace = 'normal';
          btn.style.textAlign = 'left';
          btn.style.height = 'auto';
          btn.style.lineHeight = '1.4';
          btn.style.fontSize = '14px';
        });
      }
    } else {
      // Reset to desktop sizes
      this.container.style.height = '450px';
      this.container.style.width = '350px';
      this.container.style.right = '20px';
      this.container.style.left = 'auto';
      this.container.style.bottom = '20px';
      
      // Reset any mobile-specific styles
      const inputArea = this.container.querySelector('.assistant-input-area');
      if (inputArea) {
        inputArea.style.position = '';
        inputArea.style.bottom = '';
        inputArea.style.zIndex = '';
      }
      
      const quickOptions = this.container.querySelectorAll('.quick-option-btn');
      quickOptions.forEach(btn => {
        btn.style.whiteSpace = '';
        btn.style.textAlign = '';
        btn.style.height = '';
        btn.style.lineHeight = '';
        btn.style.fontSize = '';
      });
    }
    
    // Adjust bubble size and position
    if (this.isMobile) {
      this.bubble.style.bottom = '10px';
      this.bubble.style.right = '10px';
    } else {
      this.bubble.style.bottom = '20px';
      this.bubble.style.right = '20px';
    }
  }  

  respondToOption(option) {
    setTimeout(() => {
      if (option === this.config.quickOptions[0]) {
        this.addMessage('Temos diferentes planos para atender suas necessidades. Você pode escolher entre nossos planos de hospedagem compartilhada, VPS ou servidores dedicados. Poderia me contar mais sobre o seu projeto?', 'assistant');
      } else if (option === this.config.quickOptions[1]) {
        this.addMessage('Migrar para a Createc é muito fácil! Oferecemos migração gratuita para novos clientes. Você já possui hospedagem em outro provedor?', 'assistant');
      } else if (option === this.config.quickOptions[2]) {
        this.addMessage('Para reativar sua hospedagem, acesse o painel do cliente ou entre em contato com nosso suporte técnico pelo telefone 0800-123-4567. Posso ajudar com mais alguma coisa?', 'assistant');
      } else {
        this.addMessage('Por favor, descreva sua dúvida para que eu possa ajudar da melhor forma possível.', 'assistant');
      }
    }, 500);
  }

  openChat() {
    this.isOpen = true;
    this.container.style.display = 'flex';
    this.bubble.style.display = 'none';
    
    // Adjust container size for mobile/desktop
    this.adjustForScreenSize();
    
    // If on mobile, slide from bottom with animation
    if (this.isMobile) {
      this.container.style.animation = 'slideUp 0.3s ease-in-out';
    }
  }

  closeChat() {
    this.isOpen = false;
    this.container.style.display = 'none';
    this.bubble.style.display = 'flex';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.assistant = new VirtualAssistant();
});

export default VirtualAssistant;