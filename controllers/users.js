const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const User = require('../models/user');

const { JWT_SECRET } = require('../secret');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (user.length === 0) {
        return (new NotFoundError('База данных user пуста!'));
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (password.length > 11) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(201).send({
        _id: user._id, name: user.name, about: user.about, email: user.email,
      }))
      .catch(next);
  }
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userId) => {
      if (!userId) {
        throw new NotFoundError('Такого пользователя нет');
      } else {
        res.send({ userId });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .send(token)
        .end();
    })
    .catch((err) => {
      if (err.message !== 'Неправильные почта или пароль') {
        return next(err);
      }
      return next(new UnauthorizedError(err.message));
    });
};
