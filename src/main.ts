import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    center: true,
    title: 'Sistema de Empréstimo de Livros',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
  // Se estiver em desenvolvimento, usa a URL do Vite. Em produção, carrega o arquivo compilado.
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

function criarMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          role: 'quit',
        },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            console.log('Sistema de Empréstimo de Livros - Projeto Integrador UC5')
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(async() => {
  createWindow()
  criarMenu()

  try {
    const resultado = await pool.query('SELECT NOW()')
    console.log('Conexao com o banco de dados bem-sucedida:', resultado.rows[0].now)
  } catch (erro) {
    console.error('Erro ao conectar ao banco de dados:', erro)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  console.log('Fechando a conexao com o banco de dados')
})


ipcMain.handle('canal-ping', async () => {
  return 'pong do processo principal!'
})


ipcMain.handle('livros:listar', async () => {
  try {
    const resultado = await pool.query('SELECT * FROM livros')
    return resultado.rows
  } catch (erro) {
    console.error('Erro ao listar livros:', erro)
    throw erro
  }
})

ipcMain.handle('livros:cadastrar', async (_evento, livro: {titulo: string, autor: string, isbn: string}) => {
  try {
    const resultado = await pool.query(
      'insert into livros (titulo, autor, isbn) values ($1, $2, $3) returning *',
      [livro.titulo, livro.autor, livro.isbn]
    )
    return resultado.rows[0]
  } catch (erro) {
    console.error('Erro ao cadastrar livro:', erro)
    throw erro
  }
})

ipcMain.handle('listar-generos', async (): Promise<string[]> => {
  return ['Romance', 'Ficção Científica', 'Fantasia', 'Biografia', 'Técnico']
})

ipcMain.handle('leitores:listar', async () => {
  try {
    const resultado = await pool.query('SELECT * from leitores order by id')
    return resultado.rows
  } catch (erro) {
    console.error('Erro ao listar leitore:', erro)
    throw erro
  }
})

ipcMain.handle('leitores:cadastrar', async (_evento, leitor: {nome: string, matricula: string, telefone: string}) => {
  try {
    const resultado = await pool.query(
      'insert into leitores (nome, matricula, telefone) values ($1, $2, $3) returning *',
      [leitor.nome, leitor.matricula, leitor.telefone]
    )
    return resultado.rows[0]
  } catch (erro) {
    console.error('Erro ao cadastrar os leitores:', erro)
    throw erro
  }
})