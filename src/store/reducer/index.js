const initialState = {
  userData: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL": {
      return {
        ...state,
        userData: action.userData,
      };
    }
    case "LOGOUT_USER": {
      return {
        ...state,
        userData: [],
      };
    }
    default:
      return state;
  }
};
export default reducer;
