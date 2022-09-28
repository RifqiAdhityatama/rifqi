exports.login = (req, res) => {
  res.render('login')
}
exports.adminDashboard = async (req, res) => {
  res.render('adminDashboard')
}

exports.playerDashboard = (req, res) => {
  res.render('playerDashboard')
}