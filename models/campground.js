const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate-v2');

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png
const ImageSchema = new Schema({
    url: String, //storing the image
    filename: String, //for deleting the image
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts = { toJSON: { virtuals: true} };

const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'], //location.type must be Point
            required: true
        },
        coordinates: {
            type: [Number], //an array of numbers
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
        <strong><h5><a href="/campgrounds/${this._id}">${this.title}</a></h5></strong>
        <p>${this.description.substring(0,40)}...</p>
    `;
    //this: campground instance
})

//Mongoose middleware 
//findByIdAndDelete will trigger this route findOneAndDelete
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Campground',CampgroundSchema);