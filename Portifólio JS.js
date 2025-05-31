document.addEventListener('DOMContentLoaded', function() {
    // Editar "Sobre Mim"
    document.querySelectorAll('.descricao-perfil').forEach(function (paragrafo) {
        paragrafo.addEventListener('click', function () {
            const textoAtual = this.textContent;
            const input = document.createElement('textarea');
            input.value = textoAtual;
            input.style.width = '100%';
            input.style.height = '100px';

            this.replaceWith(input);
            input.focus();

            input.addEventListener('blur', function () {
                const novoParagrafo = document.createElement('p');
                novoParagrafo.className = 'descricao-perfil';
                novoParagrafo.textContent = input.value;

                input.replaceWith(novoParagrafo);
                novoParagrafo.addEventListener('click', arguments.callee);
            });
        });
    });

    // Adicionar UC
    const inputUC = document.getElementById('nova-uc');
    const botaoAdicionar = document.getElementById('adicionar-uc');
    const listaUCs = document.getElementById('lista-ucs');

    botaoAdicionar.addEventListener('click', function () {
        const novaUC = inputUC.value.trim();
        if (novaUC !== '') {
            const li = document.createElement('li');
            li.textContent = novaUC;
            li.setAttribute('draggable', true);
            li.style.cursor = 'grab';

            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = '❌';
            botaoRemover.style.marginLeft = '10px';
            botaoRemover.addEventListener('click', function () {
                li.remove();
            });

            li.appendChild(botaoRemover);
            listaUCs.appendChild(li);
            inputUC.value = '';
        }
    });

    // Ordenar UCs
    let dragItem = null;

    listaUCs.addEventListener('dragstart', function (e) {
        dragItem = e.target;
        e.target.style.opacity = '0.5';
    });

    listaUCs.addEventListener('dragend', function (e) {
        e.target.style.opacity = '1';
    });

    listaUCs.addEventListener('dragover', function (e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(listaUCs, e.clientY);
        if (afterElement == null) {
            listaUCs.appendChild(dragItem);
        } else {
            listaUCs.insertBefore(dragItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Validação CPF
    const cpfInput = document.getElementById('cpf');
    const cpfFeedback = document.getElementById('cpf-feedback');

    cpfInput.addEventListener('input', function () {
        const cpf = this.value.replace(/\D/g, '');
        if (cpf.length === 11 && validarCPF(cpf)) {
            this.style.border = '2px solid green';
            cpfFeedback.textContent = 'CPF válido ✅';
            cpfFeedback.style.color = 'green';
        } else {
            this.style.border = '2px solid red';
            cpfFeedback.textContent = 'CPF inválido ❌';
            cpfFeedback.style.color = 'red';
        }
    });

    function validarCPF(cpf) {
        let soma = 0;
        let resto;
        if (cpf == "00000000000") return false;

        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Validação Email
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('email-feedback');

    emailInput.addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            this.style.border = '2px solid green';
            emailFeedback.textContent = 'Email válido ✅';
            emailFeedback.style.color = 'green';
        } else {
            this.style.border = '2px solid red';
            emailFeedback.textContent = 'Email inválido ❌';
            emailFeedback.style.color = 'red';
        }
    });
});
