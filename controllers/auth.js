const db = require("../routes/connect.js");

const register = () =>{
    // CHECK USER IF EXIST
    const q = 'SELECT * FROM  users WHERE username = ?';

    db.query(q, [req.body.username], (err, data)=>{
        if(err){res.status(500).send(err)};
        if(data.length){res.status(409).send('user alrady exists!')}
    })

    // CREATE A NEW USER
      // HASH THE PASSWORD  == npm i bcryptjs;
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

}
const login = () =>{
    //TODO
}
const logout = (req, res) =>{
    //TODO
    res.send('logout')
}

module.exports = { register, login, logout };