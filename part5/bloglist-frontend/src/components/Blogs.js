import React from 'react'
import Blog from './Blog'

const Blogs = ({ blogs, addLike, deleteBlog, loggedInUser }) => (
  <ul>
    {blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        addLike={addLike}
        deleteBlog={deleteBlog}
        loggedInUser={loggedInUser}
      />
    )}
  </ul>
)

export default Blogs