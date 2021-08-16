const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Apiroutes = require('./routes')
const { generateFakeData2 } = require('../faker2');
// const { generateFakeData } = require("../faker");

const MONGO_URL = 'mongodb://127.0.0.1:27017/'
const MONGODB_NAME = 'test'

// body 파서
app.use(express.json())

// 몽고 DB 연결

mongoose.connect(`${MONGO_URL}${MONGODB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    "auth": { "authSource": "admin" },
    user: "admin",
    pass: "chao0116"
})
    .then(() => {
        console.log('DB 연결 성공')
        // generateFakeData(10,30,100)
    })
    .catch((err) => console.log('DB 연결 실패', err))
// 몽고 연결 하나하나 확인 가능한 디버그 모드
// mongoose.set("debug", true);
app.use('/api', Apiroutes);


app.listen(3000, async () => {
    console.log('server listening on port 3000');
    // 유저 수 , 각 유저가 가지는 블로그 개수, 각자 후기 남긴 개수
    // generateFakeData2(3, 10, 10)
})