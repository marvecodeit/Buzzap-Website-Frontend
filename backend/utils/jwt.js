const jwt = require('jsonwebtoken');
const config = require('../config/env');

const COOKIE_NAME = 'buzzap_token';

// When the frontend and API are on different domains (e.g. Vercel + Render),
// the auth cookie is cross-site: browsers only send it if sameSite='none' AND
// secure=true. Enable via COOKIE_CROSS_SITE=true. Otherwise default to the
// safer same-site 'lax' (works when both are same-origin or during local dev).
const crossSite = config.COOKIE_CROSS_SITE;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: crossSite || config.NODE_ENV === 'production',
  sameSite: crossSite ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function signToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN || '7d',
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...COOKIE_OPTIONS, maxAge: 0 });
}

function getTokenFromRequest(req) {
  return req.cookies?.[COOKIE_NAME] || null;
}

module.exports = { signToken, verifyToken, setAuthCookie, clearAuthCookie, getTokenFromRequest };
