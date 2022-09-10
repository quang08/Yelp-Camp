
//Seeding File: Generate Data, save them to the DB for development's use
//General Concept: Delete current data, generate new data, save data to DB,close 

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHelper');
const Campground = require('../models/campground');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
 
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
 
mongoose.connect('mongodb+srv://admin-quang:08022003@cluster0.jlhdmlk.mongodb.net/?retryWrites=true&w=majority', {
    // useNewUrlParser    : true,
    // useCreateIndex     : true,
    // useUnifiedTopology : true
});

mongoose.connect('mongodb+srv://admin-quang:08022003@cluster0.jlhdmlk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// const sample = array => array[Math.floor(Math.random() * array.length)];
const sample = (array) => {
    return array[Math.floor(Math.random()* array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});//delete all current data
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '63095055482b9261ae257118',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget augue vel erat viverra suscipit nec ut velit.',
            price,
            geometry: { 
                type : "Point", 
                coordinates : [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude
                 ] 
            },
            images: [ 
                {
                    url: 'https://res.cloudinary.com/dkdw3voic/image/upload/v1662609774/YelpCamp/iay0qiosx5mbap5vsshx.jpg',
                    filename: 'YelpCamp/iay0qiosx5mbap5vsshx',
                },
                {
                    url: 'https://res.cloudinary.com/dkdw3voic/image/upload/v1662609763/YelpCamp/vfwohndiif2ks0wzfxti.jpg',
                    filename: 'YelpCamp/vfwohndiif2ks0wzfxti',
                }
          
              ],
            
        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})