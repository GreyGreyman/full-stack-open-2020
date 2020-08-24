const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((favourite, blog) => blog.likes > favourite.likes ? blog : favourite)
}

const _ = require('lodash')
//can be solved in the same way as mostLikes for probably more preformance and less lodash space, just wanted to try lodash
const mostBlogs = (blogs) => _.zipObject(['author', 'blogs'], _(blogs).countBy(blog => blog.author).entries().maxBy(_.last) || ['', 0])

const mostLikes = (blogs) => {
  let likes_count = {}

  let max = {
    author: '',
    likes: 0,
  }

  blogs.forEach(blog => {
    likes_count[blog.author] = (likes_count[blog.author] || 0) + blog.likes
    if (likes_count[blog.author] > max.likes) {
      max = {
        author: blog.author,
        likes: likes_count[blog.author]
      }
    }
  })
  return max
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}