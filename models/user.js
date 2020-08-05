const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictingRequestError = require('../errors/conflicting-request-err');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (url) => `${url.value} некорректный адрес!`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (email) => `${email.value} некорректный адрес почты!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 11,
  },
});

userSchema.statics.findUserByCredentials = function find(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильная почта!'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильный пароль!'));
          }
          return user;
        });
    });
};

function duplicateErrorHandleMiddleware(error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new ConflictingRequestError('Пользователь с таким email уже есть'));
  } else {
    next();
  }
}

userSchema.post('save', duplicateErrorHandleMiddleware);
userSchema.post('update', duplicateErrorHandleMiddleware);
userSchema.post('findOneAndUpdate', duplicateErrorHandleMiddleware);
userSchema.post('insertMany', duplicateErrorHandleMiddleware);

module.exports = mongoose.model('user', userSchema);
