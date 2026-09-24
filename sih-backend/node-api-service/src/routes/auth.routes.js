const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'moil_admin' && password === 'moil@123') {
    let token = 'demo_moil_jwt_token_2026';
    try {
      const jwt = require('jsonwebtoken');
      token = jwt.sign(
        { role: 'mine_manager', user: username },
        process.env.JWT_SECRET || 'moil_super_secret_jwt_key_2026',
        { expiresIn: '8h' }
      );
    } catch (e) {
      console.warn('JWT module fallback:', e.message);
    }
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: "Invalid username or password." });
});

module.exports = router;