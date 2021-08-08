import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  CLEAR_DATA,
  USER_UPDATE_PROFILE,
} from "../../constants";

// 초기 state 값
const initialState = {
  currentUser: null,
  posts: [],
  following: [],
};

// reducer (user)
export const user = (state = initialState, action) => {
  switch (action.type) {
    // currentUser change
    case USER_STATE_CHANGE:
      return { ...state, currentUser: action.currentUser };
    // posts change
    case USER_POSTS_STATE_CHANGE:
      return { ...state, posts: action.posts };
    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: action.following,
      };
    case USER_UPDATE_PROFILE:
      return {
        ...state,
        currentUser: { ...currentUser, photoURL: action.photoURL },
      };
    case CLEAR_DATA:
      return {
        currentUser: null,
        posts: [],
        following: [],
      };
    default:
      return state;
  }
};
