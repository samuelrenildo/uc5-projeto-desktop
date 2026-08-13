import './style.css'

interface Livro {
  id: number
  titulo: string
  autor: string
  isbn: string
  disponivel: boolean
}

interface Leitor {
  id: number
  nome: string
  matricula: string
  telefone: string
}

declare global {
  interface Window {
    api: {
      ping: () => Promise<string>;
      listarLivros: () => Promise<Livro[]>;
      cadastrarLivros: (livro: {titulo: string, autor: string, isbn: string}) => Promise<Livro>;
      listarGeneros: () => Promise<string[]>
      listarLeitores: () => Promise<Leitor[]>,
      cadastrarLeitor: (leitor: {nome: string, matricula: string, telefone: string}) => Promise<Leitor>;
    };
  }
}

const appElement = document.getElementById('app') as HTMLDivElement

appElement.innerHTML = `
  <h1>Sistema de Empréstimo de Livros</h1>

  <h2>Cadastrar Livro</h2>
  <form id="form-livro">
    <input type="text" id="titulo" placeholder="Título" required />
    <input type="text" id="autor" placeholder="Autor" required />
    <input type="text" id="isbn" placeholder="ISBN" required />
    <button type="submit">Cadastrar</button>
  </form>
  <p id="mensagem-livro"></p>

  <h2>Livros Cadastrados</h2>
  <ul id="lista-livros"></ul>

  <h2>Gêneros Disponíveis</h2>
  <ul id="lista-generos"></ul>

  <h2>Cadastrar Leitor</h2>
  <form id="form-leitor">
    <input type="text" id="nome" placeholder="Nome" required />
    <input type="text" id="matricula" placeholder="Matrícula" required />
    <input type="text" id="telefone" placeholder="Telefone" required />
    <button type="submit">Cadastrar</button>
  </form>
  <p id="mensagem-leitor"></p>

  <h2>Leitores Cadastrados</h2>
  <ul id="lista-leitores"></ul>
`

const formLivro = document.getElementById('form-livro') as HTMLFormElement
const mensagemCadastro = document.getElementById('mensagem-livro') as HTMLParagraphElement
const listaLivros = document.getElementById('lista-livros') as HTMLUListElement  

async function carregarLivros() {
  try {
    const livros = await window.api.listarLivros()
    listaLivros.innerHTML = livros
      .map((livro) => `<li>${livro.titulo} - ${livro.autor} (${livro.disponivel ? 'Disponível' : 'Emprestado'})</li>`)
      .join('')
  } catch (erro) {
    listaLivros.innerHTML = '<li>Erro ao carregar livros.</li>'
    console.error(erro)
  }
}

formLivro.addEventListener('submit', async (evento) => {
  evento.preventDefault()

  const titulo = (document.getElementById('titulo') as HTMLInputElement).value
  const autor = (document.getElementById('autor') as HTMLInputElement).value
  const isbn = (document.getElementById('isbn') as HTMLInputElement).value

  try {
    await window.api.cadastrarLivros({ titulo, autor, isbn })
    mensagemCadastro.textContent = 'Livro cadastrado com sucesso!'
    formLivro.reset()
    carregarLivros()
  }  catch (erro) {
    mensagemCadastro.textContent = 'Erro ao cadastrar livro.'
    console.error(erro)
  }
})
carregarLivros()

const listaGeneros = document.getElementById('lista-generos') as HTMLUListElement

async function carregarGeneros() {
  try {
    const generos = await window.api.listarGeneros()
    listaGeneros.innerHTML = generos.map((genero) => `<li>${genero}</li>`).join('')
  } catch (erro) {
    listaGeneros.innerHTML = '<li>Erro ao carregar gêneros.</li>'
    console.error(erro)
  }
}
carregarGeneros()

const formLeitor = document.getElementById('form-leitor') as HTMLFormElement
const mensagemLeitor = document.getElementById('mensagem-leitor') as HTMLParagraphElement
const listaLeitores = document.getElementById('lista-leitores') as HTMLUListElement

async function carregarLeitores() {
  try {
    const leitores = await window.api.listarLeitores()
    listaLeitores.innerHTML = leitores
      .map((leitor: Leitor) => `<li>${leitor.nome} - Matrícula: ${leitor.matricula} - Tel: ${leitor.telefone}</li>`)
      .join('')
  } catch (erro) {
    listaLeitores.innerHTML = '<li>Erro ao carregar leitores</li>'
    console.error(erro)
  }
}


formLeitor.addEventListener('submit', async (evento) => {
  evento.preventDefault()
  
  const nome = (document.getElementById('nome') as HTMLInputElement).value
  const matricula = (document.getElementById('matricula') as HTMLInputElement).value
  const telefone = (document.getElementById('telefone') as HTMLInputElement).value

  try {
    await window.api.cadastrarLeitor({nome, matricula, telefone})
    mensagemLeitor.textContent = 'leitor cadastrado com sucesso!'
    formLeitor.reset()
    carregarLeitores()
  } catch (erro) {
    mensagemLeitor.textContent = 'Erro ao cadastrar leitor.'
    console.error(erro)
  }
})

carregarLeitores()
export {}