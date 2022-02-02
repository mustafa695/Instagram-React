function loginUserData(userData) {
  return {
    type: "LOGIN_WITH_EMAIL",
    userData: userData
  };
}

function logoutUser(userData) {
  return {
    type: "LOGOUT_USER",
    userData: userData
  };
}

export { loginUserData, logoutUser };
