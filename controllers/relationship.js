const db = require("../routes/connect.js");
const jwt = require('jsonwebtoken');

const getRelationships = (req, res) =>{
    const q = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;  // jei page e jacchi tate check korchi currentUser/ami achi kina;

    db.query(q, [req.query.followedUserId], (err, data) =>{
        if(err){res.status(500).send(err)};
        res.send(data.map(relationship=> relationship.followerUserId));  // VID: 2.01.40hr
    })
}

const addRelationships = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";  // we are the follower;

        const values = [
            userInfo.id,
            req.body.userId
        ]
    
        db.query(q, [values], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)};
            res.status(200).send('Following!');
        })
    })
}

const deleteRelationships = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
    
        db.query(q, [userInfo.id, req.query.userId], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)};
            res.status(200).send('Unfollow!');
        })
    })
}

module.exports = { getRelationships, addRelationships, deleteRelationships};