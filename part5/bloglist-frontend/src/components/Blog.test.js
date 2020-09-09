import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockAddLike
  let mockDeleteBlog

  beforeEach(() => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      user: {
        username: 'test username'
      }
    }

    const loggedInUser = {
      username: 'test username',
      name: 'test user'
    }

    mockAddLike = jest.fn()
    mockDeleteBlog = jest.fn()

    component = render(
      <Blog
        blog={blog}
        loggedInUser={loggedInUser}
        addLike={mockAddLike}
        deleteBlog={mockDeleteBlog}
      />
    )
  })


  test('renders only title and author by default', () => {
    const details = component.container.querySelector('.details')

    expect(component.container).toHaveTextContent('test title')
    expect(component.container).toHaveTextContent('test author')
    expect(details).not.toHaveClass('details_visible')
  })

  test('renders details after the button click', () => {
    const details = component.container.querySelector('.details')
    const button = component.getByText('show')

    fireEvent.click(button)

    expect(component.container).toHaveTextContent('test title')
    expect(component.container).toHaveTextContent('test author')
    expect(details).toHaveClass('details_visible')
  })

  test('clicking the "like" button twice calls event handler twice', () => {
    const button = component.getByText('like')

    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockAddLike.mock.calls.length).toBe(2)
  })
})
