if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');//Campground Schema, model
const {isLoggedIn, validateCampground, isAuthor,uploadFile} = require('../middleware'); //middl3ware
const campgrounds = require('../controllers/campgrounds');
const ExpressError = require('../utils/ExpressError')
const multer = require('multer');
const {storage} = require('../cloudinary/index');

//-----------------------------CRUD--------------------------------------
//INDEX
router.get('/',catchAsync(campgrounds.index));

//NEW & CREATE
router.get('/new',isLoggedIn,campgrounds.renderForm);
router.post('/',isLoggedIn,uploadFile,validateCampground,catchAsync(campgrounds.createCampground));//!!

//SHOW
router.get('/:id', catchAsync(campgrounds.showCampground));

//EDIT & UPDATE
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));
router.put('/:id',isLoggedIn,isAuthor,uploadFile,validateCampground,catchAsync(campgrounds.updateCampground));

//DELETE
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));


module.exports = router;