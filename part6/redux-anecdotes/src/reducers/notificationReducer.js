const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    default:
      return state;
  }
}

// dispatch(setNotification(`you voted "${anecdote.content}"`))
// setTimeout(() => {
//   dispatch(setNotification(''))
// }, 5000);

// export const setNotification = notification => {
//   return {
//     type: 'SET_NOTIFICATION',
//     notification
//   }
// }

export const setNotification = notification => dispatch => {
  dispatch({
    type: 'SET_NOTIFICATION',
    notification
  })
  setTimeout(() => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification: ''
    })
  }, 5000);
}


export default reducer