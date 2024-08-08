const { test, after, beforeEach, describe } = require('node:test')
let mongoose = require('mongoose')
const assert = require('assert')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('notes of db is same as initial', async () => {
  const infoInDb = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(infoInDb.body.length, helper.initialBlogs.length)
})

test('id of notes is not defied as _id', async () => {
  const infoInDb = await helper.getBlogsInDb()
  const ids = infoInDb.filter((blog) => !!blog.id)
  assert.strictEqual(ids.length, helper.initialBlogs.length)
})

test('creating a new blog adds it to db', async () => {
  const newBlog = {
    title: 'This is a new blog',
    author: 'John Doe',
    url: 'https://blog.com',
    likes: 7
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const dataInDb = await helper.getBlogsInDb()

  assert.strictEqual(dataInDb.length, helper.initialBlogs.length + 1)

  const titles = dataInDb.map((blog) => blog.title)
  assert(titles.includes('This is a new blog'))
})

test('blogs with no likes property is set to 0', async () => {
  const newBlog = {
    title: 'This is a new blog',
    author: 'John Doe',
    url: 'https://blog.com',
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const dataInDb = await helper.getBlogsInDb()

  const likes = dataInDb.filter((blog) => blog.hasOwnProperty('likes'))
  assert.strictEqual(likes.length, helper.initialBlogs.length + 1)
})
describe('blogs without critical information', () => {
  test('blogs without title gets bad request error', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://blog.com',
      likes: 7,
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('blogs without url gets bad request error', async () => {
    const newBlog = {
      title: 'This is a new blog',
      author: 'John Doe',
      likes: 7,
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('deleting blogs', () => {
  test('deleting valid blogs', async () => {
    const blogsInDb = await helper.getBlogsInDb()
    const blogToBeDeleted = blogsInDb[0].id

    await api.delete(`/api/blogs/${blogToBeDeleted}`)
      .expect(204)

    const blogDbAfterDeletion = await helper.getBlogsInDb()
    const titles = blogDbAfterDeletion.map((blog) => blog.title)
    assert(!titles.includes(blogsInDb[0].title))
  })
})

describe('updating blogs', () => {
  test('updating valid blogs', async () => {
    const blogsInDb = await helper.getBlogsInDb()

    const newBlog = {
      title: blogsInDb[0].title,
      author: blogsInDb[0].author,
      url: blogsInDb[0].url,
      likes: 100,
    }

    await api.put(`/api/blogs/${blogsInDb[0].id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const dataInDbAfterUpdate = await helper.getBlogsInDb()
    const updatedBlog = dataInDbAfterUpdate.find((blog) => blog.id === blogsInDb[0].id)
    assert.strictEqual(updatedBlog.likes, 100)
  })

  test('updating a non existent blog', async () => {
    const nonExistentId = await helper.getNonExistentId()
    const newBlog = {
      title: 'this is a non existent blog',
      author: 'john doe',
      url: 'https://blog.com',
      likes: 100,
    }

    await api.put(`/api/blogs/${nonExistentId}`)
      .send(newBlog)
      .expect(404)
  })
})

after(async () => {
  mongoose.connection.close()
})


