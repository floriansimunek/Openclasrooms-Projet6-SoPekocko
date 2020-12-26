const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      id: 'oeihfzeoi',
      userId: 'qsomihvqios',
      name: 'test',
      manufacturer: 'ssss',
      description: 'Ceci est une sauce',
      mainPepper: 'Piquante',
      imageUrl: 'https://pixabay.com/fr/photos/poivrons-l%C3%A9gumes-alimentaire-421087/',
      heat: 2,
      likes: 12,
      dislikes: 4,
      usersLiked: 'testUser',
      usersDisliked: 'testUser2'
    }
  ];
  res.status(200).json(sauces);
});

module.exports = app;