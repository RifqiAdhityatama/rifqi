exports.validateSuperAdmin = (req, res, next) => {
  if(req.user.role === 'superAdmin'){
    next()
  } else {
    res.status(401).send('You dont have permission to access this page')
  }
}

exports.validatePlayer = (req, res, next) => {
  if(req.user.role === 'playerUser'){
    next()
  } else {
    res.status(401).send('You dont have permission to access this page')
  }
}