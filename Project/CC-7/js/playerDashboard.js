const validateLogin = () => {
  const data = localStorage.getItem('token-login')
  if(data === null){
    location.href = 'login'
  }
}

validateLogin()

const handleLogout = () => {
  localStorage.removeItem('token-login')
  location.href = '/login'
}