const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Hellow test hwllo  test');
});

module.exports = router;
