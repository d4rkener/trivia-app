import '../scss/styles.scss';
import axios from 'axios';

// Variables
const startForm = document.getElementById('startForm');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const error = document.getElementById('error');
const errorText = document.getElementById('errorText');
const main = document.getElementById('main');
const loadingScreen = document.getElementById('loadingScreen');
const startingTime = document.getElementById('startingTime');
let counter = 3;

// Functions
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
