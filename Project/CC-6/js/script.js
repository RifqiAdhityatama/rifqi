const handleLogin = async () => {
  let loginUsername = document.getElementById("loginUsername").value
  let loginPassword = document.getElementById("loginPassword").value

  const resp = await fetch('http://localhost:8070/login', {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      username: loginUsername,
      password: loginPassword
    })
  })

  if(resp.status === 200){
    window.location.href = '/home'
  } else {
    alert("User not found")
  }
}

const handleRegister = async () => {
  let regUsername = document.getElementById("regUsername").value
  let regPassword = document.getElementById("regPassword").value
  let regFullname = document.getElementById("regFullname").value
  let regEmail = document.getElementById("regEmail").value
  let regAge = document.getElementById("regAge").value

  const resp = await fetch('http://localhost:8070/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: regUsername,
      password: regPassword,
      fullname: regFullname,
      email: regEmail,
      age: regAge
    })
  })

  if(resp.status === 201){
    alert("Succesfully register")
    document.getElementById("regUsername").value = null
    document.getElementById("regPassword").value = null
    document.getElementById("regFullname").value = null
    document.getElementById("regEmail").value = null
    document.getElementById("regAge").value = null

    await location.reload()
  } else{
      alert("Register failed")
  }
}

const handleFindUser = async () => {
  const username = document.getElementById("findUsername").value
  const resp = await fetch(`http://localhost:8070/find/${username}`)

  if (resp.status === 404){
    alert("User not found")
  } else {
    const data = await resp.json()
    window.location.href = `/detail/${data.id}`
  }
}

const handleEdit = async (id) => {
  const resp = await fetch(`http://localhost:8070/findBy/${id}`)

  if (resp.status === 404){
    alert("User not found")
  } else {
    const data = await resp.json()
    window.location.href = `/detail/${data.id}`
  }
}

const handleDelete = async (userId) => {
  let ques = confirm('Are you sure?')
  if (ques){
    // Delete /user/:id
    await fetch(`http://localhost:8070/user/${userId}`, {
      method: 'DELETE'
    })

    location.reload()
  }
}

const handleEditBiodata = async (biodataId) => {
  let Password = document.getElementById("Password").value
  let Fullname = document.getElementById("Fullname").value
  let Email = document.getElementById("Email").value
  let Age = document.getElementById("Age").value

  const resp = await fetch(`http://localhost:8070/biodata/${biodataId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password: Password,
      fullname: Fullname,
      email: Email,
      age: Age
    })
  })
  if(resp.status === 202){
    alert("Data Has Been Updated")
  } else {
    alert("Failed Update Data")
  }
}