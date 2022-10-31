const express = require('express')
const router = express.Router()
const db = require('../../models')
const authLockedRoute = require('./authLockedRoute')

router.post("/new", async (req, res) => {
    try {
        const newMessage = await db.Message.create(req.body)
        res.json(newMessage)
    } catch(err) {
        console.warn(err)
    }
})

// need to add the to
router.get("/:from/:to", async (req, res) => {
    try {
        // need to change to have the other id of the person
        const messages = await db.Message.find({from: req.params.from, to: req.params.to})
        res.json(messages)
    } catch(err) {
        console.warn(err)
    }
})

module.exports = router