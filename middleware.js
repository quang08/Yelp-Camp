const {campgroundSchema,reviewSchema} = require('./schemas'); //validateCampground use for form validation from req.body
const ExpressError = require('./utils/ExpressError')//validateCampground use for default error handling
const Campground = require('./models/campground'); //isAuthor use for finding campground
const Review = require('./models/review'); //isReviewAuthor use for finding reviews

//middleware for authentication: check loggin in or not, only logged in can access certain features and routes
module.exports.isLoggedIn = (req,res,next) =>{
    const { id } = req.params;
    if(!req.isAuthenticated()){
        req.session.returnTo = (req.query._method === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    };
    next();
}

//middleware for server side error validation
module.exports.validateCampground = (req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);//when it validates, we take out the error 
    if(error){
        const msg = error.details.map(elements=>elements.message).join(',');//details is object so needs to map
        throw new ExpressError(msg,400);
    }else{
        next() //this helps proceed the procedures, without it we wouldnt be able to reach the express route but stops after validating
    }
}


//middleware for campground authorization: only author can access certain features and routes
module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){ //if the author of that campground's id != with the current user's id
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//middleware for review authorization: only author can access certain features and routes
module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id, reviewId} = req.params; // /campgrounds/id/reviews/reviewId
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){ //if the author of that campground's id != with the current user's id
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//middleware for server side error validation
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);//when it validates, we take out the error 
    if(error){
        const msg = error.details.map(elements=>elements.message).join(',');//details is object so needs to map
        throw new ExpressError(msg,400);
    }else{
        next() //this helps proceed the procedures, without it we wouldnt be able to reach the express route but stops after validating
    }
};

//middleware for image upload limit
const multer = require('multer');
const {storage} = require('./cloudinary/index');
const upload = multer({
    storage,
    limits: { fileSize: 4000000 } 
    //filesize in bytes, each file size should not be over 3MB
 });

module.exports.uploadFile = (req, res, next) => {
    const uploadProcess = upload.array('image');
    const {id} = req.params;
    uploadProcess(req, res, err => {
        if (err instanceof multer.MulterError) {
            req.flash('error', 'Each File Should Not Exceed 4MB');
            return res.redirect(`/campgrounds/${id}`);
        } else if (err) {
            req.flash('error', 'Each File Should Not Exceed 4MB');
            return res.redirect(`/campgrounds/${id}`);
        }
        next();
       });
    };

