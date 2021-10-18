const myQuestions = [
  {
    title: 'Как можно вывести сообщение "Hello World!" с помощью JavaScript?',
    options: [
      'msgBox("Hello World");',
      'alertBox("Hello World");',
      'alert("Hello World");',
      'msg("Hello World");',
    ],
    rightAnswer: 2
  },
  {
    title: 'JavaScript и Java это одно и тоже.',
    options: [
      'Да',
      'Нет',
      'JavaScript - это надстройка над Java',
    ],
    rightAnswer: 1
  },
  {
    title: 'Как объявить функцию в JavaScript?',
    options: [
      'function MyFunction()',
      'function = New MyFunction()',
      'function:MyFunction()',
      'function = MyFunction()',
    ],
    rightAnswer: 0
  },
  {
    title: 'Как найти наибольшее из двух чисел?',
    options: [
      'Math.ceil(x, y)',
      'Math.max(x, y)',
      'top(x, y)',
      'ceil(x, y)',
    ],
    rightAnswer: 1
  },
]



function Quiz(questions) {
  this.score = 0
  this.questions = questions
  this.currentQuestionIdx = null
  this.currentQuestionNumber = 1
  this.currentQuestion = null
  this.totalQuestions = this.questions.length
  this.isOptionChose = false
  this.isCorrect = false
  this.answered = []

  this.questionTitleField = document.getElementById('question')
  this.optionsField = document.getElementById('options')
  this.questionsTotalField = document.getElementById('number-of-all-questions')
  this.currentQuestionField = document.getElementById('number-of-question')
  this.btnNext = document.getElementById('btn-next')
}

Quiz.prototype.start = function() {
  this.getRandomQuestion()
  this.generateContent()
  this.makeChoice()
  this.enableRestart()
}

Quiz.prototype.getRandomQuestion = function() {
  this.currentQuestionIdx = Math.floor( Math.random() * this.questions.length )
  this.currentQuestion = this.questions[this.currentQuestionIdx]
}

Quiz.prototype.generateContent = function() {
  this.questionsTotalField.innerText = this.totalQuestions
  this.currentQuestionField.innerText = this.currentQuestionNumber
  this.questionTitleField.innerText = this.currentQuestion.title

  for (let i = 0; i < this.currentQuestion.options.length; i++ ) {
    this.optionsField.insertAdjacentHTML('beforeend', `<p data-id='${i}' class='option'>${this.currentQuestion.options[i]}</p>`)
  }
}

Quiz.prototype.makeChoice = function() {
  Array.from(this.optionsField.children).forEach(option => {

    option.addEventListener('click', (e) => {
      e.target.classList.add('clicked')
      Array.from(this.optionsField.children).forEach(function(option) {
        option.classList.add('disabled')
      })

      if (e.target.dataset.id == this.currentQuestion.rightAnswer) {
        this.isCorrect = true
        this.score++
      } else {
        this.isCorrect = false
      }
      this.answered.push(this.isCorrect)
      this.currentQuestionNumber++
      this.enableMoveToNextQuestion()
    })
  })
}

Quiz.prototype.enableMoveToNextQuestion = function() {
  this.btnNext.onclick = () => {
    Array.from(this.optionsField.children).forEach(option => {
      if (option.classList.contains('clicked')) {
        this.isOptionChose = true
      }
    })

    if ( this.isOptionChose ) {
      this.questions.splice(this.currentQuestionIdx, 1) // delete asked question from array this.questions
      
      if ( this.questions.length ) {
        this.optionsField.replaceChildren() // delete childred p nodes containing options
        this.getRandomQuestion() // pick one question object from array
        this.generateContent() // depict current progress and content of question on page
        this.indicateCorrectAnswers()
        this.isOptionChose = false
        this.makeChoice()
      } else {
        this.indicateCorrectAnswers()
        this.finishQuiz()
      }
    }
  }
}

Quiz.prototype.indicateCorrectAnswers = function() {
  if ( this.answered[this.answered.length - 1] ) {
    document.getElementById('answers-tracker').insertAdjacentHTML('beforeend', `<div class='correct'></div>`)
  } else {
    document.getElementById('answers-tracker').insertAdjacentHTML('beforeend', `<div class='wrong'></div>`)
  }
}

Quiz.prototype.finishQuiz = function() {

  if ( this.score / this.totalQuestions < 0.5 ) {
    document.querySelector('.content-title').innerText = 'Вы правильно ответили на менее половины от количества вопросов, не расстраивайтесь!'
  } else if ( this.score / this.totalQuestions < 0.7) {
    document.querySelector('.content-title').innerText = 'Неплохой результат!'
  } else if ( this.score / this.totalQuestions < 0.86 ) {
    document.querySelector('.content-title').innerText = 'Хороший результат!'
  } else if ( this.score / this.totalQuestions > 0.86 ) {
    document.querySelector('.content-title').innerText = 'Отличный результат!'
  } 

  document.getElementById('correct-answer').innerText = this.score
  document.getElementById('number-of-all-questions-2').innerText = this.totalQuestions
  document.querySelector('.quiz-over-modal').classList.add('active')
}

Quiz.prototype.enableRestart = function() {
  document.getElementById('btn-try-again').addEventListener('click', function() {
    window.location.reload()
  })
}

const quiz = new Quiz(myQuestions)
quiz.start()