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