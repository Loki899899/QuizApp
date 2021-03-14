const express = require('express'),
    app = express(),
    port = 3000,
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    fs = require('fs'),
    questionsEasy = fs.readFileSync('questions/questionsEasy.json'),
    questionsMedium = fs.readFileSync('questions/questionsMedium.json'),
    questionsHard = fs.readFileSync('questions/questionsHard.json'),
    answersEasy = JSON.parse(fs.readFileSync('answers/answersEasy.json')),
    answersMedium = JSON.parse(fs.readFileSync('answers/answersMedium.json')),
    answersHard = JSON.parse(fs.readFileSync('answers/answersHard.json'))
//console.log(JSON.parse(data))
let data,
    scoreAndLevel = {}
app.use(express.static(__dirname + '/public'))

io.on('connection', function(socket) {
    //console.log(socket.handshake.address)
    console.log('A user connected');
    socket.on('Easy', () => {
        console.log('sendiing easy questions')
        socket.emit('Easy', JSON.parse(questionsEasy))
        scoreAndLevel[socket.handshake.address] = {}
        scoreAndLevel[socket.handshake.address].level = 'easy'
        scoreAndLevel[socket.handshake.address].score = 0
        scoreAndLevel[socket.handshake.address].choices = {}
        console.log(scoreAndLevel)
        //console.log(new Date().getTime())
    })

    socket.on('Medium', () => {
        console.log('sendiing medium questions')
        socket.emit('Medium', JSON.parse(questionsMedium))
        scoreAndLevel[socket.handshake.address] = {}
        scoreAndLevel[socket.handshake.address].level = 'medium'
        scoreAndLevel[socket.handshake.address].score = 0
        scoreAndLevel[socket.handshake.address].choices = {}
        console.log(scoreAndLevel)
    })

    socket.on('Hard', () => {
        console.log('sendiing hard questions')
        socket.emit('Hard', JSON.parse(questionsHard))
        scoreAndLevel[socket.handshake.address] = {}
        scoreAndLevel[socket.handshake.address].level = 'hard'
        scoreAndLevel[socket.handshake.address].score = 0
        scoreAndLevel[socket.handshake.address].choices = {}        
        console.log(scoreAndLevel)
    })

    socket.on('choice', (choice, question) => {
        socket.emit('choice', choice)
        scoreAndLevel[socket.handshake.address].choices[question] = choice
        //fs.writeFileSync('userAnswers/userName.json',JSON.stringify(data), {flag:'a'})
        if(scoreAndLevel[socket.handshake.address].level === 'easy') {
            if(choice === answersEasy[question]) {
                console.log('correct')
                scoreAndLevel[socket.handshake.address].score += 1
            }
            else {
                console.log('wrong')
            }
        }
        console.log(scoreAndLevel)
        //fs.writeFileSync(,)
    })

    socket.on('ask_score', () => {
        data = {
            user: socket.handshake.address,
            choices: scoreAndLevel[socket.handshake.address].choices
        }
        fs.writeFileSync(
            'userAnswers/userAnswers.json',
            JSON.stringify(data, null, 2), 
            {flag:'a'})
        console.log('calc score and send')
        socket.emit('score', scoreAndLevel[socket.handshake.address].score)
    })
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})