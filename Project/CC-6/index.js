const express = require('express')
const bodyParser = require('body-parser')
const { User, Biodatas, History } = require('./models')
const fetch = require('node-fetch')
const fs = require('fs')

const app = express()
const jsonParser = bodyParser.json()

app.use('/css', express.static(__dirname+'/css'))
app.use('/js', express.static(__dirname+'/js'))
app.set('view engine', 'ejs')

// Views
app.get('/login', (req,res) => {
  res.render('login')
})

app.get('/home', async (req, res) => {
  const dataUser = await fetch('http://localhost:8070/user')
  const data = await dataUser.json()
  console.log(data)
  res.render('home', { users: data})
})


app.get('/detail/:id', async (req, res) => {
  const resp = await fetch(`http://localhost:8070/user-biodata/${req.params.id}`)
  const data = await resp.json()

  res.render('detail', { userDetail: data })
})

// Create
app.post('/login', jsonParser, async(req, res) => {
  // const resp = await fetch('http://localhost:8070/user')
  // const data = await resp.json()
  let data = JSON.parse(fs.readFileSync('./users.json', 'utf-8'))
  let PASSWORD
  for ( let i = 0; i < data.length; i++){
      if ( data[i].username === req.body.username && data[i].password === req.body.password) {
          PASSWORD = true
      }
  }
  if (PASSWORD){
      res.send("Authorized")
  }else{
      res.status(401).send("Unauthorized")
  }
})

app.post('/register', jsonParser, async (req, res) => {
  try {
    // Insert User
  const dataUser = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  // Insert Biodatas
  const biodatas = await Biodatas.create({
    fullname: req.body.fullname,
    email: req.body.email,
    age: req.body.age,
    UserId: dataUser.id
  })
  // Insert History
  const history = await History.create({
    attempt: req.body.attempt,
    score: req.body.score,
    UserId: dataUser.id
  })
  res.status(201).send('User Created')
  } catch (error) {
    res.status(403).send('Username Already Exist')
  }
})

// Read
app.get('/user', async (req,res) => {
  const users = await User.findAll({
    include:Biodatas
  })
  res.send(users)
})

app.get('/biodata', async (req,res) => {
  const data = await Biodatas.findAll()
  res.send(data)
})

app.get('/history', async (req,res) => {
  const data = await History.findAll()
  res.send(data)
})

app.get('/findBy/:id', async (req, res) => {
  const data = await User.findOne({
    where:{
      id: req.params.id
    }
  })
  if (data != null){
    res.send(data)
  } else{
    res.status(404).send('User not found')
  }
})

app.get('/find/:username', async (req, res) => {
  const data = await User.findOne({
    where:{
      username: req.params.username
    }
  })
  if (data != null){
    res.send(data)
  } else{
    res.status(404).send('User not found')
  }
})

app.get('/user-biodata/:id', async (req,res) => {
  const data = await User.findByPk(req.params.id, {
    include:Biodatas
  })

  res.send(data)
})

// Update
app.put('/biodata/:id', jsonParser, async (req,res) => {
  try {
    const data = await Biodatas.findByPk(req.params.id)
    data.password = req.body.password
    data.fullname = req.body.fullname
    data.email = req.body.email
    data.age = req.body.age
    await data.save()
    res.status(202).send('Data has been edited')
  } catch (error) {
    res.status(422).send('Unable to Edit Data')
  }
  
})

// Delete
app.delete('/biodata/:id', async(req,res) =>{
  try {
    const data = await User.findByPk(req.params.id)
    data.destroy()
    res.status(202).send('Deleted')
  } catch (error) {
    res.status(422).send('Unable to Delete User')
  }
})

app.delete('/user/:id', async(req,res) => {
  try {
    const data = await User.findByPk(req.params.id)
    data.destroy()
    res.status(202).send('Deleted')
  } catch (error) {
    res.status(422).send('Unable to Delete User')
  }
})

app.listen(8070, () => {
  console.log ("app is running")
})