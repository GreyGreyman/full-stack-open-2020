import React from 'react'

const Notification = ({ message, state }) => {
  if (message === '') {
    return null
  }

  return (
    <div className={`notification notification_${state}`}>
      {message}
    </div>
  )
}
export default Notification