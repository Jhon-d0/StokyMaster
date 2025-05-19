// MENU

function openMenu() {
    document.getElementById('overlay').classList.add('active');
    document.getElementById('navbar').style.display = 'none';
  }

function closeMenu() {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('navbar').style.display = 'flex';
}

// Carrega produtos do localStorage ou usa padrão se não houver
let produtos = JSON.parse(localStorage.getItem("produtos")) || [
  { nome: "Arroz", quantidade: 50, categoria: "alimentos", validade: "2025-06-15", lotes: 5 },
  { nome: "Sabão em pó", quantidade: 30, categoria: "limpeza", validade: "2025-07-10", lotes: 3 },
  { nome: "Camiseta", quantidade: 20, categoria: "vestuario", validade: "2025-12-01", lotes: 8 },
  { nome: "Fone de ouvido", quantidade: 15, categoria: "eletronicos", validade: "2025-08-22", lotes: 2 },
  { nome: "Caderno", quantidade: 40, categoria: "papelaria", validade: "2025-11-10", lotes: 10 },
  { nome: "Shampoo", quantidade: 25, categoria: "beleza", validade: "2025-05-30", lotes: 4 }
];

// Salva os produtos no localStorage
function salvarProdutos() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// Variável global para o gráfico
let graficoPizza;
let produtosFiltrados = [...produtos];

// Função para inicializar o gráfico
function inicializarGrafico() {
  const ctx = document.getElementById('graficoPizza').getContext('2d');

  graficoPizza = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: produtosFiltrados.map(p => `${p.nome} (${p.categoria})`),
      datasets: [{
        label: 'Quantidade em Estoque',
        data: produtosFiltrados.map(p => p.quantidade),
        backgroundColor: [
          '#F59E0B', '#6366F1', '#EC4899', '#0EA5E9', '#8B5CF6', '#F43F5E'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
          labels: {
            color: '#333',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Distribuição de Produtos por Categoria',
          color: '#111',
          font: {
            size: 20
          }
        }
      }
    }
  });

  ajustarLegenda();
}

function atualizarGrafico() {
  if (graficoPizza) {
    graficoPizza.destroy(); // Destroi o gráfico antigo
  }
  inicializarGrafico(); // Cria um novo com os dados atualizados
}


// Função para ajustar a posição da legenda com base no tamanho da tela
function ajustarLegenda() {
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  graficoPizza.options.plugins.legend.position = mediaQuery.matches ? 'bottom' : 'left';
  graficoPizza.update();
}

// Função para atualizar o resumo
function atualizarResumo() {
  const totalProdutos = produtosFiltrados.reduce((acc, produto) => acc + produto.quantidade, 0);
  const produtosBaixoEstoque = produtosFiltrados.filter(p => p.quantidade < 20).length;
  const maiorCategoria = produtosFiltrados.reduce((acc, produto) => {
    acc[produto.categoria] = (acc[produto.categoria] || 0) + produto.quantidade;
    return acc;
  }, {});
  const categoriaMaior = Object.keys(maiorCategoria).reduce((a, b) => maiorCategoria[a] > maiorCategoria[b] ? a : b);

  document.getElementById("total-produtos").innerText = totalProdutos;
  document.getElementById("produtos-baixo-estoque").innerText = produtosBaixoEstoque;
  document.getElementById("maior-categoria").innerText = categoriaMaior.charAt(0).toUpperCase() + categoriaMaior.slice(1);
}

function atualizarTabela() {
  const tabelaBody = document.getElementById("product-table-body");
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtosFiltrados = [...produtos];
  tabelaBody.innerHTML = "";

  produtosFiltrados.forEach((produto, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <p>${produto.nome}</p>
        <input class="input-edit" type="text" value="${produto.nome}" style="display: none;">
      </td>
      <td>
        <p>${produto.quantidade}</p>
        <input class="input-edit" type="number" value="${produto.quantidade}" style="display: none;">
      </td>
      <td>
        <p>${produto.categoria}</p>
        <input class="input-edit" type="text" value="${produto.categoria}" style="display: none;">
      </td>
      <td>
        <p>${produto.validade}</p>
        <input class="input-edit" type="date" value="${produto.validade}" style="display: none;">
      </td>
      <td>
        <p>${produto.lotes}</p>
        <input class="input-edit" type="number" value="${produto.lotes}" style="display: none;">
      </td>
      <td>
        <button class="btn-editar" onclick="editarProduto(${index})">Editar</button>
        <button class="btn-salvar" style="display: none;" onclick="salvarProduto(${index})">Salvar</button>
        <button class="btn-excluir" onclick="excluirProduto(${index})">Excluir</button>
      </td>

    `;

    tabelaBody.appendChild(row);
  });
}

// Mostrar o formulário de adicionar produto
document.getElementById('btn-add-produto').addEventListener('click', () => {
  document.getElementById('form-add-produto').style.display = 'block';
});

// Cancelar adicionar produto
function cancelarAddProduto() {
  limparFormAddProduto();
  document.getElementById('form-add-produto').style.display = 'none';
}

// Limpa inputs do formulário
function limparFormAddProduto() {
  document.getElementById('novo-nome').value = '';
  document.getElementById('novo-quantidade').value = '';
  document.getElementById('novo-categoria').value = '';
  document.getElementById('novo-validade').value = '';
  document.getElementById('novo-lotes').value = '';
}

// Adicionar o novo produto ao array e atualizar localStorage + tabela
function adicionarProduto() {
  const nome = document.getElementById('novo-nome').value.trim();
  const quantidade = parseInt(document.getElementById('novo-quantidade').value);
  const categoria = document.getElementById('novo-categoria').value.trim();
  const validade = document.getElementById('novo-validade').value;
  const lotes = parseInt(document.getElementById('novo-lotes').value);

  if (!nome || isNaN(quantidade) || !categoria || !validade || isNaN(lotes)) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  // Puxa os produtos do localStorage, adiciona o novo e salva
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.push({ nome, quantidade, categoria, validade, lotes });
  localStorage.setItem('produtos', JSON.stringify(produtos));

  // Atualiza variáveis e interface
  produtosFiltrados = [...produtos];
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();

  // Fecha o formulário e limpa
  cancelarAddProduto();
}



function editarProduto(index) {
  const row = document.querySelectorAll("#product-table-body tr")[index];
  row.querySelectorAll("p").forEach(p => p.style.display = "none");
  row.querySelectorAll(".input-edit").forEach(input => input.style.display = "block");
  row.querySelector(".btn-editar").style.display = "none";
  row.querySelector(".btn-salvar").style.display = "inline-block";
}

function salvarProduto(index) {
  const row = document.querySelectorAll("#product-table-body tr")[index];
  const inputs = row.querySelectorAll(".input-edit");

  const atualizado = {
    nome: inputs[0].value,
    quantidade: parseInt(inputs[1].value),
    categoria: inputs[2].value,
    validade: inputs[3].value,
    lotes: parseInt(inputs[4].value)
  };

  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos[index] = atualizado;
  localStorage.setItem("produtos", JSON.stringify(produtos));

  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}



function excluirProduto(index) {
  const nome = produtosFiltrados[index].nome;
  const indexOriginal = produtos.findIndex(p => p.nome === nome);
  produtos.splice(indexOriginal, 1);
  salvarProdutos();
  produtosFiltrados = [...produtos];
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Função para atualizar a quantidade do produto
function atualizarQuantidade(index, input) {
  const nome = produtosFiltrados[index].nome;
  const indexOriginal = produtos.findIndex(p => p.nome === nome);
  produtos[indexOriginal].quantidade = parseInt(input.value);
  salvarProdutos();
  produtosFiltrados = [...produtos];
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Função para filtrar os produtos
function filterProducts() {
  const searchQuery = document.getElementById("search-product").value.toLowerCase();
  const categoryFilter = document.getElementById("category-filter").value;

  produtosFiltrados = produtos.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter ? p.categoria === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Função para filtrar estoque baixo
function filterStock() {
  produtosFiltrados = produtos.filter(p => p.quantidade < 20);
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Inicializa a página
function init() {
  // Se não houver produtos no localStorage, adiciona os iniciais
  if (!localStorage.getItem("produtos")) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }

  produtosFiltrados = JSON.parse(localStorage.getItem("produtos"));

  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}


init();
window.addEventListener('resize', ajustarLegenda);

