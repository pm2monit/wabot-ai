import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
import express, { json } from 'express';
const app = express();
const io = require('socket.io')(3000);
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const cors = require('cors');
let sessionData = 'client-1';

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: sessionData
    })
});

// const client = new Client();
const api = new ChatGPTUnofficialProxyAPI ( {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ3aGF0c3RhY3Rva0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1ZRk5tb1pSV3Q3Mkx4RmZoTkpQSnBGbDAifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0NDAxMTk2ODcyNDkwNjAzNzgwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NDk4ODE3NywiZXhwIjoxNjg2MTk3Nzc3LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9yZ2FuaXphdGlvbi53cml0ZSJ9.nnUzlThOdgoijTLCntH5ptJTZ8ZVUl4QKRnBVUH3g_pZhly6DxgIxbfaTqniaVtlRHZPSyS4E1WFK5e9zQvXF0rJ-WkJ4-_soOn-4dpenk9whkc5NjCWszsng4pNaNJbUPJfrnpi79T4jthisvtE0mSjRfpchRoHOJGpz4y-hhWBJZXvS6C9L6gLo3xqqpJteBo38EytGahl4xyFF6XZq_Z8-c0cd5HPoQRxhnBVKa0vOobBbP4xMBevcvzMeEHB5YSHIzzP9HNdPaX8NcCqfoV6TopUujJRq6BDB5piRJMj4E8zYq1uIks4-n_x8M7qrDoPW6EaRTf1xIC8ok8cPw",
    // "accessToken": 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ3aGF0c3RhY3Rva0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1ZRk5tb1pSV3Q3Mkx4RmZoTkpQSnBGbDAifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0NDAxMTk2ODcyNDkwNjAzNzgwIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4MzY5MTU3OSwiZXhwIjoxNjg0OTAxMTc5LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.y_iNtlfDDS0R2_TY2d-EwcxW-N55XUW1adrrSVwTxiSVVUO5YwW57OioOwUAMFu8vhSaHLTVE41N8B5SjkaEaQmp7QtVB_R0G5iW5K-je0Emmk1f2ZzDSrNyKN8mJPDx0uBsZFRRQOpDGM_BoTiTSCeA5EHClgeZqsy_yJNR_R24CZ6aRevPL1q-qxI8o27Ns3MnXTqe5MEZ-b_fVZb8e3V3gy2JokmNezJCiQMHk29ZX5lAfAiwn9WouBsHtEBKuOUNbzUkLXTloY_vKiZQ3XZY0pid5u-reUXnU_rThkGnPxLAkl0vqARslyWpkalGuHvMS_OO5UV9Uwvz4ENXbg',
    "apiReverseProxyUrl": "https://ai.fakeopen.com/api/conversation"
})

let optionCors = {
    origin: '*', 
    // methods: '*', 
    // allowedHeaders: ['Content-Type'], 
    // credentials: true, 
}



io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('qr', client.qr);
    // socket.on('message', (message) => {
    //   client.sendMessage(message);
    // });
  });


app.use(cors(optionCors));
app.use(json());
app.get('/chat', async(req,res) => {
    try {
        let message = req.query.m;
        const responseApi = await api.sendMessage(message);
        let balasanChat = responseApi.text;
        let openai = "OpenAI"; 
        let chatgpt = "ChatGPT";

        let kalimat_1 = balasanChat.replace(openai, "Webflazz.com");
        let kalimat_2 = kalimat_1.replace(chatgpt, "robot asisten pribadi")
        
        res.send(kalimat_2);
    }
    catch (error) {
        console.log(error)
        res.sendStatus(400)
        res.json(error)
    }
})


app.set('view engine', 'ejs');
// app.set('views', __dirname + '/public');
app.set('views', './public');

app.get('/', (req, res) => {
    res.render('index');
})

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    sessionData = session;
    console.log('authenticated')
    // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });

    console.log(sessionData);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async(msg) => {

    const chat = await msg.getChat();
    const contact = await msg.getContact();

    console.log('==========')
    console.log(chat);
    console.log('==========')
    console.log(contact);

    let pesan = msg.body;
    const responseApi = await api.sendMessage(pesan);
    let balasanChat = responseApi.text;
    let openai = "OpenAI"; 
    let chatgpt = "ChatGPT";
    let kalimat_1 = balasanChat.replace(openai, "Webflazz.com");
    let kalimat_2 = kalimat_1.replace(chatgpt, "robot asisten pribadi");
    console.log(kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');

    switch(msg.from) {
        case '***@c.us':
            client.sendMessage(msg.from, kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');    
        break;
        case '***@c.us':
            client.sendMessage(msg.from, kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');    
        break;
        case '***@c.us':
            client.sendMessage(msg.from, kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');    
        break;
        case '***@c.us':
            client.sendMessage(msg.from, kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');    
        break;
        case '***@c.us':
            client.sendMessage(msg.from, kalimat_2 + '\r\nAyo kunjungi website https://webflazz.com');    
        break;
        default: 
            console.log('chat');
    }

    
});



client.initialize();


app.listen(3001, () => {
    console.log('Server running on port 3000');
})
