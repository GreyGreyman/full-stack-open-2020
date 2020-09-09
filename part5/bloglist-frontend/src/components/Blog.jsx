import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, deleteBlog, loggedInUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailsVisible, setDetailsVisible] = useState(false)

  const { title, author, url, likes, user } = blog

  return (
    <li style={blogStyle}>
      {title} {author}
      <button onClick={() => { setDetailsVisible(!detailsVisible) }}>
        {detailsVisible ? 'hide' : 'show'}
      </button>
      <div className={`details ${detailsVisible ? 'details_visible' : ''}`}>
        <p>url: {url}</p>
        <div>
          <p data-testid='likes'>likes: {likes}</p>
          <button onClick={() => addLike(blog)}>like</button>
        </div>
        <p>user: {user && user.name}</p>
        {
          (loggedInUser.username === user.username) &&
          <button onClick={() => deleteBlog(blog)}>delete</button>
        }
      </div>
    </li>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired
}

export default Blog
