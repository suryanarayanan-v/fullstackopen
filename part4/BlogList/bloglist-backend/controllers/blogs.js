const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) response.status(400).end()
  if (!request.body.hasOwnProperty('likes')) request.body.likes = 0

  const blog = new Blog(request.body)
  const user = await User.findById(request.body.user)

  const newBlog = await blog.save()

  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
  }

  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (!returnedBlog) response.status(404).end()
  response.json(returnedBlog)
})

module.exports = blogsRouter