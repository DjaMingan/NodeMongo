const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    user: {
      author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      }
    },
    dishes: {
      author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'dishes'
      }
    }
  }, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;
