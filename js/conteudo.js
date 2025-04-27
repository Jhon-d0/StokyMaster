// MENU

function openMenu() {
    document.getElementById('overlay').classList.add('active');
    document.getElementById('navbar').style.display = 'none';
  }

function closeMenu() {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('navbar').style.display = 'flex';
}

// Dados dos produtos (agora com validade do lote e quantidade de lotes)
const produtos = [
  { nome: "Arroz", quantidade: 50, categoria: "alimentos", validade: "2025-06-15", lotes: 5 },
  { nome: "Sabão em pó", quantidade: 30, categoria: "limpeza", validade: "2025-07-10", lotes: 3 },
  { nome: "Camiseta", quantidade: 20, categoria: "vestuario", validade: "2025-12-01", lotes: 8 },
  { nome: "Fone de ouvido", quantidade: 15, categoria: "eletronicos", validade: "2025-08-22", lotes: 2 },
  { nome: "Caderno", quantidade: 40, categoria: "papelaria", validade: "2025-11-10", lotes: 10 },
  { nome: "Shampoo", quantidade: 25, categoria: "beleza", validade: "2025-05-30", lotes: 4 }
];

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

  // Ajuste inicial da posição da legenda
  ajustarLegenda();
}

// Função para ajustar a posição da legenda com base no tamanho da tela
function ajustarLegenda() {
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  // Ajusta a posição da legenda dependendo do tamanho da tela
  if (mediaQuery.matches) {
      graficoPizza.options.plugins.legend.position = 'bottom';
  } else {
      graficoPizza.options.plugins.legend.position = 'left';
  }

  // Atualiza o gráfico para refletir as mudanças
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

// Função para atualizar a tabela
function atualizarTabela() {
  const tabelaBody = document.getElementById("product-table-body");
  tabelaBody.innerHTML = ""; // Limpa a tabela

  produtosFiltrados.forEach((produto, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${produto.nome}</td>
          <td><input type="number" value="${produto.quantidade}" onchange="atualizarQuantidade(${index}, this)" /></td>
          <td>${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}</td>
          <td>${produto.validade}</td>
          <td>${produto.lotes}</td>
          <td>
              <button onclick="editarProduto(${index})">Editar</button>
              <button onclick="excluirProduto(${index})">Excluir</button>
          </td>
      `;
      tabelaBody.appendChild(row);
  });
}

// Funções de edição e exclusão de produtos
function editarProduto(index) {
  alert(`Editar produto: ${produtosFiltrados[index].nome}`);
}

function excluirProduto(index) {
  produtosFiltrados.splice(index, 1);
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Função para atualizar a quantidade do produto
function atualizarQuantidade(index, input) {
  produtosFiltrados[index].quantidade = parseInt(input.value);
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

  // Atualiza tabela, gráfico e resumo após o filtro
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Função para filtrar estoque baixo
function filterStock() {
  produtosFiltrados = produtos.filter(p => p.quantidade < 20);

  // Atualiza tabela, gráfico e resumo após o filtro
  atualizarTabela();
  atualizarGrafico();
  atualizarResumo();
}

// Inicializa a página
function init() {
  inicializarGrafico();
  atualizarTabela();
  atualizarResumo();
}

// Chama a função de inicialização
init();

// Adiciona um ouvinte de evento para alterações no tamanho da tela
window.addEventListener('resize', ajustarLegenda);
