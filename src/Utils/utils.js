
export async function verifyToken(dispatch) {
  var refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  var data = await dispatch(verifyRefreshToken({ expandRefreshTokenExpiration: false, refreshToken: refreshToken.token }));
  var status = await data.payload.status;
  if (status == 200) {
    var accessToken = JSON.stringify(data.payload.data.accessToken);
    localStorage.setItem("x-access-token", accessToken);
    setTimeout(async () => {
      window.location.reload();
    }, 1000);
  } else {
    localStorage.clear();
    setTimeout(async () => {
      window.location.reload();
    }, 1000);
  }
  /* var user = await dispatch(getUserInfo({ token: access.token })); */
}
