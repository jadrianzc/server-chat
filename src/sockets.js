const Chat = require('./models/Chat');

module.exports = io => {

    let users = {};

    // Inicia la conexión con socket
    io.on('connection', async socket => {

        let messages = await Chat.find({}).limit(8).sort('-created');

        socket.emit('load old msgs', messages);

        // Recibe el usuario
        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                updateNicknames();
            }
        });

        // Recibir un mensaje
        socket.on('send message', async(data, cb) => {
            let msg = data.trim();

            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);
                let index = msg.indexOf(' ');
                if (index !== -1) {
                    let name = msg.substring(0, index);
                    let msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error! Ingresa un usuario válido');
                    }
                } else {
                    cb('Error! Ingresa un mensaje');
                }
            } else {
                let newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save();

                io.sockets.emit('new message', {
                    msg,
                    nick: socket.nickname
                });
            }
        });

        // Verifica un usuario desconectado
        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        });

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });

}