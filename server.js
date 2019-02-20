const http = require('http');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3003;
const CONSTANTS = require('./globals').constants;

mongoose.set('useCreateIndex', true);
mongoose.connect(CONSTANTS['mongoDBURL'], { useNewUrlParser: true });
const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('err', () => {
    console.log("Error connecting database");
});

db.once('open', () => {
    setTimeout(() => {
        //Running server
        // console.log("done");
        
        const app = require('./app');
        app.set('port', PORT);
        server = http.createServer(app);
        server.listen(app.get('port'), () => console.log("App is listening on port " + app.get('port')));
    }, 1000);
})