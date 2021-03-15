'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const {getRandomInt} = require(`../../utils`);
const {IMAGE_TYPES, CategoryImageName} = require(`../../const`);
const offersRouter = new Router();

const api = apiFactory.getAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {categories});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {

  const {body, file} = req;

  const offerData = {
    picture: file && IMAGE_TYPES.includes(file.mimetype) ? file.filename : ``,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: body.category
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

offersRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);

    res.render(`offers/ticket-edit`, {offer, categories});
  } catch (err) {
    next(err);
  }
});

offersRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const offer = await api.getOffer(id, {comments: true});

    const images = Array(offer.categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    res.render(`offers/ticket`, {offer, images});
  } catch (err) {
    next(err);
  }
});

module.exports = offersRouter;
