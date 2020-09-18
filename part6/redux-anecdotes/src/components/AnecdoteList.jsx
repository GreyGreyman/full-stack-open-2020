import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, voteHandler }) => (
  <div>
    <p>{anecdote.content}</p>
    <div>
      has {anecdote.votes} votes
      <button onClick={() => voteHandler(anecdote)}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state =>
    state.anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes))
  const dispatch = useDispatch()

  const voteHandler = anecdote => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`you voted "${anecdote.content}"`))
  }

  return (
    <section>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote =>
          <li key={anecdote.id}>
            <Anecdote
              anecdote={anecdote}
              voteHandler={voteHandler}
            />
          </li>
        )}
      </ul>
    </section>
  )
}

export default AnecdoteList