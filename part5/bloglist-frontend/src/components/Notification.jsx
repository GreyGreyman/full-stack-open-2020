import React from 'react'

const Notification = React.memo(({ notification }) => {
  if (notification === null) {
    return null
  }

  const { message, state } = notification

  return (
    <div className={`notification notification_${state}`}>
      {message}
    </div>
  )
})

export default Notification
