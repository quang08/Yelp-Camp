const express = require('express');
const router = express.Router({mergeParams: true});//for Router to have access to req.params
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const Review = require('../models/review');
const Campground = require('../models/campground');
const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware'); //middleware
const reviews = require('../controllers/reviews');

//---------------------------REVIEW ROUTES-------------------------

//post review to the route and save it to the campground it's created on
router.post('/',validateReview,isLoggedIn, catchAsync(reviews.createReview));

//DELETE REVIEWS: Not only we need to delete the review itself but also the reference id in the Campground
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;