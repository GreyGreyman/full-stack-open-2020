import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  let mockCreateBlog

  beforeEach(() => {
    mockCreateBlog = jest.fn()

    component = render(
      <BlogForm createBlog={mockCreateBlog} />
    )
  })

  test('calls event handler with right arguments', () => {
    const titleInput = component.getByTestId('title input')
    fireEvent.change(titleInput, { target: { value: 'test title' } })

    const authorInput = component.getByTestId('author input')
    fireEvent.change(authorInput, { target: { value: 'test author' } })

    const urlInput = component.getByTestId('url input')
    fireEvent.change(urlInput, { target: { value: 'test url' } })

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(mockCreateBlog.mock.calls.length).toBe(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'test title',
      author: 'test author',
      url: 'test url'
    })
  })
})
