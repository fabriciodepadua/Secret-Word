//CSS
import './App.css';
// React
import { useCallback, useEffect, useState  } from "react";
// Data
import { wordsList } from "./data/word";
//Components
import StartScreen from './Components/StartScreen';
import Game from './Components/Game';
import GameOver from './Components/GameOver';

const stages = [
  {id:1, name: "start"},
  {id:2, name: "game"},
  {id:3, name: "end"}
];
  const guessesQty = 4

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const[score, setScore] = useState(0);

  const pickdWordAndCategory = useCallback( () => {
    // pick and category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    console.log(category);

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    console.log(word)

    return {word, category}
  }, [words])


  //Starts Secret Word Game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates();
    // pick word and pick category
    const {word, category} = pickdWordAndCategory();

    //create an array of letter
    let wordLetters = word.split("");
    
    wordLetters = wordLetters.map((l) => l.toLowerCase())
    
    console.log(word, category)
    console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  },[pickdWordAndCategory]);

  //process the letter input
  const verifyletter = (letter) => {

    const normalizedLetter = letter.toLowerCase()


    //check if letter has already been utilized
    if ( 
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
     ) {
      return;
     }

     // push guessed letter or remove a guesses
     if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
     }  else {
      setWrongLetters((actualWrongLetters) =>  [
      ...actualWrongLetters, normalizedLetter
     ])
     setGuesses((actualGuesses) => actualGuesses - 1)
  }
};
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  } 
  // check if guesses ended
useEffect(() => {
  if(guesses <=0) {

    //reset all states
    clearLetterStates();
    setGameStage(stages[2].name)

  }
  }, [guesses]);

  // check win condition 
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if(guessedLetters.length === uniqueLetters.length){
      //add score
      setScore((actualScore) => actualScore += 100)
      //restart game with new word
      startGame();
    }
    console.log(uniqueLetters)

  }, [guessedLetters, letters, startGame])
  //restart the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }


  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame= {startGame} />}
      {gameStage === 'game' && <Game
       verifyletter = {verifyletter} 
       pickedWord={pickedWord}
       pickedCategory={pickedCategory}
       letters={letters}
       guessedLetters={guessedLetters}
       wrongLetters={wrongLetters}
       guesses={guesses}
       score={score}
       />}
      {gameStage === 'end' && <GameOver retry= {retry} score={score}/>}

     
    </div>
  );
}

export default App;
