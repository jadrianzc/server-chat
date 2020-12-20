$(function() {

    // Conexión con el cliente socket.io
    const socket = io.connect();

    // Obteniendo los elementos del DOM desde la interfaz
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // Obteniendo los elementos del DOM desde el nickname form
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    // Obteniedno los usuarios del DOM
    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
                $('#message').focus();
            } else {
                $nickError.html(`
            <div class="alert alert-danger">
              El usuario ya existe
            </div>
          `);
            }
        });
        $nickname.val('');
    });

    // Eventos 
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('');
    });

    socket.on('new message', data => {
        displayMsg(data);
    });

    socket.on('usernames', data => {
        let html = '';
        for (i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
    });

    socket.on('load old msgs', msgs => {
        for (let i = msgs.length - 1; i >= 0; i--) {
            displayMsg(msgs[i]);
        }
    });

    function displayMsg(data) {
        $chat.append(`<p class="msg"><b>${data.nick}</b>: ${data.msg}</p>`);
    }

});