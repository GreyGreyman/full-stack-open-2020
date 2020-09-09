import React, { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const result = await createBlog({ title, author, url })
    if (result) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <React.Fragment>
      <h3>Create new blog:</h3>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            name="title"
            data-testid="title input"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </p>
        <p>
          <label htmlFor="author">author:</label>
          <input
            type="text"
            name="author"
            data-testid="author input"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </p>
        <p>
          <label htmlFor="url">url:</label>
          <input
            type="text"
            name="url"
            data-testid="url input"
            value={url}
            onChange={({ target }) => setUrl(target.value)} />
        </p>
        <button data-testid="create-blog-button" type="submit">create</button>
      </form>
    </React.Fragment>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm