let initialState = {
  username: null,
  profile_pic: null
}

const UPDATE_USER = 'UPDATE_USER';
const LOGOUT = 'LOGOUT';

export const updateUser = (userData) => {
  return {
    type: UPDATE_USER,
    payload: userData
  }
}

export const logout = () => {
  return {type: LOGOUT}
}

export default function reducer (state=initialState, action) {
  switch (action.type) {
    case UPDATE_USER + "_FULFILLED":
      const {username, profile_pic} = action.payload.user
      return {username, profile_pic}
    case LOGOUT + "_FULFILLED":
      return {username: null, profile_pic: null}  
    default:
      return state;
  }
}