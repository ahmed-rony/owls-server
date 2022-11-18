const db = require("../routes/connect.js");
const jwt = require('jsonwebtoken');

const getUser = (req, res) =>{
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data)=>{
        if (err){res.status(500).send(err)};
        const {password, ...info} = data[0];
        res.status(200).send(info);
    })
}

const updateUser = (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token){res.status(401).send("Not logged in!")}
    
    jwt.verify(token, 'secretkey', (err, userInfo)=>{
        if(err){res.status(403).send("Token is not valid!")}  // we have a token but it's not valid;
        
        const q = "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `profilePic` = ?, `coverPic` = ? WHERE id = ?";

        // const values = [
        //     req.body.name,
        //     req.body.city,
        //     req.body.website,
        //     req.body.profilePic,
        //     req.body.coverPic,
        //     userInfo.id
        // ]
    
        db.query(q, [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id], (err, data) =>{  // userInfo is auth.js's jwt token id;
            if(err){res.status(500).send(err)}
            if(data.affectedRows > 0){res.send('User info updates!')}
            res.status(403).send('You can update only your account.');
        })
    })
}

module.exports= {getUser, updateUser};