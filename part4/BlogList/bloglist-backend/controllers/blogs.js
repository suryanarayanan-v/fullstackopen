const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) response.status(400).end()
  if (!request.body.hasOwnProperty('likes')) request.body.likes = 0

  const body = request.body

  const user = await request.user

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user.id
  })

  const newBlog = await blog.save()

  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

  const blogToBeDeleted = await Blog.findById(request.params.id)
  const user = request.user

  if (blogToBeDeleted.user.toString() === user.id) {
    await Blog.findByIdAndDelete(blogToBeDeleted.id)
    return response.status(204).end()
  }
  console.log(user.id)
  user.blogs = user.blogs.filter(blog => blog !== blogToBeDeleted.id)
  await user.save()
  response.status(401).json({ error: 'User does not have permission to delete the blog' })
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