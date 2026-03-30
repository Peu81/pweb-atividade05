const fluxoEntrega = {
    "CRIADA": "EM_TRANSITO",
    "EM_TRANSITO": "ENTREGUE"
}


export class entregasService {
    constructor(entregasRepository, motoristasRepository) {
        this.repository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

    async listarTodos(status) {
        if (status) {
            return this.repository.listarPorStatus(status)
        }
        return this.repository.listarTodos();
    }
    
    async buscarPorId(id) {
        return this._entregaOuErro(id)
    }

    async historicoPorId(id) {
        await this._entregaOuErro(id);
        return this.repository.historicoPorId(id);
    }

    async criar(dados) {
        if (dados.origem.trim() === dados.destino.trim()) {
            const error = new Error("Origem e destino não podem ser iguais.");
            error.status = 400;
            throw error;
        }

        if (dados.status !== "CRIADA") {
            const error = new Error("O status inicial não pode ser diferente de 'CRIADA'");
            error.status = 400;
            throw error;       
        }

        const entregaDuplicada = await this.repository.entregasDuplicadas(
            dados.descricao, 
            dados.origem, 
            dados.destino);

        if (entregaDuplicada) {
            const error = new Error("Entrega duplicada! Já existe uma entrega com essas informações");
            error.status = 409;
            throw error;  
        }

        const historicoInicial = {
            data: new Date().toISOString().split('T')[0],
            descricao: "Entrega 'CRIADA'."
        }

        const entrega = {
            ...dados,
            historico: [historicoInicial]
        }

        return this.repository.criar(entrega);
    }

    async avancaStatus(id) {
        const entrega = await this._entregaOuErro(Number(id));
        const proximoStatus = fluxoEntrega[entrega.status];

        if (!proximoStatus) {
            const error = new Error(`Não é possível avançar. Status atual: '${entrega.status}'`);
            error.status = 409;
            throw error;        
        }
         
        return this.atualizar(Number(id), {"status": proximoStatus});
    }

    async cancelar(id) {
        return await this.atualizar(id, {status: "CANCELADA"});
    }

    async atualizar(id, dados) {
        const entregaExiste = await this._entregaOuErro(id);
 
        if (entregaExiste.status === "ENTREGUE" || entregaExiste.status === "CANCELADA") {
            const error = new Error("O status não pode ser alterado.");
            error.status = 409;
            throw error;
        }

        if (dados.status === "CANCELADA"){
            if (entregaExiste.status !== "CRIADA" && entregaExiste.status !== "EM_TRANSITO") {
            const error = new Error("Só é possivel cancelar entregas 'CRIADAS' ou 'EM_TRANSITO'!");
            error.status = 422;
            throw error;
        }}
        
        if (dados.status === "ENTREGUE") {
            if (entregaExiste.status === "CRIADA"){ 
            const error = new Error("Uma entrega recem criada não pode receber o status 'ENTREGUE' sem estar 'EM_TRANSITO'.");
            error.status = 422;
            throw error;
            }; 

            if (entregaExiste.status !== "EM_TRANSITO") {
            const error = new Error("Entregas precisam estar 'EM_TRANSITO' para serem entregues!");
            error.status = 422;
            throw error;            
            }      
        }
        
        const novoHistorico = {
            data: new Date().toISOString().split('T')[0],
            descricao: `Status alterado para: ${dados.status}`
        }

        const dadosAtualizados = {
            ...entregaExiste,
            status: dados.status,
            historico: [...entregaExiste.historico, novoHistorico]
        }

        return this.repository.atualizar(id, dadosAtualizados);
    }


    async atribuiMotorista(entregaId, motoristaId) {
        const entregaExiste = await this._entregaOuErro(entregaId)

        if (entregaExiste.status !== "CRIADA") {
            const error = new Error("Só é possivel atribuir entregas com status 'CRIADA'.");
            error.status = 409;
            throw error;         
        }

        const motorista = await this.motoristasRepository.buscarPorId(motoristaId);

        if (!motorista) {
            const error = new Error("Motorista inexistente.");
            error.status = 404;
            throw error;
        }

        if (motorista.status !== "ATIVO") {
            const error = new Error("Não é possível atribuir entregas para motoristas inativos.");
            error.status = 422;
            throw error;   
        }

        let mensagem = ""; 

        if (!entregaExiste.motoristaId) {
            mensagem = `Motorista ${motorista.nome} atribuído.`;
        }

        else {
            mensagem = `Motorista anterior substituido por ${motorista.nome}.`
        }
        
        const novoHistorico = {
        data: new Date().toISOString().split('T')[0],
        descricao: mensagem
        }

        const dadosAtualizados = {
            ...entregaExiste,
            motoristaId: motoristaId,
            historico: [...entregaExiste.historico, novoHistorico]
        }
        return this.repository.atualizar(entregaId, dadosAtualizados);        
    }

    async listaPorMotorista(motoristaId, status) {
        return this.repository.listaPorMotorista(motoristaId, status);
    }

    async _entregaOuErro(id) {
        const numId = Number(id);

        if (isNaN(numId)) {
            const erroIdInvalido = new Error("ID inválido");
            erroIdInvalido.status = 400;
            throw erroIdInvalido;
        }

        const entrega = await this.repository.buscarPorId(numId);

        if (!entrega) {
            const erroEntregaInexistente = new Error("Entrega inexistente!");
            erroEntregaInexistente.status = 404;
            throw erroEntregaInexistente;
        }
        
        return entrega;
    }
}


