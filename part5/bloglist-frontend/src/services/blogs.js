import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  return (await axios.get(baseUrl)).data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  return (await axios.post(baseUrl, blog, config)).data
}

const update = async (id, blog) => {
  return (await axios.put(`${baseUrl}/${id}`, blog)).data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  return (await axios.delete(`${baseUrl}/${id}`, config)).data
}

export default { getAll, create, setToken, update, remove }