import './style.css'

interface Livro {
  id: number
  titulo: string
  autor: string
  isbn: string
  disponivel: boolean
}

declare global {
  interface Window {
    api: {
      ping: () => Promise<string>;
      listarLivros: () => Promise<Livro[]>;
      cadastrarLivros: (livro: {titulo: string, autor: string, isbn: string}) => Promise<Livro>;
      listarGeneros: () => Promise<string[]>
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

export {}