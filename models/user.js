const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
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
    match: /https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
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
