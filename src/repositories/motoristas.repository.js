export class motoristasRepository {
    constructor(database) {
        this.database = database;
    }

    async cadastrarMotorista(dadosMotorista) {
        return this.database.cadastrarMotorista(dadosMotorista);
    }

    async buscarPorCpf(cpf) {
        return this.database.buscarPorCpf(cpf);
    }
    
    async listarMotoristas() {
        return this.database.listarMotoristas();
    }

    async motoristaPorId(id) {
        return this.database.motoristaPorId(Number(id));
    }
}