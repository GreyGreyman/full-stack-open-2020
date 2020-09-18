import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'ADD_VOTE':
      const id = action.data.id
      const anecdoteToChange = state.find(anecdote => anecdote.id === id)
      const newAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
      return state.map(anecdote => anecdote.id !== id ? anecdote : newAnecdote)
    case 'CREATE_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.anecdotes
    default:
      return state
  }
}

export const addVote = anecdote => async dispatch => {
  const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  try {
    const savedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch({
      type: 'ADD_VOTE',
      data: { id: savedAnecdote.id }
    })
  } catch (error) {
    console.log(error)
  }
}

export const createAnecdote = anecdote => async dispatch => {
  const savedAnecdote = await anecdoteService.create(anecdote)
  dispatch({
    type: 'CREATE_ANECDOTE',
    data: savedAnecdote
  })
}

export const initAnecdotes = () => async dispatch => {
  const anecdotes = await anecdoteService.getAll()
  dispatch({
    type: 'INIT_ANECDOTES',
    anecdotes
  })
}


export default reducer