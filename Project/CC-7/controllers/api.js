const { hashSync, compareSync } = require("bcrypt")
const jwt  = require('jsonwebtoken')
const { User, Server, History } = require('../models')

exports.protected = (req, res) => {
  console.log(req.user)

  res.send({
    message: 'ok'
  })
}

exports.register = async (req, res) => {
  try {
    const data = await User.create({
      username: req.body.username,
      password: hashSync(req.body.password, 10),
      role: req.body.role
    })
  
    res.status(201).send({
      message: 'Register berhasil, silahkan login',
      user: data
    })
  } catch (error) {
    res.status(422).send({
      message: 'Periksa kembali data data login anda'
    })
  }
}

exports.login = async (req, res) => {
  // query user ke database
  const userData = await User.findOne({
    where: {
      username: req.body.username,
    },
    include: Server
  })

  // user tidak ada
  if(!userData){
    return res.status(404).send({
      message: 'User tidak ditemukan'
    })
  }

  // user ada, password salah
  if(!compareSync(req.body.password, userData.password)){
    return res.status(401).send({
      message: 'Password salah'
    })
  }

  // user dan password benar
  let serverData
  if(userData.ServerId !== null){
    serverData = userData.Server
  }

  const payload = {
    id: userData.id,
    username: userData.username,
    role: userData.role,
    serverData: serverData
  }

  const token = jwt.sign(payload, "supersecretkey", {expiresIn: '1d'})

  res.send({
    message: 'Anda berhasil login',
    token: `Bearer ${token}`,
    user:payload
  })
}

exports.createServer = async (req, res) => {
  try {
    const data = await Server.create({
      name: req.body.name
    })
    res.status(201).send(data)
  } catch (error) {
    res.status(422).send({
      message: 'Failed to create server'
    })
  }
}

exports.getServer = async (req, res) => {
  const data = await Server.findAll()
  res.send(data)
}

exports.chooseServer = async (req, res) => {
  const user = await User.findByPk(req.user.id)
  if(user.ServerId !== null){
    return res.status(403).send('User has already picked his server')
  }
  user.ServerId = req.body.ServerId
  user.save()
  res.status(202).send('User has picked his server')
}

exports.gameRoom = async (req, res) => {
  const room = await Server.findByPk(req.params.id)
  const user = await User.findByPk(req.user.id)

  if(room.user1 == null){
    room.user1 = user.username
    room.user1choice = req.body.userChoose
    room.save()
    res.send('User1 has picked his option')
  } else if (room.user1 == user.username){
    res.send('User has already picked his option')
  } else if (room.user1 !== null && room.user2 == null){
    room.user2 = user.username
    room.user2choice = req.body.userChoose
    room.save()
    res.send('User2 has picked his option')
  } else{
    res.send('room already filled')
  }
}

exports.result = async (req, res) => {
  const room = await Server.findByPk(req.params.id)

  if(room.user1choice == room.user2choice){
    room.result = 'Tied'
    room.save()
    res.send('Tied')
  } else if (room.user1choice == 'R' && room.user2choice == 'P'){
    room.result = 'User2 Wins'
    room.save()
    res.send('User2 Wins')
  } else if (room.user1choice == 'R' && room.user2choice == 'S'){
    room.result = 'User1 Wins'
    room.save()
    res.send('User1 Wins')
  } else if (room.user1choice == 'P' && room.user2choice == 'S'){
    room.result = 'User2 Wins'
    room.save()
    res.send('User2 Wins')
  } else if (room.user1choice == 'P' && room.user2choice == 'R'){
    room.result = 'User1 Wins'
    room.save()
    res.send('User1 Wins')
  } else if (room.user1choice == 'S' && room.user2choice == 'R'){
    room.result = 'User2 Wins'
    room.save()
    res.send('User2 Wins')
  } else {
    room.result = 'User1 Wins'
    room.save()
    res.send('User1 Wins')
  }
}