export class entregasService {
    constructor(repository) {
        this.repository = repository;
    }

    async listarTodos() {
        return this.repository.listarTodos();
    }

    async buscarPorId(id) {
        return this.repository.buscarPorId(id);
    }

    async historicoPorId(id) {
        return this.repository.historicoPorId(id);
    }

    async criar(dados) {
        return this.repository.criar(dados);
    }

    async atualizar(id, dados) {
        return this.repository.atualizar(id, dados);
    }
}