import { Router } from 'express';

import {
  createProjectController,
  listProjectsController,
  getProjectController,
  deleteProjectController,
  saveConnectionController,
  testConnectionController,
} from '../controllers/projectController';

const router = Router();

router.post('/', createProjectController);
router.get('/', listProjectsController);
router.get('/:id', getProjectController);
router.delete('/:id', deleteProjectController);
router.put('/:id/connection', saveConnectionController);
router.post('/:id/test-connection', testConnectionController);

export default router;
