import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk';
import reducer from './reducer'
const initValue={
  'loading':false
}
const store=createStore(reducer,initValue,applyMiddleware(thunk))
export default store