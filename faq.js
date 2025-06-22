import { dadosFaq, categorias } from './config-faq.js';

(function() {
        function inicializarFaq() {
            const listaFaq = document.getElementById('faq-list');
            const campoBusca = document.getElementById('search-faq');
            const filtroCategorias = document.getElementById('category-filter');

            if (!listaFaq || !filtroCategorias) return;

            criarFiltrosCategorias();
            renderizarItensFaq(dadosFaq);

            if (campoBusca) {
                campoBusca.addEventListener('input', filtrarFaqs);
            }

            function criarFiltrosCategorias() {
                filtroCategorias.innerHTML = `
                <button class="category-btn active" data-category="all">Todos</button>
                ${categorias.map(categoria => 
                    `<button class="category-btn" data-category="${categoria}">${categoria}</button>`
                ).join('')}
            `;
            
            filtroCategorias.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    filtroCategorias.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    filtrarFaqs();
                });
            });
        }
        
        function renderizarItensFaq(itens) {
            listaFaq.innerHTML = '';
            
            if (itens.length === 0) {
                listaFaq.innerHTML = `
                    <div class="no-results">
                        <h3>Nenhuma pergunta encontrada</h3>
                        <p>Tente uma busca diferente ou outra categoria</p>
                        <button id="reset-search" class="reset-btn">Limpar filtros</button>
                    </div>
                `;
                
                document.getElementById('reset-search').addEventListener('click', () => {
                    if (campoBusca) campoBusca.value = '';
                    filtroCategorias.querySelector('[data-category="all"]').click();
                    renderizarItensFaq(dadosFaq);
                });
                
                return;
            }
            
            itens.forEach((item) => {
                const itemFaq = document.createElement('div');
                itemFaq.classList.add('faq-item');
                
                itemFaq.innerHTML = `
                    <div class="faq-question">
                        <div class="question-content">
                            <span class="faq-category-pill">${item.categoria}</span>
                            <h3>${item.pergunta}</h3>
                        </div>
                        <span class="faq-icon i">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>${item.resposta}</p>
                    </div>
                `;
                
                listaFaq.appendChild(itemFaq);
            });
            
            document.querySelectorAll('.faq-question').forEach(pergunta => {
                pergunta.addEventListener('click', () => {
                    const pai = pergunta.parentElement;
                    document.querySelectorAll('.faq-item.active').forEach(item => {
                        if (item !== pai) item.classList.remove('active');
                    });
                    pai.classList.toggle('active');
                });
            });
        }

        function filtrarFaqs() {
            const termoBusca = campoBusca && campoBusca.value ? campoBusca.value.toLowerCase() : '';
            const categoriaSelecionada = filtroCategorias.querySelector('.category-btn.active').dataset.category;
            
            const itensFiltrados = dadosFaq.filter(item => {
                const correspondeCategoria = categoriaSelecionada === 'all' || item.categoria === categoriaSelecionada;
                const correspondeBusca = item.pergunta.toLowerCase().includes(termoBusca);
                return correspondeCategoria && correspondeBusca;
            });
            
            renderizarItensFaq(itensFiltrados);
        }
    }

    document.addEventListener('DOMContentLoaded', inicializarFaq);
})();