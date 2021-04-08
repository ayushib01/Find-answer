const User=require('../models/user'); //importing user model
const jwt=require('jsonwebtoken');
const { response } = require('express');

//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    let errors={email:'',password:''};

//incorrect email
if(err.message==='incorrect email'){
    errors.email='that email is not registered';
}
if(err.message==='incorrect password'){
    errors.password='that password is incorrect';
}

    //duplicate error code
    if(err.code===11000){
errors.email='that email already exists';
return errors;
    }
    //validation errors
if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties})=>{
        errors[properties.path]=properties.message;
    });
}
return errors;
}
const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'ayushi secret',{
        expiresIn: maxAge
});
}
//------handler functions which we will use in our routes
module.exports.signup_get=(req,res)=>{
    res.render('signup');
}
module.exports.signup_post=async (req,res)=>{
    const{email,password}=req.body;
try{
const user= await User.create({email,password});   //await makes a function wait for a Promise
const token=createToken(user._id);
res.cookie('jwt',token,{httpOnly: true,maxAge:maxAge*1000});
res.status(201).json({user:user._id}); //if successfully the user created
}
catch(err){
        const errors=handleErrors(err);
        res.status(404).json({errors});
    }
}
module.exports.login_get=(req,res)=>{
    res.render('login');
}
module.exports.login_post=async (req,res)=>{
    const{email,password}=req.body;
    try{
const user=await User.login(email,password);
const token=createToken(user._id);
res.cookie('jwt',token,{httpOnly: true,maxAge:maxAge*1000});
res.status(200).json({user:user._id});
    }
    catch(err){
        const errors=handleErrors(err);
res.status(400).json({errors});
    }
}
module.exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{maxAge:1}); //replacing with a blank cookie and defining the session of it as 1 sec so that it expires very soon
    res.redirect('/');
}