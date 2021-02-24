'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my/my-tickets`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my/comments`, {offers: offers.slice(0, 3)});
});

module.exports = myRouter;
