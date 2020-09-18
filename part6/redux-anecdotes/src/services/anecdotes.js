import axios from 'axios';

const baseURL = 'http://localhost:3001/anecdotes'


const getAll = async () => {
  return (await axios.get(baseURL)).data
}

const create = async anecdote => {
  const response = await axios.post(baseURL, anecdote)
  return response.data
}

const update = async anecdote => {
  return (await axios.put(`${baseURL}/${anecdote.id}`, anecdote)).data
}

export default { getAll, create, update }