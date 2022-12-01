const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/users.js')
const postRoutes = require('./routes/posts.js')
const commentRoutes = require('./routes/comments.js')
const likeRoutes = require('./routes/likes.js')
const authRoutes = require('./routes/auths.js');
const relationshipRoutes = require('./routes/relationships.js');
const multer = require('multer');

// =================================
const port = 30000;
const app = express();

// =========  middlware  ===========
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
})
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(bodyParser.json());
app.use(cookieParser());

// =============  upload file on multer  ====================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).send(file.filename);
})

// ==========================================================
app.use('/api/auths', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/relationships', relationshipRoutes);

// =================================


app.get('/', (req, res) => {
  res.send('hello harry!')
});

// =================================
app.listen(process.env.PORT || port, () => {
  console.log('running..');
})