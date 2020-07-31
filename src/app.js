const path = require('path')
const express = require('express')
const app = express()
const ejs = require('ejs')
const _ = require('lodash')
const mongoose = require('mongoose')
const port = 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publicDirectoryPath))

//database coonnect
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const postsSchema = {
  title: String,
  post: String
}

const Post = mongoose.model('Post', postsSchema)

const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if(err){
      console.log(err)
    }
    res.render('home', {
      content: posts
    })
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    content: aboutContent
  })
})

app.get('/contact', (req, res) => {
  res.render('contact', {
    content: contactContent
  })
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.post('/publish', (req, res) => {
  const post = new Post( {
    title: req.body.title,
    post: req.body.post
  })
  post.save(()=>{
    res.redirect('/')
  })
  
})

app.get('/posts/:post', (req, res) => {
  Post.findById({_id:req.params.post},(err,post)=>{
    res.render('post', {
      title: post.title,
      post: post.post
    })
  })

})

app.listen(port, () => {
  console.log(`App is running on port:${port}`)
})
