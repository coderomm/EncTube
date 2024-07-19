const express = require('express');
const authRouter = require("./auth");
const videoRouter = require("./video");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/vdo", videoRouter);

module.exports = router;