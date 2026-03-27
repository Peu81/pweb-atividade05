export class motoristasService {
    constructor(repository) {
        this.repository = repository;
    }

    async cadastrarMotorista(dadosMotorista) {
        const cpf = String(dadosMotorista.cpf);

        const motorista = await this.repository.buscarPorCpf(cpf);

        if (motorista) {
            const error = new Error("CPF já cadastrado no sistema.");
            error.status = 409;
            throw error;
        }

        const informacoesMotorista = {
            ...dadosMotorista,
            status: "ATIVO"
        }

        return this.repository.cadastrarMotorista(informacoesMotorista);
    }

    async listarMotoristas() {
        return this.repository.listarMotoristas()
    }

    async motoristaPorId(id) {
        const motorista = await this.repository.motoristaPorId(Number(id));

        if (!motorista) {
            const error = new Error("Motorista não encontrado!");
            error.status = 404;
            throw error;
        }

        return motorista;
    }
}
