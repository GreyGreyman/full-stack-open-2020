import React, { useState, useEffect, useRef } from 'react'

import blogService from './services/blogs'
import loginServices from './services/login'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const storedUser = window.localStorage.getItem('loggedUser')
    if (storedUser !== null) {
      const user = JSON.parse(storedUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  function notificationHelper(message, state = 'success') {
    setNotification({ message, state })
    setTimeout(() => { setNotification(null) }, 5000)
  }

  const handleLogin = async credentials => {
    try {
      const user = await loginServices.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      return true
    } catch (error) {
      notificationHelper(error.response.data.error, 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken('')
    setUser(null)
  }

  const createBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))

      notificationHelper(`a new blog "${savedBlog.title}" by ${savedBlog.author} added`)
      blogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      notificationHelper(error.response.data.error, 'error')
      return false
    }
  }

  const deleteBlog = async (blogToDelete) => {
    if (window.confirm(`Delete blog "${blogToDelete.title}"?`)) {
      try {
        await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        notificationHelper(`Successufully deleted blog "${blogToDelete.title}"`)
      } catch (error) {
        console.log(error.response)
        // setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        // notificationHelper(``, 'error')
      }
    }
  }

  const addLike = async (blog) => {
    try {
      const newBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
      const updatedBlog = await blogService.update(newBlog.id, newBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
      notificationHelper('like successfully added')
    } catch (error) {
      console.log(error)
      console.log(error.response.data.error)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => - a.likes + b.likes)

  if (user === null) {
    return (
      <React.Fragment>
        <h2>Please log in</h2>
        <Notification notification={notification} />
        <LoginForm handleLogin={handleLogin} />
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <h2>Blogs</h2>
        <Notification notification={notification} />
        {`${user.name} logged in`}
        <button onClick={handleLogout}>log out</button>

        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>

        <Blogs
          blogs={sortedBlogs}
          addLike={addLike}
          deleteBlog={deleteBlog}
          loggedInUser={user}
        />
      </React.Fragment>
    )
  }
}

export default App