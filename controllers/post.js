const db = require("../routes/connect.js");
const jwt = require('jsonwebtoken');
const moment = require('moment');

const getPosts = (req, res) =>{

    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}

    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;

        // VID: 1hr, 1hr:7
        const q = userId !== 'undefined' ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createDate DESC` : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createDate DESC`;
    
        const values = userId !== 'undefined' ? [userId] : [userInfo.id, userInfo.id];
        db.query(q, values, (err, data) =>{  // userInfo is auth.js's jwt token id;
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

// same technique to delete or update other posts,comments

const deletePost = (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";
    
        db.query(q, [req.params.id, userInfo.id], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){ return res.status(500).send(err)};
            if(data.affectedRows > 0){return res.status(200).send('Post has been deleted!')};
            return res.status(403).send("You can't delete this post!")
        })
    })

}

module.exports = {getPosts, addPost, deletePost};