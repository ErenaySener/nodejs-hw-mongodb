import { Router } from 'express';


import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../models/user.js';
import validateBody from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post(
  '/refresh',
  ctrlWrapper(refreshUserSessionController),
);

export default router;