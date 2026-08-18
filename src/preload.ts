import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  ping: () => ipcRenderer.invoke('canal-ping'),
  listarLivros: () => ipcRenderer.invoke('livros:listar'),
  cadastrarLivros: (livro: {titulo: string, autor: string, isbn: string}) => 
    ipcRenderer.invoke('livros:cadastrar', livro),
  listarGeneros: (termo?: string): Promise<string[]> => ipcRenderer.invoke('listar-generos', termo),
  listarLeitores: () => ipcRenderer.invoke('leitores:listar'),
  cadastrarLeitor: (leitor: {nome: string, matricula: string, telefone: string}) =>
    ipcRenderer.invoke('leitores:cadastrar', leitor)
})
