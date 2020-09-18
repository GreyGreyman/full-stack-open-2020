import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'


const AnecdoteForm = props => {

  const submitHandler = async (event) => {
    event.preventDefault()

    const newAnecdote = {
      content: event.target.anecdote.value,
      votes: 0
    }
    event.target.anecdote.value = ''

    props.createAnecdote(newAnecdote)
    props.setNotification(`you created anecdote: "${newAnecdote.content}"`)
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

export default connect(null, { createAnecdote, setNotification })(AnecdoteForm)