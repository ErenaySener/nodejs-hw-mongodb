import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;

export const registerUser = async payload => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: encryptedPassword,
  });

  return {
    name: newUser.name,
    email: newUser.email,
    _id: newUser._id,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

export const loginUser = async payload => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return session;
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const newRefreshToken = crypto.randomBytes(30).toString('base64');

  const newSession = await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });

  return newSession;
};