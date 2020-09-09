import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    handleLogin({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="username">username</label>
        <input type="text" name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
      </p>
      <p>
        <label htmlFor="password">password</label>
        <input type="password" name="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </p>
      <button id="log-in-button" type="submit">log in</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm