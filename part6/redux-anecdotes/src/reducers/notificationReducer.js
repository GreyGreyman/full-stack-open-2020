const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    default:
      return state;
  }
}

let clearTimeoutID
export const setNotification = notification => dispatch => {
  clearTimeout(clearTimeoutID)
  dispatch({
    type: 'SET_NOTIFICATION',
    notification
  })
  clearTimeoutID = setTimeout(() => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: ''
    })
  }, 5000);
}


export default reducer