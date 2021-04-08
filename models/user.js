const mongoose=require('mongoose');
const {isEmail}=require('validator');
const bcrpyt=require('bcrypt');
//creating schema
const userSchema=new mongoose.Schema({
email:{
    type: String,
    required: [true,'Please enter an email'],
    unique: true,
    lowercase: true,
    validate:[isEmail,'Please enter valid email'] // validator se ham ye isEmail function ka use kr paa rhe
},
password:{
type: String,
required: [true,'Please enter password'],
minlength: [6,'Minimum password length is 6 characters']
},

});
//fire a function after doc saved to db
userSchema.post('save',function(doc,next){
    console.log('new user was created and saved',doc);
    next();
});
//fire a function before doc saved to db(save hone se pehle hi hamne password hash kardiya)
userSchema.pre('save',async function(next){
const salt=await bcrpyt.genSalt();
this.password=await bcrpyt.hash(this.password,salt);
next();
});

//static method to login user
userSchema.statics.login =async function(email,password){
    //first it checks if the email exists and then password 
    const user=await this.findOne({email});
    if(user){
    const auth=await bcrpyt.compare(password,user.password);
    if(auth){
        return user;
    }
    throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

//creating model based on the schema
const User=mongoose.model('user',userSchema); //first argument is name of the model and second is the schema
module.exports=User;