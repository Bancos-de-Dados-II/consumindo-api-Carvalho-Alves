const apiURL = 'http://localhost:3000/tasks';
const form = document.getElementById('form');
const titulo = document.getElementById('titulo');
const descricao = document.getElementById('descricao');
const data = document.getElementById('data');
const tipo = document.getElementById('tipo');
const tasks = document.getElementById('tasks');
const msg = document.getElementById('msg');
const btnSalvar = document.getElementById('btnSalvar');

let idEditando = null;

const carregarTarefas = async () => {
  const resposta = await fetch(apiURL);
  const lista = await resposta.json();
  tasks.innerHTML = '';
  lista.forEach(tarefa => renderizarTarefa(tarefa));

};

const renderizarTarefa = (tarefa) => {
  let dataFormatada = 'Data não definida';  // Valor padrão

  try {
    if (tarefa.dataHora) {
      // Converte a data para o formato Date, removendo a parte da hora
      const data = new Date(tarefa.dataHora);
      if (data instanceof Date && !isNaN(data)) {  // Verifica se a data é válida
        // Exibe a data no formato 'dd/mm/aaaa'
        dataFormatada = data.toLocaleDateString('pt-BR');
      }
    }
  } catch (err) {
    console.error('Erro ao processar a data:', err);
  }

  const div = document.createElement('div');
  div.innerHTML = `
    <span class="fw-bold">${tarefa.titulo}</span>
    <span class="small text-secondary">${dataFormatada}</span>
    <p>${tarefa.descricao}</p>
    <p class="text-muted">${tarefa.tipo}</p>
    <span class="options">
      <i class="fas fa-edit text-primary" onclick="editarTarefa('${tarefa.id}')"></i>
      <i class="fas fa-trash-alt text-danger" onclick="excluirTarefa('${tarefa.id}')"></i>
    </span>
  `;
  tasks.appendChild(div);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (titulo.value === '') {
    msg.innerText = 'O título é obrigatório.';
    return;
  }

  const tarefa = {
    titulo: titulo.value,
    descricao: descricao.value,
    data: data.value,
    tipo: tipo.value
  };

  if (idEditando) {
    await fetch(`${apiURL}/${idEditando}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa)
    });
    idEditando = null;
  } else {
    await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa)
    });
  }

  titulo.value = '';
  descricao.value = '';
  data.value = '';
  tipo.value = 'Pessoal';
  msg.innerText = '';
  const modal = bootstrap.Modal.getInstance(form);
  modal.hide();
  carregarTarefas();
});

