import React from 'react'
import { connect } from 'react-redux'
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

const AnecdoteList = props => {

  const voteHandler = anecdote => {
    props.addVote(anecdote)
    props.setNotification(`you voted "${anecdote.content}"`)
  }

  return (
    <section>
      <h2>Anecdotes</h2>
      <ul>
        {props.anecdotes.map(anecdote =>
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

const mapStateToProps = state => {
  return {
    anecdotes: state.anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  }
}

export default connect(mapStateToProps, { addVote, setNotification })(AnecdoteList)