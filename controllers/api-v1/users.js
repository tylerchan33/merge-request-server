const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

// GET all /users - test endpoint
router.get('/', async (req, res) => {
  try {
    const users = await db.User.find({})
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

router.get('/matchedusers', async (req, res) => {
  try {
    const matchedusersid = JSON.parse(req.query.matchids)
    const pipeline = [
      {
        '$match': {
          'email': {
            '$in': matchedusersid
          }
        }
      }
    ]
    const users = await db.User.aggregate(pipeline)
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

router.get('/lookingfor/No%20Preference', async (req, res) => {
  try {
    // options man, woman, friends, no preference 
    const users = await db.User.find()
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

router.get('/lookingfor/friends', async (req, res) => {
  try {
    // options man, woman, friends, no preference 
    const users = await db.User.find({lookingFor: "Friends"})
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

router.get('/lookingfor/man', async (req, res) => {
  try {
    // options man, woman, friends, no preference  
    const users = await db.User.find({lookingFor: "Man"})
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

router.get('/lookingfor/woman', async (req, res) => {
  try {
    // options man, woman, friends, no preference 
    const users = await db.User.find({lookingFor: "Woman"})
    res.json(users)
  } catch(err) {
    console.warn(err)
  }
})

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already' })
  
    // hash password
    const password = req.body.password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new db.User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      birthDay: req.body.birthDay,
      birthMonth: req.body.birthMonth,
      birthYear: req.body.birthYear,
      gender: req.body.gender,
      location: req.body.location,
      city: req.body.city,
      state: req.body.state,
      lookingFor: req.body.lookingFor,
      photo: req.body.photo,
      favoritePLanguage: req.body.favoritePLanguage,
      biography: req.body.biography,
      age: req.body.age
    })
  
    await newUser.save()

    // create jwt payload
    const payload = {
      firstName: newUser.firstName,
      biography: newUser.biography,
      photo: newUser.photo,
      birthYear: newUser.birthYear,
      favoritePLanguage: newUser.favoritePLanguage,
      lookingFor: newUser.lookingFor,
      location: newUser.location,
      city: newUser.city,
      state: newUser.state,
      email: newUser.email, 
      id: newUser.id,
      age: newUser.age,
      password: newUser.password
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch (error) {
    console.warn(error)
    res.status(500).json({ msg: 'server error'  })
  }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findOne({
      email: req.body.email
    })

    const noLoginMessage = 'Incorrect email or password'

    // if the user is not found in the db, return and sent a status of 400 with a message
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage, body: req.body})
    
    // check the password from the req body against the password in the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match, return an send a status of 400 with a message
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage, body: req.body})

    // create jwt payload
    const payload = {
      firstName: foundUser.firstName,
      biography: foundUser.biography,
      photo: foundUser.photo,
      birthYear: foundUser.birthYear,
      favoritePLanguage: foundUser.favoritePLanguage,
      lookingFor: foundUser.lookingFor,
      location: foundUser.location,
      city: foundUser.city,
      state: foundUser.state,
      email: foundUser.email, 
      id: foundUser.id,
      age: foundUser.age,
      password: foundUser.password
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

    res.json({ token })
  } catch(error) {
    console.warn(error)
    res.status(500).json({ msg: 'server error'  })
  }
})


// GET /auth-locked - will redirect if bad jwt token is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
  res.json( { msg: 'welcome to the private route!' })
})

// GET single user
router.get('/:userId',  async (req, res) => {
  try {
    const findUser = await db.User.findById(req.params.userId)
    res.json(findUser)
  } catch(error) {
    console.warn(error)
    res.status(500).json({ msg: "server error"})
  }
})

router.put('/:userId/edit', async (req, res) => {
  try {
    const findUser = await db.User.findById(req.params.userId)

    if(!findUser) return res.status(400).json({message: "cannot find user"})

    const options = { new: true }
    const updateUser = await db.User.findByIdAndUpdate(req.params.userId, req.body, options)
   
    const payload = {
      firstName: updateUser.firstName,
      biography: updateUser.biography,
      photo: updateUser.photo,
      birthYear: updateUser.birthYear,
      favoritePLanguage: updateUser.favoritePLanguage,
      lookingFor: updateUser.lookingFor,
      location: updateUser.location,
      city: updateUser.city,
      state: updateUser.state,
      email: updateUser.email, 
      id: updateUser.id,
      password: updateUser.password
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET)
    res.json({ token })

  } catch(err) {
    res.status(500).json({ msg: 'server error'  })
  }
})

// deleting a user's profile
router.delete('/:userId/edit', async (req,res)=> {
  try{
    await db.User.findByIdAndDelete(req.params.userId)
    res.sendStatus(204)
}catch(err){
    console.warn(err)
    res.status(500).json({ message: 'Internal server error'})
}
})

router.put('/:id/secureaccount', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findById(req.params.id)
    const noLoginMessage = 'Incorrect username or password'

    // if the user is not found in the db, return and sent a status of 400 with a message
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage })
    
    // check the password from the req body against the password in the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match, return an send a status of 400 with a message
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage })

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
    const options = { new : true }
    const editUser = await db.User.findByIdAndUpdate(req.params.id,{
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email
    }, options)

    // await db.User.save()
    // create jwt payload
    const payload = {
      firstName: editUser.firstName,
      biography: editUser.biography,
      photo: editUser.photo,
      birthYear: editUser.birthYear,
      favoritePLanguage: editUser.favoritePLanguage,
      lookingFor: editUser.lookingFor,
      location: editUser.location,
      city: editUser.city,
      state: editUser.state,
      email: editUser.email, 
      id: editUser.id,
      password: editUser.password
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET)

    res.json({ token })
  } catch(error) {
    console.warn(error)
    res.status(500).json({ msg: 'server error'  })
  }
})



// adds users to users liked array
router.post("/:userId/liked", async (req, res) => {
  try{
    const findUser = await db.User.findById(req.params.userId)
    const likes = req.body.likedUsers
    findUser.likedUsers.push(likes)
    res.json(findUser)
    await findUser.save()
  } catch(err) {
    console.warn(err)
  }
})

router.post("/:userId/rejected", async (req, res) => {
  try{
    const findUser = await db.User.findById(req.params.userId)
    const rejected = req.body.rejectedUsers
    findUser.rejectedUsers.push(rejected)
    res.json(findUser)
    await findUser.save()
  } catch(err) {
    console.warn(err)
  }
})

// adds match to users matched array
router.post("/:id/addmatch", async (req, res) => {
  try{
    const findUser = await db.User.findById(req.params.id
    )
    // placeholder for now
    const matched = req.body.otherperson
    findUser.matchedUsers.push(matched)

    res.json(findUser)
    await findUser.save()
  } catch(err) {
    console.warn(err)
  }
})

// gets user's matches
router.get("/:userId/matches", async (req, res) => {
  try {
    const matches = await db.User.findOne({id: req.params.id })
    res.json(matches.matchedUsers)
  } catch(err) {
    console.warn(err)
  }
})

router.post("/:id/deletematch", async (req, res) => {
  try{
    const findUser = await db.User.findById(req.params.id)
    const matched = req.body.otherperson
    findUser.matchedUsers.pull(matched)
    findUser.likedUsers.pull(matched)
    res.json(findUser)
    await findUser.save()
  } catch(err) {
    console.warn(err)
  }
})

module.exports = router