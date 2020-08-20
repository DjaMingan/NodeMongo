const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
      .options(cors.corsWithOptions, authenticate.verifyUser, (req,res) => { res.sendStatus(200); })
      .(cors.cors, (req,res,next) => {
          Favorites.find({})
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next (err))
            .catch((err) => next(err));
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
          Favorites.create(req.body)
          .then((favorite) => {
              console.log('Favorite created', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
          }, (err) => next (err))
          .catch((err) => next(err));
      })
      .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
         Favorites.remove({})
           .then((resp) => {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(resp);
           }, (err) => next (err))
           .catch((err) => next(err));
         });

favoriteRouter.route('/:dishId')
        .options(cors.corsWithOptions, authenticate.verifyUser, (req,res) => { res.sendStatus(200); })

        .get(cors.cors, (req,res,next) => {
            Favorites.findById(req.params.dishId)
            .then((favorite) => {
                console.log('Favorite created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next (err))
            .catch((err) => next(err));
        })

        .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then(
                (favorites) => {
                    if (favorites == null) {
                        Favorites.create({
                            user: req.user._id,
                        })
                        .catch((err) => next(err));
                    }
                    else if (favorites != null) {
                      favorites.dishes.push(req.params.dishId);
                          favorites
                            .save()
                            .then(
                                (favorites) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                },
                                (err) => {
                                    next(err);
                                })
                              .catch((err) => {
                                  next(err);
                              });
                      }
                      else {
                        err = new Error(
                            'Unable to retrieve favorite list for user ' +
                                req.user._id
                        );
                        err.status = 404;
                        return next(err);
                      }
                  }
            (err) => next(err))
            .catch((err) => next(err));
    });
        .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
            Favorites.findByIdAndRemove(req.params.favoriteId)
            .then((resp) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
            }, (err) => next (err))
            .catch((err) => next(err));
        });

module.exports = favoriteRouter;
