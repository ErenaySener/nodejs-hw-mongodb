import { Router } from 'express';

import { getContactsController } from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContactsController);

export default router;