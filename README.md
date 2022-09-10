<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

<p align="center"><img src="https://raw.githubusercontent.com/NikelausM/yelp-camp/master/Campground%20Logo.PNG" width="250" height="250"><p>

<h1>Yelp Camp</h1>
  
<h2 id="table-of-contents">Table of contents</h2>

* [Introduction](#introduction)
* [Features](#features)
* [Launch](#launch)
* [Technologies](#technologies)
* [Documentation](#documentation)
* [Certificate](#certificate)

<h2 id="introduction">Introduction</h2>

This is a repository of my (Nguyen The Quang) YelpCamp project for the Udemy course, [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/).

Check out my [Github](https://github.com/quang08/)

Check out my [LinkedIn](https://www.linkedin.com/in/nguyen-the-quang-b8285a227/)

<h2 id="features">Features</h2>

YelpCamp is a yelp style, campground themed website. It allows for users to browse and search campgrounds that the community adds. The campgrounds are rated using a "like" system, and the users are able to talk about the campgrounds through a campground comment system.

### Key Features
- RESTful routes
- Campground Search (Fuzzy)/Show/Edit/Delete
- User Show/Edit
- Rating Campgrounds
- Comments/Review on Campgrounds
- Authentication
- Admin role
- Cluster Map
- Visible Campground location with Mini-Map and marker
- Image uploading to the cloud

### Added Features
- General
  - Object Oriented Javascript Refactor
    - My YelpCamp project is heavily refactored to take advantage of [ES6 syntax](https://www.ecma-international.org/ecma-262/6.0/index.html), including:
      - Classes (to make application more Object-Oriented)
      - Async/Await (to significantly reduce callbacks and ease asynchronous programming)
      - let and const (for increased control of scope)
      - etc
  - Flash messages for showing helpful information to users
  - Meaningful error messages
- Back-end
  - Seperation of routes into [controller classes](https://github.com/NikelausM/yelp-camp/tree/master/lib/controllers) and [routes](https://github.com/NikelausM/yelp-camp/tree/master/lib/routes)
  - Improved mongoose middleware for models to resolve inter [model](https://github.com/NikelausM/yelp-camp/tree/master/lib/models) dependencies
  - [API helper classes](https://github.com/NikelausM/yelp-camp/tree/master/bin/helpers)
  - [Custom stack trace extending error classes](https://github.com/NikelausM/yelp-camp/blob/master/bin/errors/errors.js)
- Front-end
  - Mobile responsive front end design
  - Landing page 
  - Wrapper class for wrapping models used in [View](https://github.com/NikelausM/yelp-camp/tree/master/lib/views) files to de-couple [Model](https://github.com/NikelausM/yelp-camp/tree/master/lib/models) (database) from [View](https://github.com/NikelausM/yelp-camp/tree/master/lib/views)
    - This allows a developer to use the same wrapper class in the views for any model, regardless of complexity
    - This increases encapsulation of models used in views
  - Modals for seeing who likes a Campground

### Deployment
This application is deployed as a read-only version to the following link: [https://secret-journey-31554.herokuapp.com/campgrounds](https://secret-journey-31554.herokuapp.com/campgrounds)

You may use the following account to login:
- username: helloworld123
- password: PNuYtb!2E!UZG&ryQ8*zse&$76eoFf

<h2 id="technologies">Technologies</h2>

### Database
- <strong> [MongoDB 6.0](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=bing&utm_campaign=bs_americas_canada_search_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&msclkid=48a2049cd3351ec1ff715b9250ce48fd) </strong>
  - For storing data in a NoSQL database.

### Back-end
- <strong> [Node.js: 16.7.0](https://nodejs.org/en/) </strong>
  - JavaScript runtime built on Chrome's V8 JavaScript engine.
- <strong> [npm 8.19.1](https://www.npmjs.com/) </strong>
  - Node Package Manager (like a Javascript dependency manager).
  - It allows you to easily install 3rd party Javascript Node.js libraries.

#### NPM packages
- <strong> [Express ^4.18.1](https://expressjs.com/) </strong>
- <strong> [Mongoose ^6.5.1](https://mongoosejs.com/) </strong>
- [body-parser ^1.20.0](https://www.npmjs.com/package/body-parser)
  - For parsing request bodies.
- [cloudinary ^1.31.0](https://www.npmjs.com/package/cloudinary)
  - For using the [Cloudinary API](https://cloudinary.com/) to store images on the cloud.
- [connect-flash ^0.1.1](https://www.npmjs.com/package/connect-flash)
  - For flash messages.
- [dotenv ^16.0.2](https://www.npmjs.com/package/dotenv)
  - For environment variables.
- [express-session ^1.17.3](https://www.npmjs.com/package/express-session)
  - For storing session data.
- [method-override ^3.0.0](https://www.npmjs.com/package/method-override)
  - For overriding HTTP verbs.
- [multer ^1.4.5-lts.1](https://www.npmjs.com/package/multer)
  - For handling multipart/form-data
- [node-geocoder ^3.27.0](https://www.npmjs.com/package/node-geocoder)
  - For using the [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro) to convert addresses to coordinates.
  - I created a [wrapper class for this module](https://github.com/NikelausM/yelp-camp/tree/master/bin/helpers/api/geocoder-helper.js) to improve error handling.
- [passport ^0.6.1](https://www.npmjs.com/package/passport)
  - For authentication.
- [passport-local ^1.0.0](https://www.npmjs.com/package/passport-local)
  - For local username and password authentication strategy for passport.js.
- [passport-local-mongoose ^7.1.2](https://www.npmjs.com/package/passport-local-mongoose)
  - Mongoose plugin for simplifying username/password authentication.
  
### Front-end
- <strong> [EJS ^3.1.8](https://ejs.co/) </strong>
  - Javascript templating engine used for building html pages.
- <strong> [Bootstrap 5.2.0](https://getbootstrap.com/) </strong>
  - Open source CSS framework used for creating responsive mobile-first web pages.
- [Font Awesome](https://fontawesome.com/)
  - For icons.


<h2 id="certificate">Certificate</h2>

<p align="center"><img src="https://github.com/quang08/Yelp-Camp/blob/master/certificate.jpeg"></p>
