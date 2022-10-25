const router = require('express').Router()
const db = require('../../models')
const cloudinary = require("cloudinary").v2


//cloudinary config
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})


router.post('/upload/:id', async (req,res) => {
    try {
        const fileStr = req.body.data
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'oiwq1rx8'
        })
        console.log(uploadedResponse)
        res.send(uploadedResponse.data.public_id)
    }catch(err){
        console.warn(err);
        res.status(500)
    }
})