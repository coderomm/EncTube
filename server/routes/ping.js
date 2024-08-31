const express = require('express');
const router = express.Router();

router.post('/healthcheck', (req, res) => {
    try {
        res.status(200).json({ message: 'Server is healthy and running!' });
    } catch (error) {
        console.error('Server is not healthy and not running!', error);
        res.status(500).json({ message: 'Server is not healthy and not running!' });
    }
});

module.exports = router;