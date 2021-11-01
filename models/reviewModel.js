const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId, // Type is mongodb ID
      ref: 'Tour',
      required: [true, 'Review must belong to tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId, // Type is mongodb ID
      ref: 'User',
      required: [true, 'Review must belong to user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // .populate({path,select})  path is which field which you want to pupolate and select is field that you dont want to populate with - flag
  // this.populate({
  //   path: 'tour', //tour here is same as tour mentioned in schema
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // }); // 👆👆 this was creating chain of virtual populates

  this.populate({
    path: 'user', //user here is same as user mentioned in schema
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // Review.calcAverageRatings() but Review is not defined yet and we cant put this function after declaration. So we need to do this.constructor.calcAverageRatings();
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
