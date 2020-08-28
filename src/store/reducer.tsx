import * as types from "./action-types";
export default (state:any,action:any) => {
  switch (action.type) {
    case types.SETLOADING:
      return { loading: action.bol};
    default:
      return state
  }
}