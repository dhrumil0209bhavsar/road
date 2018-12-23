const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3003;

app.set('port', PORT);
server = http.createServer(app);
server.listen(app.get('port'), () => console.log("App is listening on port " + app.get('port')));
