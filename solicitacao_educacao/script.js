// script.js - Formulário de Solicitação de Acesso EducaFinance

document.addEventListener('DOMContentLoaded', function() {
    initFormSubmission();
    initPhoneMask();
    initCPFValidation();
});

/* ============================
   MÁSCARA DE TELEFONE
   ============================ */
function initPhoneMask() {
    const phoneInput = document.getElementById('telefone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        
        e.target.value = value;
    });
}

/* ============================
   VALIDAÇÃO DE CPF
   ============================ */
function initCPFValidation() {
    const cpfInput = document.getElementById('cpf');
    
    if (!cpfInput) return;
    
    // Permitir apenas números
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        
        // Validação básica de tamanho
        if (value.length > 11) {
            e.target.value = value.substring(0, 11);
        }
    });
    
    // Validação ao perder foco
    cpfInput.addEventListener('blur', function() {
        const value = this.value.replace(/\D/g, '');
        
        if (value.length === 11) {
            // CPF válido tem 11 dígitos
            this.classList.remove('error');
        } else if (value.length > 0) {
            this.classList.add('error');
        }
    });
}

/* ============================
   SUBMISSÃO DO FORMULÁRIO
   ============================ */
function initFormSubmission() {
    const form = document.getElementById('accessForm');
    const submitButton = document.getElementById('submitButton');
    
    if (!form || !submitButton) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar checkbox de aceitação
        const privacyCheckbox = document.getElementById('aceitoPolitica');
        if (!privacyCheckbox.checked) {
            alert('Por favor, aceite a Política de Privacidade para continuar.');
            privacyCheckbox.focus();
            return;
        }
        
        // Validar CPF
        const cpfValue = document.getElementById('cpf').value.replace(/\D/g, '');
        if (cpfValue.length !== 11) {
            alert('Por favor, insira um CPF válido com 11 dígitos.');
            document.getElementById('cpf').focus();
            return;
        }
        
        // Desabilitar botão durante processamento
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="button-text">Processando solicitação...</span>';
        
        try {
            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                cpf: cpfValue,
                telefone: document.getElementById('telefone').value.trim(),
                objetivo: document.getElementById('objetivo').value.trim(),
                dataEnvio: new Date().toLocaleString('pt-BR'),
                aceitoPolitica: 'Sim',
                projeto: 'EducaFinance by SAMGROWTHLABS'
            };
            
            // Validar dados obrigatórios
            if (!formData.nome || !formData.telefone || !formData.objetivo) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
            }
            
            // Validar nome (mínimo 2 palavras)
            const nomeParts = formData.nome.split(' ').filter(part => part.length > 1);
            if (nomeParts.length < 2) {
                throw new Error('Por favor, informe seu nome completo (nome e sobrenome).');
            }
            
            // Formatar mensagem para WhatsApp
            const message = formatWhatsAppMessage(formData);
            
            // Abrir WhatsApp
            const whatsappUrl = `https://wa.me/5544988456344?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Feedback visual
            showSuccessMessage();
            
            // Limpar formulário após 2 segundos
            setTimeout(() => {
                form.reset();
                submitButton.disabled = false;
                submitButton.innerHTML = '<span class="button-text">Enviar Solicitação e Ir para WhatsApp</span><span class="button-icon">→</span>';
            }, 2000);
            
        } catch (error) {
            // Tratar erro
            console.error('Erro no envio:', error);
            alert(error.message || 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
            
            // Reabilitar botão
            submitButton.disabled = false;
            submitButton.innerHTML = '<span class="button-text">Enviar Solicitação e Ir para WhatsApp</span><span class="button-icon">→</span>';
        }
    });
}

/* ============================
   FORMATAR MENSAGEM DO WHATSAPP
   ============================ */
function formatWhatsAppMessage(data) {
    return `*NOVA SOLICITAÇÃO DE ACESSO - EDUCAFINANCE*

*Projeto:* EducaFinance by SAMGROWTHLABS

*Dados do Solicitante:*
• Nome: ${data.nome}
• CPF: ${data.cpf}
• Telefone: ${data.telefone}

*Objetivo Declarado:*
${data.objetivo}

*Data do envio:* ${data.dataEnvio}

*Aceite da Política de Privacidade:* ${data.aceitoPolitica}

---
_Esta solicitação foi enviada via formulário do site EducaFinance._
_Confirmar recebimento e iniciar processo de cadastro._

*Lembretes Importantes:*
• EducaFinance é projeto educacional
• Não fazemos recomendações financeiras
• Ensinamos conceitos, não tomamos decisões
• Acompanhamento personalizado via WhatsApp`;
}

/* ============================
   MENSAGEM DE SUCESSO
   ============================ */
function showSuccessMessage() {
    // Criar overlay de sucesso
    const successOverlay = document.createElement('div');
    successOverlay.className = 'success-overlay';
    successOverlay.innerHTML = `
        <div class="success-modal">
            <div class="success-icon">✓</div>
            <h3 class="success-title">Solicitação Enviada!</h3>
            <p class="success-message">Estamos redirecionando você para o WhatsApp. Aguarde alguns instantes.</p>
            <p class="success-note">Se o redirecionamento não funcionar automaticamente, por favor, abra o WhatsApp manualmente e entre em contato.</p>
        </div>
    `;
    
    // Adicionar estilos
    const styles = document.createElement('style');
    styles.textContent = `
        .success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal {
            background-color: var(--gray-100);
            padding: var(--space-xl);
            border-radius: var(--radius-lg);
            text-align: center;
            max-width: 400px;
            width: 90%;
            border: 1px solid var(--gray-200);
            animation: slideUp 0.3s ease;
        }
        
        .success-icon {
            width: 64px;
            height: 64px;
            background-color: var(--white);
            color: var(--black);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 600;
            margin: 0 auto var(--space-lg);
        }
        
        .success-title {
            font-size: 1.5rem;
            margin-bottom: var(--space-sm);
            color: var(--white);
        }
        
        .success-message {
            color: var(--gray-600);
            margin-bottom: var(--space-sm);
            line-height: 1.6;
        }
        
        .success-note {
            font-size: 0.875rem;
            color: var(--gray-500);
            font-style: italic;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(successOverlay);
    
    // Remover overlay após 5 segundos
    setTimeout(() => {
        if (successOverlay.parentNode) {
            successOverlay.remove();
        }
    }, 5000);
}

/* ============================
   VALIDAÇÃO EM TEMPO REAL
   ============================ */
function initRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-control[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        field.classList.add('error');
        return false;
    }
    
    // Validações específicas por tipo
    if (field.id === 'cpf') {
        const cpfValue = value.replace(/\D/g, '');
        if (cpfValue.length !== 11) {
            field.classList.add('error');
            return false;
        }
    }
    
    if (field.id === 'telefone') {
        const phoneValue = value.replace(/\D/g, '');
        if (phoneValue.length < 10 || phoneValue.length > 11) {
            field.classList.add('error');
            return false;
        }
    }
    
    if (field.id === 'nome') {
        const nomeParts = value.split(' ').filter(part => part.length > 1);
        if (nomeParts.length < 2) {
            field.classList.add('error');
            return false;
        }
    }
    
    field.classList.remove('error');
    return true;
}

// Inicializar validação em tempo real
setTimeout(initRealTimeValidation, 100);