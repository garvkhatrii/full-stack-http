const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ThisIsOneOfTheMostSecuredJsonWebTokenSecretInTheWorld";
const app = express();

app.use(express.json())

const users = [];

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

app.post('/signup',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
        users.push({
            username:username,
            password:password
        })
        res.send({
            message:"You are signed up!"
        })
})

app.post('/signin',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const userFound = users.find(u=>u.username == username && u.password == password);
    if(!userFound){
        res.send({
            Message:"Credentials required"
        })
    } else {
        const token = jwt.sign({username:username},JWT_SECRET)
        res.json({token:token})
    }
    
})

function auth(req,res,next){
    const token = req.headers.token

    if(token){
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                res.status(404).send({message:"token can't be verified!"})
            } else {
                req.user = decoded
                next()
            }
        })
    } else {
        res.status(400).send({
            message:"Token not found!"
        })
    }
}

app.get('/me',auth,(req,res)=>{
    const user = req.user
    res.json({
        username : user.username
    })
})

app.listen(3000);