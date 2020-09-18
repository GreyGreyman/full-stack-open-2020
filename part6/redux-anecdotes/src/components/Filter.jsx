import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = event => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <form >
      filter: <input type="text" onChange={handleChange} />
    </form>
  )
}

export default Filter