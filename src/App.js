import { useEffect, useState } from 'react';
import './App.scss';
import SingleCard from './components/SingleCard';
// import axios from 'axios';

const cardImages = [
  { "src": "/img/image1.png", matched: false },
  { "src": "/img/image2.png", matched: false },
  { "src": "/img/image3.png", matched: false },
  { "src": "/img/image4.png", matched: false },
  { "src": "/img/image5.png", matched: false },
  { "src": "/img/image6.png", matched: false }
]

const players = [
  { id: 1, name: "Player One", playing: true, points: 0 },
  { id: 2, name: "Player Two", playing: false, points: 0 },
]

function App() {
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  // shuffle cards / reset player points
  const shuffleCards = () => {
    players.map(player => {
      if (player.points > 0) {
        player.points = 0
      }
    })

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
  }

  // handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // change player turn
  const changePlayerTurn = () => {
    players.map(player => {
      if (player.playing === true) {
        player.playing = false
      } else {
        player.playing = true
      }
    })
  }

  // set player points (called if cards match)
  const setPlayerPoints = () => {
    players.map(player => {
      if (player.playing === true) {
        player.points++
      }
    })
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              setPlayerPoints()
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => {
          resetTurn()
          changePlayerTurn()
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo])

  // reset choices
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setDisabled(false)

  }

  // start a new game autoatically | fetch photos
  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <div className="app-header">
        <h1>Memory Game</h1>
        <button className="new-game-btn" onClick={ shuffleCards }>New Game</button>
      </div>

      <div className="players-block">
        {players.map(player => (
          <p className={ player.playing ? 'playing' : '' } key={ player.id }>{ player.name }: { player.points + ' points' } { player.playing ? '(Playing)' : '' }</p>
        ))}
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={ card.id }
            card={ card }
            handleChoice={ handleChoice }
            flipped={ card === choiceOne || card === choiceTwo || card.matched }
            disabled={ disabled }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
