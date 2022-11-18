const db = require("../routes/connect.js");
const jwt = require('jsonwebtoken');
const moment = require('moment');

const getComments = (req, res) =>{
    
    const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createDate DESC`;
    // const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) ORDER BY c.createDate DESC`;

    db.query(q, [req.query.postId], (err, data) =>{
        if(err){res.status(500).send(err)};
        res.send(data);
    })
}

const addComment = (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "INSERT INTO comments (`desc`, `createDate`, `userId`, `postId`) VALUES (?)";

        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ];
    
        db.query(q, [values], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)};
            res.status(200).send('Comment has been created!');
        })
    })
}

module.exports= {getComments, addComment};