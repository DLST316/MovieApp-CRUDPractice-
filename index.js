const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const {v4: uuid} = require('uuid');
uuid();

app.use(express.urlencoded({extended:  true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');

let movies = [
    {
        id: uuid(),
        title: 'Inception',
        director: "Christopher Nolan",
        year: 2010,
        description: 'A mind-bending thriller',
        review: [
            {
                id: uuid(),
                author: 'Alice',
                content: 'Amazing movie!',
                createdAt: new Date()
            }
        ]
    },
    {
        id: uuid(),
        title: 'Interstellar',
        director: "Christopher Nolan",
        year: 2014,
        description: 'A journey through space and time',
        review: [
            {
                id: uuid(),
                author: 'Bob',
                content: 'Love the visuals',
                createdAt: new Date()
            }
        ]
    }
]
//Movie List
app.get('/movies', (req, res) => {
    res.render('index',{movies});
})
//New Movie Add
app.get('/movies/new', (req, res) => {
    res.render('new')
})
//Process Adding
app.post('/movies',(req, res) => {
    const { title, director, year, description } = req.body;
    movies.push({ id: uuid(), title, director, year: Number(year), description, review: [] });
    res.redirect('/movies');
})
//Show detail
app.get('/movies/:id',(req, res) => {
    const {id} = req.params;
    const movie = movies.find(m => m.id === id);
    res.render('show', { movie });
})
//Edit
app.get('/movies/:id/edit',(req, res) => {
    const {id} = req.params;
    const movie = movies.find(m => m.id === id);
    try {
        res.render('edit', { movie });
    } catch (error) {
        res.send("오류!")
        console.log(error);
    }
})
//Process Edit
app.patch('/movies/:id', (req, res) => {
    const {id} = req.params;
    const { title, director, year, description } = req.body;
    const movie = movies.find(m => m.id === id);
    movie.title = title;
    movie.director = director;
    movie.year = Number(year);
    movie.description = description;
    res.redirect(`/movies/${id}`);
})
//Delete
app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    movies = movies.filter(m => m.id !== id);
    res.redirect('/movies');
});
// 리뷰 추가 처리
app.post('/movies/:id/reviews', (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    const movie = movies.find(m => m.id === id);
    if (movie) {
        movie.review.push({ id: uuid(), author, content, createdAt: new Date() });
        res.redirect(`/movies/${id}`);
    } else {
        res.status(404).send('Movie not found');
    }
});

// 리뷰 삭제 처리
app.delete('/movies/:movieId/reviews/:reviewId', (req, res) => {
    const { movieId, reviewId } = req.params;
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
        movie.review = movie.review.filter(r => r.id !== reviewId);
        res.redirect(`/movies/${movieId}`);
    } else {
        res.status(404).send('Movie not found');
    }
});

app.get('*',(req,res) => {
    res.render('focus')
})
app.listen(3000,() => {
    console.log("ON PORT 3000!");
})

