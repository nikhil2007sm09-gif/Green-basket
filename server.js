const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/greenbasket_auth")
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log(err));

const UserSchema = new mongoose.Schema({
  name:String,
  email:{ type:String, unique:true },
  password:String,
  provider:{ type:String, default:"local" }
});

const User = mongoose.model("User", UserSchema);

app.post("/api/signup", async (req,res)=>{
  const { name, email, password } = req.body;

  if(!name || !email || !password){
    return res.json({ success:false, error:"All fields required" });
  }

  const exists = await User.findOne({ email });
  if(exists){
    return res.json({ success:false, error:"User already exists" });
  }

  const hash = await bcrypt.hash(password,10);
  await new User({ name, email, password:hash }).save();

  res.json({ success:true });
});

// LOGIN
app.post("/api/login", async (req,res)=>{
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(!user) return res.json({ success:false, error:"User not found" });

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.json({ success:false, error:"Wrong password" });

  res.json({ success:true });
});

// GOOGLE LOGIN
app.post("/api/google-login", async (req,res)=>{
  const { email, name } = req.body;

  let user = await User.findOne({ email });
  if(!user){
    await new User({ name, email, password:"", provider:"google" }).save();
  }
  res.json({ success:true });
});

app.post("api/update" , async (req, res) => {
    const { email, name }= req.body;

    let user = await user.findOne({ email});
    if(!user) {
        await new user ({ name, email ,password:"", provider:"google"}).save();

    }

})
 

app.listen(3000,()=>{
  console.log("🚀 Server running at http://localhost:3000");
});
