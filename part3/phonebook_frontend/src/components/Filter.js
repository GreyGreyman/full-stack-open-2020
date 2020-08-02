import React from 'react'

const Filter = ({nameFilter, handleNameFilterChange}) => {
  return (
    <div>
      Filter shown with: <input value={nameFilter} onChange={handleNameFilterChange} />
    </div>
  )
}

export default Filter