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
}
