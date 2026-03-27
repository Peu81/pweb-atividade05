export class motoristasController {
    constructor(service) {
        this.service = service;
    }

    async cadastrarMotorista(req, res, next) {
        try {
            const motorista = await this.service.cadastrarMotorista(req.body);
            res.json(motorista);
        } catch (error) {
            next(error)
        }
    }
}