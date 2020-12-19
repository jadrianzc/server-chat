const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jazc99:jazc99@cluster0.s4wdk.mongodb.net/chat?retryWrites=true&w=majority', {
        useNewUrlParser: true
    })
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));