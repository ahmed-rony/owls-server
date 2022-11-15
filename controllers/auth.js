const db = require("../routes/connect.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) =>{
    // CHECK USER IF EXIST
    const q = 'SELECT * FROM  users WHERE username = ?';

    db.query(q, [req.body.username], (err, data)=>{
        if(err){res.status(500).send(err)};
        if(data.length){res.status(409).send('user alrady exists!')}
        else{
            // CREATE A NEW USER
              // HASH THE PASSWORD  == npm i bcryptjs;
              const salt = bcrypt.genSaltSync(10);
              const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
              const q = 'INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)';
              const values = [
                req.body.username,
                req.body.email,
                hashedPassword,
                req.body.name
              ];
              db.query(q, [values], (err, data)=>{
                  if(err){res.status(500).send(err)};
                  res.status(200).send('User has been created!');
              })

        }
        
    })
}

// ========================================
const login = (req, res) =>{
    const q = 'SELECT * FROM users WHERE username = ?';
     db.query(q, [req.body.username], (err, data) =>{
        if(err){res.status(500).send(err)};
        if(data.length === 0){res.status(404).send('User not found!')};

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if(!checkPassword){res.status(400).send('Wrong password or username!')};

        const token = jwt.sign({id: data[0].id}, "secretkey");

        const { password, ...others } = data[0];  // it'll send everything exclude password; ***

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).send(others);
     })
}

// ========================================
const logout = (req, res) =>{
    res.clearCookie('accessToken', {
        secure: true,
        sameSite: "none"  // as our client and server url is different to clear the cookie, so sameSite is 'none' to clear it;
    }).status(200).send('User logged out!');
}

module.exports = { register, login, logout };