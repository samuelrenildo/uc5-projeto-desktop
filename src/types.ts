export interface livros {
    id: number;
    titulo: string;
    autor: string;
    isbn: string;
    disponivel: boolean;
}

export interface leitores{
    id: number;
    nome: string;
    matricula: string;
    telefone: string;
}

export interface emprestimos {
    id: number;
    id_livro: number;
    id_leitor: number;
    data_emprestimo: string;
    data_devolucao_real: string | null;
}