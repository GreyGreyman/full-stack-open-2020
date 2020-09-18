import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = props => {

  const handleChange = event => {
    props.setFilter(event.target.value)
  }

  return (
    <form >
      filter: <input type="text" onChange={handleChange} />
    </form>
  )
}

export default connect(null, { setFilter })(Filter)