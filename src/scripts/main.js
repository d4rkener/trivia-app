import '../scss/styles.scss';
import axios from 'axios';

// Variables
const startScreen = document.getElementById('startMenu');
const startForm = document.getElementById('startForm');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const error = document.getElementById('error');
const errorText = document.getElementById('errorText');
const main = document.getElementById('main');
const loadingScreen = document.getElementById('loadingScreen');
const startingTime = document.getElementById('startingTime');
const quizScreen = document.getElementById('quiz');
let counter = 3;
let questionIndex = 0;
let result = 0;

// Functions
const checkingAnswers = (allOptions, correctAnswer, data) => {
  allOptions.forEach((option) => {
    option.addEventListener('click', () => {
      // eslint-disable-next-line camelcase
      if (option.lastChild.textContent === correctAnswer) {
        result += 1;
        questionIndex += 1;
        // eslint-disable-next-line no-use-before-define
        displayingQuestions(data);
      } else {
        questionIndex += 1;
        // eslint-disable-next-line no-use-before-define
        displayingQuestions(data);
      }
    });
  });
};

const displayingQuestions = (data) => {
  if (questionIndex > 9) {
    console.log('Your result is: ', result);
  } else {
    // eslint-disable-next-line camelcase
    const { question, correct_answer, incorrect_answers } = data[questionIndex];

    let buttonsHtml = '';
    let optionNumber = 0;

    // Pushing answers in random order
    const randomIndex = Math.floor(Math.random() * 3 + 1);
    incorrect_answers.splice(randomIndex, 0, correct_answer);

    incorrect_answers.forEach((answer) => {
      buttonsHtml += `
    <button id="options">${(optionNumber += 1)}. <span>${answer}</span></button>
    `;
    });

    const html = `
        <h2 class="quiz__question" id="question">${question}</h2>
        <div class="quiz__options">
          ${buttonsHtml}
        </div>
  `;

    quizScreen.innerHTML = html;

    const allOptions = document.querySelectorAll('#options');

    checkingAnswers(allOptions, correct_answer, data);
  }
};

const showQuizScreen = (data) => {
  loadingScreen.classList.add('hide');
  main.classList.remove('hide');
  startScreen.classList.add('hide');
  quizScreen.classList.remove('hide');

  displayingQuestions(data);
};

const startGame = async (e) => {
  try {
    e.preventDefault();

    // Getting data from api
    const res = await axios.get(
      `https://opentdb.com/api.php?amount=10&type=multiple&category=${category.value}&difficulty=${difficulty.value}`,
    );

    const data = res.data.results;

    if (!data) {
      throw new Error('Sorry, Something Went Wrong');
    } else {
      main.classList.add('hide');
      loadingScreen.classList.remove('hide');

      // Starting Game Countdown
      const timer = setInterval(() => {
        startingTime.textContent = counter;
        counter -= 1;

        if (counter < 0) {
          counter = 3;
          clearInterval(timer);

          showQuizScreen(data);
        }
      }, 1000);
    }
  } catch (err) {
    error.classList.remove('hide');
    errorText.textContent = err.message;
  }
};

// Event Listeners
startForm.addEventListener('submit', startGame);
