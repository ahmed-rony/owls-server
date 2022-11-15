const db = require("../routes/connect.js");
const jwt = require('jsonwebtoken');
const moment = require('moment');

const getPosts = (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}

    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        // VID: 1hr, 1hr:7
        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY createDate DESC`;
    
        db.query(q, [userInfo.id, userInfo.id], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)};
            res.send(data);
        })
    })
    
};

const addPost = (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "INSERT INTO posts (`desc`, `img`, `createDate`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]
    
        db.query(q, [values], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)};
            res.status(200).send('Post has been created!');
        })
    })

}

module.exports = {getPosts, addPost};