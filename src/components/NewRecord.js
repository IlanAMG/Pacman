import React, { useState } from 'react';
import { write, remove } from '../firebase/firebase';

export const NewRecord = React.memo( ({setModalVisible, lastScore, highscore, setLastScore}) => {
    const [pseudo, setPseudo] = useState('')
    const newHighscore = {
        highscore: lastScore.toString(),
        pseudo: pseudo
    }

    const handleSubmit = async (e) => {
        let copyHighscore = highscore
        e.preventDefault()
        copyHighscore = copyHighscore.toString()
        await remove(copyHighscore)
        await write(newHighscore)
        setPseudo('')
        setLastScore(0)
        setModalVisible(false)
    }

    const handleChange = (e) => {
        setPseudo(e.target.value)
    }

    const handleNo = () => {
        setLastScore(0)
        setModalVisible(false)
    }

    return (
      <div className='container-modal'>
        <div className='container-titre-modal'>
            <span>CONGRATULATIONS !</span>
            <span>New High Score : </span>
            <span>{lastScore}</span>
        </div>
        <form onSubmit={handleSubmit}>
            <div className='container-input'>
                <label>Votre Pseudo :</label>
                <input onChange={handleChange} value={pseudo} minlength="3" maxlength="10" type="text" required/>
            </div>
            <div className='container-bouton'>
                <button type='button' onClick={handleNo}>NO</button>
                <button type='submit'>OK</button>
            </div>
        </form>
      </div>
    );
})
