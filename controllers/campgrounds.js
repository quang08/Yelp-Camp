const Campground = require('../models/campground');//Campground Schema, model
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken}); //contains forwardGeocode and reverseGeocode


//INDEX
module.exports.index = async (req,res)=>{
    //fuzzy search
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const campground = Campground.find({title: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1) {
                   req.flash('error','There is no match for your search. Please try again');
                   res.redirect('/campgrounds');
                }
                console.log(allCampgrounds[0]);
                res.render('campgrounds/show', {campground: allCampgrounds[0]});
            };
        });
    }else{
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index',{campgrounds});
        //render index file in views/campgrounds. Passing in campgrounds variable above to render the name
    }
};

//NEW & CREATE
module.exports.renderForm = (req,res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash('error', 'you must be signed in');
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new');
};
module.exports.createCampground = async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    //we can customize our error message, by throwing the error, 
    //which the catchAsync will catch it and pass it to next() which will hit our error handling function at the end of the file 
    //using joi to create a schema where it will validate if the data is not correct
    //if there is an error, throw new ExpressError
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f=>({url: f.path, filename: f.filename})); //assigning url from path, filename from filename, from the req.files
    campground.author = req.user._id; //associate campground with the particular user 
    await campground.save();
    console.log(campground)
    req.flash('success', 'Succesfully made a new Campground!') //flash message
    res.redirect(`/campgrounds/${campground._id}`);
};

//SHOW
module.exports.showCampground = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', //populate the reviews, each reviews populate author
        populate: {
            path: 'author'
        }
    }).populate('author'); //campground author
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds'); //return to prevent still rendering campground show
    }
    res.render('campgrounds/show',{campground});
};

//EDIT & UPDATE
module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds'); //return to prevent still rendering campground show
    }
    res.render('campgrounds/edit',{campground});
}
module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename})) //assigning url from path, filename from filename, from the req.files
    campground.images.push(...imgs);
    await campground.save(); 
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull:{ images:{ filename:{ $in:req.body.deleteImages }}}});
        console.log(campground)
    }
    //{...req.body.campground} or just id, req.body.campground would be fine
    //spread syntax is a better option when we want to pass a copy of all those object/array elements, instead of passing the entire object/array itself.
    //since the original object could potentially be changed then passing in a copy may be the better option.
    //When ever we pass objects or arrays to functions, we generally spread them in a empty array or object so that any operations done on those arguments in the function doesn't impact the original array or object
    req.flash('success', 'Succesfully updated Campground!') //flash message
    res.redirect(`/campgrounds/${campground._id}`);
};

//DELETE
module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted Campground!') //flash message
    res.redirect('/campgrounds');
};

