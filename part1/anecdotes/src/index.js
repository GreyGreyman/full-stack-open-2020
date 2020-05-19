import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))

  function handleVote() {
    const copy = [...points]
    copy[selected]++
    setPoints(copy)
  }

  let most_voted = 0;
  for (let index = 1; index < points.length; index++) {
    if (points[index] > points[most_voted])
      most_voted = index
  }

  return (
    <div>
      <section>
        <h2>Anecdote of the day</h2>

        <p>{props.anecdotes[selected]}</p>
        <p>has {points[selected]} votes</p>

        <button onClick={handleVote}>
          vote
        </button>
        <button onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))}>
          next anecdote
        </button>
      </section>

      <section>
        <h2>Anecdote with most upvotes</h2>
        <p>{props.anecdotes[most_voted]}</p>
      </section>

    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)