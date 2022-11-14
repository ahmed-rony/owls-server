const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users.js')
const postRoutes = require('./routes/posts.js')
const commentRoutes = require('./routes/comments.js')
const likeRoutes = require('./routes/likes.js')
const authRoutes = require('./routes/auths.js')

// =================================
const port = 30000;
const app = express();

// =========  middlware  ===========
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// =================================
app.use('/api/auths', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// =================================


app.get('/', (req, res)=>{
    res.send('hello harry!')
});

// =================================
app.listen(port, ()=>{
    console.log('running');
})