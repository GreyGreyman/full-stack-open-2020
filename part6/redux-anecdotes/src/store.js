import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import anecdotes from './reducers/anecdoteReducer'
import notification from './reducers/notificationReducer'
import filter from './reducers/filterReducer'


export default createStore(
  combineReducers({ notification, filter, anecdotes }),
  composeWithDevTools(applyMiddleware(thunk))
)