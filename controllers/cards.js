const mongoose = require('mongoose');
const Card = require('../models/card');

const { ObjectId } = mongoose.Types;

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden -err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};


module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (!ObjectId.isValid(cardId)) {
    return (new NotFoundError('not found'));
  }
  return Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((cardRemove) => res.send({ remove: cardRemove }))
            .catch(next);
        } else {
          next(new ForbiddenError('Это не ваша карта, не может быть удалена'));
        }
      } else {
        next(new NotFoundError('Карта не найдена'));
      }
    })
    .catch(next);
};
