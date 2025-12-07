// script.js - Formulário de Solicitação EducaFinance

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
    const form = document.getElementById('solicitationForm');
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
        submitButton.innerHTML = '<span class="button-text">Processando...</span>';
        
        try {
            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                cpf: cpfValue,
                telefone: document.getElementById('telefone').value.trim(),
                motivo: document.getElementById('motivo').value.trim(),
                dataEnvio: new Date().toLocaleString('pt-BR'),
                aceitoPolitica: 'Sim'
            };
            
            // Validar dados obrigatórios
            if (!formData.nome || !formData.telefone || !formData.motivo) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
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
                submitButton.innerHTML = '<span class="button-text">Enviar e Continuar no WhatsApp</span><span class="button-icon">→</span>';
            }, 2000);
            
        } catch (error) {
            // Tratar erro
            console.error('Erro no envio:', error);
            alert(error.message || 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
            
            // Reabilitar botão
            submitButton.disabled = false;
            submitButton.innerHTML = '<span class="button-text">Enviar e Continuar no WhatsApp</span><span class="button-icon">→</span>';
        }
    });
}

/* ============================
   FORMATAR MENSAGEM DO WHATSAPP
   ============================ */
function formatWhatsAppMessage(data) {
    return `*NOVA SOLICITAÇÃO EDUCAFINANCE - SamGrowthLab*

👤 *Nome:* ${data.nome}
📄 *CPF:* ${data.cpf}
📱 *Telefone:* ${data.telefone}

🎯 *Objetivo/Motivo:*
${data.motivo}

📅 *Data do envio:* ${data.dataEnvio}

✅ *Concordo com a Política de Privacidade:* ${data.aceitoPolitica}

---
_Esta mensagem foi enviada via formulário do site EducaFinance by SamGrowthLab._
_Por favor, responda para continuarmos com sua orientação educacional._`;
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
            <p class="success-message">Aguarde enquanto redirecionamos você para o WhatsApp (44) 98845-6344.</p>
            <p class="success-note">Se o redirecionamento não funcionar, por favor, abra o WhatsApp manualmente.</p>
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
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-modal {
            background-color: var(--white);
            padding: var(--space-xl);
            border-radius: var(--radius-lg);
            text-align: center;
            max-width: 400px;
            width: 90%;
            animation: slideUp 0.3s ease;
        }
        
        .success-icon {
            width: 64px;
            height: 64px;
            background-color: var(--blue);
            color: var(--white);
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
            color: var(--black);
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
    
    field.classList.remove('error');
    return true;
}

// Inicializar validação em tempo real
setTimeout(initRealTimeValidation, 100);