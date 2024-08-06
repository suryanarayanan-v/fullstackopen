const lo = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map((blog) => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.find((a) => {
    return a.likes === Math.max(...blogs.map((blog) => blog.likes))
  })

  return favBlog === undefined
    ? {}
    : { title: favBlog.title, author:favBlog.author, likes: favBlog.likes }
}

const mostBlogs = (blogs) => {
  if( blogs.length === 0) return {}

  const blogCount = lo.countBy(blogs, 'author')
  const popularAuthor = lo.maxBy(lo.keys(blogCount), (author) => {
    return blogCount[author]
  })

  return { author: popularAuthor, blogs: blogCount[popularAuthor]}
}

const mostLikes = (blogs) => {
  if( blogs.length === 0) return {}

  const reducer = (sum, item) => {
    return sum + item
  }

  const totalLikesForEach = lo.map(lo.groupBy(blogs, 'author'),
    (info, authors) => {
      const totalLikes = info.map((i) => i.likes).reduce(reducer, 0)
      return { author: authors, likes: totalLikes }
  })

  return lo.maxBy(totalLikesForEach, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
