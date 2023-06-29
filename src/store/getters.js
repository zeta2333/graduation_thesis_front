const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  //添加
  buttons: state => state.user.buttons,
  menus: state => state.user.menus,
  userId: state => state.user.userId
}
export default getters
