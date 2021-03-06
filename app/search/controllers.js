const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');

exports.profile = async (ctx) => {
  const profile = await User.findById(ctx.params.id).populate('stack');
  ctx.body = {
    profile,
  };
};
exports.people = async (ctx) => {
  const body = ctx.query;
  console.log(body);
  const query = {};
  const sort = {};
  // Category
  if (body.category !== '0') {
    query.stack = body.category;
  }
  // Sort
  if (body.sort !== '0') {
    if (body.sort === '1') {
      sort.dailyRate = 1;
    } else if (body.sort === '2') {
      sort.dailyRate = -1;
    } else if (body.sort === '3') {
      sort.rating = 1;
    } else {
      sort.rating = -1;
    }
  }
  // Name
  if (body.name !== '') {
    query.$or = [{
      name: {
        $regex: body.name,
        $options: 'i',
      },
    }];
  }
  // const id = await ctx.params.id;
  const allPeople = await User.find(query).sort({ ...sort }).limit(8 * (body.skip + 1)).populate('stack');
  ctx.body = {
    allPeople,
  };
};

exports.getCategory = async (ctx) => {
  const categorys = await Category.find({});
  ctx.body = {
    categorys,
  };
};

exports.cheat = async (ctx) => {
  const user = await User.find({});
  console.log(user);
  user.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    element.location.type = 'Point';
    element.location.coordinates = [30.422222, 50.446629];
    element.save();
  });
  // user.save();
  ctx.body = user;
};

exports.location = async (ctx) => {
  const people = await User.find({
    location: {
      $near: {
        $maxDistance: 10000,
        $geometry: {
          type: 'Point',
          coordinates: [30.425441, 50.448254],
        },
      },
    },
  }).populate('stack');
  ctx.body = people;
}
