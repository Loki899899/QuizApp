const socket = io(),
    question = document.getElementById('question'),
    option1 = document.getElementById('btn1'),
    option2 = document.getElementById('btn2'),
    option3 = document.getElementById('btn3'),
    option4 = document.getElementById('btn4'),
    progress = document.getElementById('progress'),
    quiz = document.getElementById('quiz'),
    container = document.getElementById('container')
    // userEmail = document.getElementById('user-email')

let questionsAndOptions, 
    currentQuestion = 1, 
    isLevelChoice = true, 
    quizComplete = false

option1.addEventListener('click', () => {
    console.log(option1.innerHTML)
    if(isLevelChoice) {
        socket.emit(option1.innerHTML)
        isLevelChoice = false
    } else {
        socket.emit('choice', option1.innerHTML, currentQuestion)
        currentQuestion += 1
        nextQuestion()
    }    
})

option2.addEventListener('click', () => {
    console.log(option2.innerHTML)
    if(isLevelChoice) {
        socket.emit(option2.innerHTML)
        isLevelChoice = false
    } else {
        socket.emit('choice', option2.innerHTML, currentQuestion)
        currentQuestion += 1
        nextQuestion()
    }  
})

option3.addEventListener('click', () => {
    console.log(option3.innerHTML)
    if(isLevelChoice) {
        socket.emit(option3.innerHTML)
        isLevelChoice = false
    } else {
        socket.emit('choice', option3.innerHTML, currentQuestion)
        currentQuestion += 1
        nextQuestion()
    }  
})

option4.addEventListener('click', () => {
    console.log(option4.innerHTML)
    socket.emit('choice', option4.innerHTML, currentQuestion)
    currentQuestion += 1
    nextQuestion()
})

socket.on('Easy', (questions) => {
    questionsAndOptions = questions
    console.log(questionsAndOptions)
    showQuestions()
})

socket.on('Medium', (questions) => {
    questionsAndOptions = questions
    console.log(questionsAndOptions)
    showQuestions()
})

socket.on('Hard', (questions) => {
    questionsAndOptions = questions
    console.log(questionsAndOptions)
    showQuestions()
})

socket.on('choice', choice => {
    console.log('answered '+choice)
})

socket.on('score', (score) => {
    console.log('get score')
    quiz.setAttribute('class', 'disp-none')
    scoreMessage = document.createElement('h1')
    scoreMessage.innerHTML = 'Your score is ' + score 
    container.appendChild(scoreMessage)
})

function nextQuestion() {
    //if(questionsAndOptions['question'+(currentQuestion+1)]) {}
    if(questionsAndOptions['question'+currentQuestion] === undefined) {
        socket.emit('ask_score')
    } else {
        console.log(questionsAndOptions['question'+currentQuestion])
        question.innerHTML = questionsAndOptions['question'+currentQuestion]
        option1.innerHTML = questionsAndOptions['choiceq'+currentQuestion].choice1
        option2.innerHTML = questionsAndOptions['choiceq'+currentQuestion].choice2
        option3.innerHTML = questionsAndOptions['choiceq'+currentQuestion].choice3
        option4.innerHTML = questionsAndOptions['choiceq'+currentQuestion].choice4
    }
    //console.log(currentQuestion)
}

function showProgress() {
}

function showQuestions() {
    nextQuestion()
    showProgress()
    option4.classList.remove('disp-none')
    progress.classList.remove('disp-none')
}

function chooseLevel() {
    question.innerHTML = 'Choose level of questions'
    option1.innerHTML = 'Easy'
    option2.innerHTML = 'Medium'
    option3.innerHTML = 'Hard'
}

function sendEmail() {
    socket.emit('user_email', userEmail.value)
}

function start() {
    //get user email and send it to server
    chooseLevel()
}

start()