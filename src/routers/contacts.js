import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.post('/contacts', ctrlWrapper(createContactController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));

export default router;

router.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactController),
);