const router = require('express').Router();
const auth = require('../middleware/auth');
module.exports = router;

const mongoose = require('mongoose');

const Block = mongoose.model('block');

router.post('/block', auth, async (req, res) => {
    const { to, statusCheck } = req.body;
    try {
        const block = await Block.findOne({ from: req.user._id, to, });
        if (block)
            await Block.findByIdAndUpdate(block._id, { statusCheck })
                .then(response => {
                    res.status(200).json(response);
                });
        else {
            const block = new Block({
                from: req.user._id,
                to,
                statusCheck,
            });
            await block.save().then(response => { res.status(200).json(response); });
        }
    }
    catch (err) {
        res.status(422).send(err);
    }
});