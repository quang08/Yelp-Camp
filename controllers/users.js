const User = require('../models/user');

//REGISTER
module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}
module.exports.register = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Yelpcamp!');
            res.redirect('/campgrounds');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

//LOGIN
module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
};
module.exports.login = (req,res)=>{ //passport middleware
    req.flash('success', 'Welcome back!'); //if hit this means has authenticated successfully
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; //delete from the session so that when we refresh we still need to log in again
    res.redirect(redirectUrl);
}

//LOGOUT
module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
};