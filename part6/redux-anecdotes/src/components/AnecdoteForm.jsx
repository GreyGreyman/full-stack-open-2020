import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const submitHandler = async (event) => {
    event.preventDefault()

    const newAnecdote = {
      content: event.target.anecdote.value,
      votes: 0
    }
    event.target.anecdote.value = ''

    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created anecdote: "${newAnecdote.content}"`))
  }

  return (
    <section>
      <h2>Create new anecdote</h2>
      <form onSubmit={submitHandler}>
        <div><input name='anecdote' /></div>
        <button>create</button>
      </form>
    </section>
  )
}

export default AnecdoteForm