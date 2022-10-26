const express = require('express')
const router = express.Router()
const { Message } = require("../../models/Message")
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
router.get("/:id", async (req, res) => {
    try {
        const messages = await db.Message.find({from: req.params.id, to: 12312312312})
        res.json(messages)
    } catch(err) {
        console.warn(err)
    }
})



module.exports = router