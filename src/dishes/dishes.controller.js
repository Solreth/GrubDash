const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const list = (req, res) => res.json({ data: dishes });
// TODO: Implement the /dishes handlers needed to make the tests pass

const hasName = (req, res, next) => {
  const { data: { name } = {} } = req.body;
  if (name) {
    return next();
  }
  return next({ status: 400, message: "Dish must include a name" });
};

const hasDescription = (req, res, next) => {
  const { data: { description } = {} } = req.body;
  if (description) {
    return next();
  }
  return next({ status: 400, message: "Dish must include a description" });
};

const hasPrice = (req, res, next) => {
  const { data: { price } = {} } = req.body;
  if (Number(price) <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  if (price) {
    return next();
  }
  return next({ status: 400, message: "Dish must include a price" });
};

const hasImage_url = (req, res, next) => {
  const { data: { image_url } = {} } = req.body;
  if (image_url) {
    return next();
  }
  return next({ status: 400, message: "Dish must include a image_url" });
};

const create = (req, res, next) => {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newPost = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newPost);
  res.status(201).json({ data: newPost });
};

const dishExists = (req, res, next) => {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.locals.foundDish = foundDish;
    res.locals.dishId = dishId;
    return next();
  } else {
    return next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
};

const read = (req, res) => {
  res.status(200);
  res.json({ data: res.locals.foundDish });
};

const update = (req, res, next) => {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  dish = res.locals.foundDish;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.status(200).json({ data: dish });
};

const idMatches = (req, res, next) => {
  const { data: { id } = {} } = req.body;

  if (!id || typeof id === "undefined") {
    next();
  }

  if (id !== res.locals.dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${res.locals.dishId}`,
    });
  }

  next();
};

module.exports = {
  list,
  create: [hasName, hasDescription, hasPrice, hasImage_url, create],
  read: [dishExists, read],
  update: [
    dishExists,
    hasName,
    hasDescription,
    hasPrice,
    hasImage_url,
    idMatches,
    update,
  ],
};
