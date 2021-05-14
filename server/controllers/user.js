const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db');
    const {username, password} = req.body;
    const profile_pic = `https://robohash.org/${username}.png`;
    const result = await db.user.find_user_by_username([username]);
    const existingUser = result[0];
    if (existingUser) {
      return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.user.create_user([username, hash, profile_pic]);
    const user = registeredUser[0];
    req.session.user = {id: user.id, username: user.username, profile_pic: user.profile_pic};
    return res.status(201).send(req.session.user);
  },

  login: async (req, res) => {
    const db = req.app.get('db');
    const {username, password} = req.body;
    const foundUser = await db.user.find_user_by_username([username]);
    const user = foundUser[0];
    if (!user) {
      return res.status(401).send('User not found. Please register as a new user before logging in')
    }
    // console.log(user.password)
    const isAuthenticated = bcrypt.compareSync(password, user.password);
    if (!isAuthenticated) {
      return res.status(401).send('Incorrect password')
    }
    req.session.user = {id: user.id, username: user.username, profile_pic: user.profile_pic};
    return res.send(req.session.user);
  },

  logout: (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  },

  getUser: async (req, res) => {
    const db = req.app.get('db');
    if (!req.session.user) {
      return res.status(404).send('Please log in')
    }
    const {username} = req.session.user;
    const foundUser = await db.user.find_user_by_username([username]);
    const user = foundUser[0];
    return res.status(200).send(req.session.user);
  }
}