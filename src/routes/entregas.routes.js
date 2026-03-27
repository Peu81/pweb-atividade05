
import {Router} from 'express';
import { entregasDatabase } from "../database/entregas.database.js";
import { entregasRepository } from "../repositories/entregas.repository.js";
import { entregasService } from "../services/entregas.service.js";
import { entregasController } from "../controllers/entregas.controller.js";



const entregasRouter = new Router();

const database = new entregasDatabase();
const repository = new entregasRepository(database);
const service = new entregasService(repository);
const controller = new entregasController(service);

entregasRouter.get('/', (req, res, next) => controller.listarTodos(req, res, next));
entregasRouter.get('/:id', (req, res, next) => controller.buscarPorId(req, res, next));
entregasRouter.get('/:id/historico', (req, res, next) => controller.historicoPorId(req, res, next));
entregasRouter.post('/', (req, res, next) => controller.criar(req, res, next));
entregasRouter.patch('/:id/avancar', (req, res, next) => controller.avancaStatus(req, res, next));
entregasRouter.patch('/:id/cancelar', (req, res, next) => controller.cancelar(req, res, next));


export {entregasRouter};