import { app, BrowserWindow, ipcMain } from 'electron'
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
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Se estiver em desenvolvimento, usa a URL do Vite. Em produção, carrega o arquivo compilado.
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async() => {
  createWindow()

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

// Manipulador IPC Exemplo
ipcMain.handle('canal-ping', async () => {
  return 'pong do processo principal!'
})
