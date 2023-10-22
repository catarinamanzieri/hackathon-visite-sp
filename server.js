const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

const mensagens = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('mensagensAnteriores', mensagens);

    socket.on('enviarMensagem', dados => {
        mensagens.push(dados);
        socket.broadcast.emit('mensagemRecebida', dados);
    });
});

server.listen(PORT, () => {
    console.log(`Running in http://localhost:${PORT}`);
})