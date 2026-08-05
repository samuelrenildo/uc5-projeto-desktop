import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  ping: () => ipcRenderer.invoke('canal-ping'),
  listarLivros: () => ipcRenderer.invoke('livros:listar'),
  cadastrarLivros: (livro: {titulo: string, autor: string, isbn: string}) => 
    ipcRenderer.invoke('livros:cadastrar', livro)
})
