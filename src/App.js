import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './App.css';

import { read } from './firebase/firebase';
import { Map } from './components/Map';
import { Pacman } from './components/Pacman';
import { Points } from './components/Points';
import { SuperPoints } from './components/SuperPoints';
import { GhostRed } from './components/GhostRed';
import { GhostPink } from './components/GhostPink';
import { GhostBlue } from './components/GhostBlue';
import { GhostYellow } from './components/GhostYellow';
import { Vies } from './components/Vies';
import { NewRecord } from './components/NewRecord';

const App = () => {

  // COORDONNÉES INITIALS
  const initial_pacman = {
    x: 260,
    y: 450
  }
  const initial_ghostRed = {
    x: 260,
    y: 210
  }
  const initial_ghostBlue = {
    x: 220,
    y: 270
  }
  const initial_ghostPink = {
    x: 260,
    y: 260
  }
  const initial_ghostYellow = {
    x: 300,
    y: 270
  }

  // STATE RELATIF A LA MAP
  const [posPoints, setPosPoints] = useState([])
  const [posSuperPoints, setPosSuperPoints] = useState([])
  const [posTeleport, setPosTeleport] = useState([])
  const [posIntersections, setPosIntersections] = useState([])
  const [posWalls, setPosWalls] = useState([
    { x: 0, y: 0 }
  ])

  //STATE RELATIF A LA PARTIE
  const [debut, setDebut] = useState(true)
  const [score, setScore] = useState(0)
  const [lastScore, setLastScore] = useState(0)
  const [lastWinner, setLastWinner] = useState('')
  const [highscore, setHighscore] = useState('')
  const [round, setRound] = useState(1)
  const [vies, setVies] = useState([0, 0, 0, 0, 0])
  let pointsEat = useRef(0)
  let superPointsEat = useRef(0)

  //STATE RELATIF AU PACMAN
  const [posPacman, setPosPacman] = useState(initial_pacman)
  const [delay, setDelay] = useState(null)
  const [direction, setDirection] = useState('')
  const [directionVoulu, setDirectionVoulu] = useState('')
  //SI LE PACMAN MEURE
  const [reStart, setReStart] = useState(true)

  //STATE RELATIF AUX GHOSTS
  const [mode, setMode] = useState('')
  const [delayGhost, setDelayGhost] = useState(null)

  //STATE RED GHOST => BLINKY
  const [posRed, setPosRed] = useState(initial_ghostRed)
  const [directionRed, setDirectionRed] = useState('')
  const [prevModeRed, setPrevModeRed] = useState('')
  const [modeRed, setModeRed] = useState('')
  const [afraidRed, setAfraidRed] = useState(false)
  const [retourRed, setRetourRed] = useState(false)

  //STATE PINK GHOST => PINKY
  const [posPink, setPosPink] = useState(initial_ghostPink)
  const [directionPink, setDirectionPink] = useState('')
  const [isOutPink, setIsOutPink] = useState(false)
  const [prevModePink, setPrevModePink] = useState('')
  const [modePink, setModePink] = useState('')
  const [afraidPink, setAfraidPink] = useState(false)
  const [retourPink, setRetourPink] = useState(false)

  //STATE BLUE GHOST => INKY
  const [posBlue, setPosBlue] = useState(initial_ghostBlue)
  const [directionBlue, setDirectionBlue] = useState('')
  const [isOutBlue, setIsOutBlue] = useState(false)
  const [prevModeBlue, setPrevModeBlue] = useState('')
  const [modeBlue, setModeBlue] = useState('')
  const [afraidBlue, setAfraidBlue] = useState(false)
  const [retourBlue, setRetourBlue] = useState(false)

  //STATE YELLOW GHOST => CLYDE
  const [posYellow, setPosYellow] = useState(initial_ghostYellow)
  const [directionYellow, setDirectionYellow] = useState('')
  const [isOutYellow, setIsOutYellow] = useState(false)
  const [prevModeYellow, setPrevModeYellow] = useState('')
  const [modeYellow, setModeYellow] = useState('')
  const [afraidYellow, setAfraidYellow] = useState(false)
  const [retourYellow, setRetourYellow] = useState(false)

  // TIMER
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [delayChangeMode, setDelayChangeMode] = useState(1000);

  // GESTION DU MODAL DE HIGH SCORE
  const [modalVisible, setModalVisible] = useState(false)

  // GESTION DES FONCTIONS DE COMPORTEMENTS DU PACMAN
  const movePacman = async () => {

    let copyPosPacman = { ...posPacman }
    let wallLeft = false
    let wallUp = false
    let wallRight = false
    let wallDown = false
    let teleport = false
    posWalls.map(pos => {
      if (copyPosPacman.x === pos.x && copyPosPacman.y + 10 === pos.y) {
        wallLeft = true
      } 
      if (copyPosPacman.x + 10 === pos.x && copyPosPacman.y === pos.y) {
        wallUp = true
      }
      if (copyPosPacman.x + 20 === pos.x && copyPosPacman.y + 10 === pos.y) {
        wallRight = true
      }
      if (copyPosPacman.x + 10 === pos.x && copyPosPacman.y + 20 === pos.y) {
        wallDown = true
      }
    })

    posTeleport.map(pos => {
      if (copyPosPacman.x + 10 === pos.x && copyPosPacman.y + 10 === pos.y) {
        teleport = true
      }
    })

    if (teleport === false) {
      if (directionVoulu === 'LEFT' && wallLeft === false) {
        setDirection('LEFT')
        copyPosPacman.x -= 10
        setPosPacman(copyPosPacman)
      } else if (directionVoulu === 'LEFT' && wallLeft === true) {
        if (direction === 'UP' && wallUp === false) {
          copyPosPacman.y -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'RIGHT' && wallRight === false) {
          copyPosPacman.x += 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'DOWN' && wallDown === false) {
          copyPosPacman.y += 10
          setPosPacman(copyPosPacman)
        }
      }

      if (directionVoulu === 'UP' && wallUp === false) {
        setDirection('UP')
        copyPosPacman.y -= 10
        setPosPacman(copyPosPacman)
      } else if (directionVoulu === 'UP' && wallUp === true) {
        if (direction === 'LEFT' && wallLeft === false) {
          copyPosPacman.x -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'RIGHT' && wallRight === false) {
          copyPosPacman.x += 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'DOWN' && wallDown === false) {
          copyPosPacman.y += 10
          setPosPacman(copyPosPacman)
        }
      }

      if (directionVoulu === 'RIGHT' && wallRight === false) {
        setDirection('RIGHT')
        copyPosPacman.x += 10
        setPosPacman(copyPosPacman)
      } else if (directionVoulu === 'RIGHT' && wallRight === true) {
        if (direction === 'LEFT' && wallLeft === false) {
          copyPosPacman.x -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'UP' && wallUp === false) {
          copyPosPacman.y -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'DOWN' && wallDown === false) {
          copyPosPacman.y += 10
          setPosPacman(copyPosPacman)
        }
      }


      if (directionVoulu === 'DOWN' && wallDown === false) {
        setDirection('DOWN')
        copyPosPacman.y += 10
        setPosPacman(copyPosPacman)
      } else if (directionVoulu === 'DOWN' && wallDown === true) {
        if (direction === 'LEFT' && wallLeft === false) {
          copyPosPacman.x -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'UP' && wallUp === false) {
          copyPosPacman.y -= 10
          setPosPacman(copyPosPacman)
        }
        if (direction === 'RIGHT' && wallRight === false) {
          copyPosPacman.x += 10
          setPosPacman(copyPosPacman)
        }
      }
    } else if (copyPosPacman.x < 100) {
      copyPosPacman.x = 500
      copyPosPacman.y = 270
      setPosPacman(copyPosPacman)
    } else if (copyPosPacman.x > 100) {
      copyPosPacman.x = 10
      copyPosPacman.y = 270
      setPosPacman(copyPosPacman)
    }
    if (debut === false) {
      await checkIfPoints()
      await checkIfLevelUp()
    }
  }

  const checkIfDeadOrEat = () => {
    let copyPosPacman = { ...posPacman }
    let copyPosRed = { ...posRed }
    let copyPosPink = { ...posPink }
    let copyPosBlue = { ...posBlue }
    let copyPosYellow = { ...posYellow }

    if (copyPosPacman.x === copyPosRed.x && copyPosPacman.y === copyPosRed.y) {
      if (afraidRed === false && retourRed === false) {
        pacManDead()
      } else {
        setAfraidRed(false)
        setRetourRed(true)
      }
    }
    if (copyPosPacman.x === copyPosPink.x && copyPosPacman.y === copyPosPink.y) {
      if (afraidPink === false  && retourPink === false) {
        pacManDead()
      } else {
        setAfraidPink(false)
        setRetourPink(true)
      }
    }
    if (copyPosPacman.x === copyPosBlue.x && copyPosPacman.y === copyPosBlue.y) {
      if (afraidBlue === false  && retourBlue === false) {
        pacManDead()
      } else {
        setAfraidBlue(false)
        setRetourBlue(true)
      }
    }
    if (copyPosPacman.x === copyPosYellow.x && copyPosPacman.y === copyPosYellow.y) {
      if (afraidYellow === false  && retourYellow === false) {
        pacManDead()
      } else {
        setAfraidYellow(false)
        setRetourYellow(true)
      }
    }
  }

  const pacManDead = async () => {
    if (vies.length > 0) {
      let copyPosPacman = { ...posPacman }
      copyPosPacman.x = initial_pacman.x
      copyPosPacman.y = initial_pacman.y
      let copyPosRed = { ...posRed }
      copyPosRed.x = initial_ghostRed.x
      copyPosRed.y = initial_ghostRed.y
      let copyPosBlue = { ...posBlue }
      copyPosBlue.x = initial_ghostBlue.x
      copyPosBlue.y = initial_ghostBlue.y
      let copyPosPink = { ...posPink }
      copyPosPink.x = initial_ghostPink.x
      copyPosPink.y = initial_ghostPink.y
      let copyPosYellow = { ...posYellow }
      copyPosYellow.x = initial_ghostYellow.x
      copyPosYellow.y = initial_ghostYellow.y
      let newVies = [...vies]
      newVies.pop()
      setVies(newVies)
      setPosPacman(copyPosPacman)
      await setPosRed(copyPosRed)
      await setPosBlue(copyPosBlue)
      await setPosPink(copyPosPink)
      await setPosYellow(copyPosYellow)
      await setMode('')
      await setModeRed('')
      await setModeBlue('')
      await setModePink('')
      await setModeYellow('')
      setDirection('')
      setDirectionRed('')
      setDirectionBlue('')
      setDirectionPink('')
      setDirectionYellow('')
      setDirectionVoulu('')
      setPrevModeRed('')
      setPrevModeBlue('')
      setPrevModePink('')
      setPrevModeYellow('')
      setAfraidRed(false)
      setAfraidBlue(false)
      setAfraidPink(false)
      setAfraidYellow(false)
      setRetourRed(false)
      setRetourBlue(false)
      setRetourPink(false)
      setRetourYellow(false)
      setIsOutBlue(false)
      setIsOutPink(false)
      setIsOutYellow(false)
      setDelay(null)
      setDelayGhost(null)
      setSeconds(0)
      setIsActive(false)
      setReStart(true)
    } else {
      reinitBegin()
    }
  }

  const checkIfPoints = () => {
    let copyPosPacman = { ...posPacman }
    let copyPosPoints = [...posPoints]
    let copyPosSuperPoints = [...posSuperPoints]
    if (copyPosPoints.length > 0) {
      copyPosPoints.map(posPoint => {
        if (posPoint.x === copyPosPacman.x + 10 && posPoint.y === copyPosPacman.y + 10) {
          setScore(score => score + 10)
          posPoint.x = null;
          posPoint.y = null;
          setPosPoints(copyPosPoints)
        }
      })
      copyPosSuperPoints.map(posSuperPoint => {
        if (posSuperPoint.x === copyPosPacman.x + 10 && posSuperPoint.y === copyPosPacman.y + 10) {
          setAfraidRed(true)
          setAfraidPink(true)
          setAfraidBlue(true)
          setAfraidYellow(true)
          setRetourRed(false)
          setRetourPink(false)
          setRetourBlue(false)
          setRetourYellow(false)
          setScore(score => score + 50)
          setDelayGhost(90)
          posSuperPoint.x = null;
          posSuperPoint.y = null;
          setPosSuperPoints(copyPosSuperPoints)
          setMode('AFRAID')
          setDelayChangeMode(null)
          setIsActive(false)
        }
      })
    }
  }

  const checkIfLevelUp = () => { 
    let newVies = [...vies]
    if (pointsEat.current === 240 && superPointsEat.current === 4 && debut === false) {
      if (vies.length < 5) {
        newVies.push(0)
        setVies(newVies)
      }
      reinit()
      setDebut(false)
      setReStart(true)
    }
  }

  const reinitBegin = async () => {
    let copyPosPacman = { ...posPacman }
    copyPosPacman.x = initial_pacman.x
    copyPosPacman.y = initial_pacman.y
    let copyPosRed = { ...posRed }
    copyPosRed.x = initial_ghostRed.x
    copyPosRed.y = initial_ghostRed.y
    let copyPosBlue = { ...posBlue }
    copyPosBlue.x = initial_ghostBlue.x
    copyPosBlue.y = initial_ghostBlue.y
    let copyPosPink = { ...posPink }
    copyPosPink.x = initial_ghostPink.x
    copyPosPink.y = initial_ghostPink.y
    let copyPosYellow = { ...posYellow }
    copyPosYellow.x = initial_ghostYellow.x
    copyPosYellow.y = initial_ghostYellow.y
    await setPosPacman(copyPosPacman)
    await setPosRed(copyPosRed)
    await setPosBlue(copyPosBlue)
    await setPosPink(copyPosPink)
    await setPosYellow(copyPosYellow)
    await setMode('')
    setDirection('')
    setDirectionRed('')
    setDirectionBlue('')
    setDirectionPink('')
    setDirectionYellow('')
    setDirectionVoulu('')
    setPrevModeRed('')
    setPrevModeBlue('')
    setPrevModePink('')
    setPrevModeYellow('')
    await setModeRed('')
    await setModeBlue('')
    await setModePink('')
    await setModeYellow('')
    setIsOutBlue(false)
    setIsOutPink(false)
    setIsOutYellow(false)
    setAfraidRed(false)
    setAfraidBlue(false)
    setAfraidPink(false)
    setAfraidYellow(false)
    setRetourRed(false)
    setRetourBlue(false)
    setRetourPink(false)
    setRetourYellow(false)
    setDelay(null)
    setDelayGhost(null)
    setSeconds(0)
    setIsActive(false)
    setDelayChangeMode(1000)
    setRound(1)
    setScore(0)
    setVies([0,0,0,0,0])
    await setLastScore(score)
    await setDebut(true)
  }
  
  // FONCTION DE FIN DE ROUND RÉINITIALISATION
  const reinit = async () => { 
    let copyPosPacman = { ...posPacman }
    copyPosPacman.x = initial_pacman.x
    copyPosPacman.y = initial_pacman.y
    let copyPosRed = { ...posRed }
    copyPosRed.x = initial_ghostRed.x
    copyPosRed.y = initial_ghostRed.y
    let copyPosBlue = { ...posBlue }
    copyPosBlue.x = initial_ghostBlue.x
    copyPosBlue.y = initial_ghostBlue.y
    let copyPosPink = { ...posPink }
    copyPosPink.x = initial_ghostPink.x
    copyPosPink.y = initial_ghostPink.y
    let copyPosYellow = { ...posYellow }
    copyPosYellow.x = initial_ghostYellow.x
    copyPosYellow.y = initial_ghostYellow.y
    await setPosPacman(copyPosPacman)
    await setPosRed(copyPosRed)
    await setPosBlue(copyPosBlue)
    await setPosPink(copyPosPink)
    await setPosYellow(copyPosYellow)
    await setMode('')
    setDirection('')
    setDirectionRed('')
    setDirectionBlue('')
    setDirectionPink('')
    setDirectionYellow('')
    setDirectionVoulu('')
    setPrevModeRed('')
    setPrevModeBlue('')
    setPrevModePink('')
    setPrevModeYellow('')
    setModeRed('')
    setModeBlue('')
    setModePink('')
    setModeYellow('')
    setIsOutBlue(false)
    setIsOutPink(false)
    setIsOutYellow(false)
    setAfraidRed(false)
    setAfraidBlue(false)
    setAfraidPink(false)
    setAfraidYellow(false)
    setRetourRed(false)
    setRetourBlue(false)
    setRetourPink(false)
    setRetourYellow(false)
    setDelay(null)
    setDelayGhost(null)
    setSeconds(0)
    setIsActive(false)
    setDelayChangeMode(1000)
    setRound(round => round + 1)
    await setDebut(true)
  }
  
  // GESTION FONCTION VAGUE MODE GHOSTS
  const changeMode = () => {
    if (seconds <= 7) {
      return setMode('SCATTER')
    }
    if (seconds <= 27) {
      return setMode('CHASE')
    }
    if (seconds <= 34) {
      return setMode('SCATTER')
    }
    if (seconds <= 54) {
      return setMode('CHASE')
    }
    if (seconds <= 59) {
      return setMode('SCATTER')
    }
    if (seconds <= 79) {
      return setMode('CHASE')
    }
    if (seconds <= 84) {
      return setMode('SCATTER')
    }
    if (seconds > 84) {
      return setMode('CHASE')
    }
  }

  // FONCTIONS DE COMPORTEMENTS DU GHOST RED => BLINKY
  const moveBlinky = () => {
    let copyPosRed = { ...posRed }
    let wallLeft = false
    let wallUp = false
    let wallRight = false
    let wallDown = false
    let teleport = false
    let onIntersection = false

    //On détermine où sont les murs autour de blinky
    posWalls.map(pos => {
      if (copyPosRed.x === pos.x && copyPosRed.y + 10 === pos.y) {
        wallLeft = true
      }
      if (copyPosRed.x + 10 === pos.x && copyPosRed.y === pos.y) {
        wallUp = true
      }
      if (copyPosRed.x + 20 === pos.x && copyPosRed.y + 10 === pos.y) {
        wallRight = true
      }
      if (copyPosRed.x + 10 === pos.x && copyPosRed.y + 20 === pos.y) {
        wallDown = true
      }
    })

    //On détermine si le blinky est sur une intersection
    posIntersections.map(pos => {
      if (copyPosRed.x + 10 === pos.x && copyPosRed.y + 10 === pos.y) {
        onIntersection = true
      }
    })

    posTeleport.map(pos => {
      if (copyPosRed.x + 10 === pos.x && copyPosRed.y + 10 === pos.y) {
        teleport = true
      }
    })

    const posCible = { x: 500, y: -120 }

    //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS DE BLINKY
    let newDeltaX = copyPosRed.x - posCible.x
    let newDeltaY = copyPosRed.y - posCible.y
    if (newDeltaX < 0) {
      newDeltaX = newDeltaX * -1
    }
    if (newDeltaY < 0) {
      newDeltaY = newDeltaY * (-1)
    }

    let deltaXup = newDeltaX
    let deltaYup = newDeltaY - 10
    let hypoUp = calcHypo(deltaXup, deltaYup)

    let deltaXleft = newDeltaX + 10
    let deltaYleft = newDeltaY
    let hypoLeft = calcHypo(deltaXleft, deltaYleft)

    let deltaXdown = newDeltaX
    let deltaYdown = newDeltaY + 10
    let hypoDown = calcHypo(deltaXdown, deltaYdown)

    let deltaXright = newDeltaX - 10
    let deltaYright = newDeltaY
    let hypoRight = calcHypo(deltaXright, deltaYright)

    // CALCUL DES DELTAS ET DES HYPOTENUSE EN MODE CHASE ------------

    const posCibleCHASE = { ...posPacman }
    //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

    let newDeltaXCHASE = copyPosRed.x - posCibleCHASE.x
    let newDeltaYCHASE = copyPosRed.y - posCibleCHASE.y

    if (newDeltaXCHASE < 0) {
      newDeltaXCHASE = newDeltaXCHASE * -1
    }
    if (newDeltaYCHASE < 0) {
      newDeltaYCHASE = newDeltaYCHASE * (-1)
    }

    // CALCUL DISTANCE ENTRE CIBLE ET LA POS DE BLINKY
    let hypoUpCHASE;
    let hypoLeftCHASE;
    let hypoDownCHASE;
    let hypoRightCHASE;

    if (posCibleCHASE.y < copyPosRed.y) {
      let deltaXupCHASE = newDeltaXCHASE
      let deltaYupCHASE = newDeltaYCHASE - 10
      hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
    } else if (posCibleCHASE.y > copyPosRed.y) {
      let deltaXupCHASE = newDeltaXCHASE
      let deltaYupCHASE = newDeltaYCHASE + 10
      hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
    } else {
      let deltaXupCHASE = newDeltaXCHASE
      let deltaYupCHASE = newDeltaYCHASE + 10
      hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
    }

    if (posCibleCHASE.x < copyPosRed.x) {
      let deltaXleftCHASE = newDeltaXCHASE - 10
      let deltaYleftCHASE = newDeltaYCHASE
      hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
    } else if (posCibleCHASE.x > copyPosRed.x) {
      let deltaXleftCHASE = newDeltaXCHASE + 10
      let deltaYleftCHASE = newDeltaYCHASE
      hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
    } else {
      let deltaXleftCHASE = newDeltaXCHASE + 10
      let deltaYleftCHASE = newDeltaYCHASE
      hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
    }

    if (posCibleCHASE.y > copyPosRed.y) {
      let deltaXdownCHASE = newDeltaXCHASE
      let deltaYdownCHASE = newDeltaYCHASE - 10
      hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
    } else if (posCibleCHASE.y < copyPosRed.y) {
      let deltaXdownCHASE = newDeltaXCHASE
      let deltaYdownCHASE = newDeltaYCHASE + 10
      hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
    } else {
      let deltaXdownCHASE = newDeltaXCHASE
      let deltaYdownCHASE = newDeltaYCHASE + 10
      hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
    }

    if (posCibleCHASE.x > copyPosRed.x) {
      let deltaXrightCHASE = newDeltaXCHASE - 10
      let deltaYrightCHASE = newDeltaYCHASE
      hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
    } else if (posCibleCHASE.x < copyPosRed.x) {
      let deltaXrightCHASE = newDeltaXCHASE + 10
      let deltaYrightCHASE = newDeltaYCHASE
      hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
    } else {
      let deltaXrightCHASE = newDeltaXCHASE + 10
      let deltaYrightCHASE = newDeltaYCHASE
      hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
    }

    // CALCUL DISTANCE ENTRE LA POS INITIAL ET LA POS DE BLINKY POUR LE RETOUR TO HOME

    const posCibleRETOUR = { ...initial_ghostRed }
    //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

    let newDeltaXRETOUR = copyPosRed.x - posCibleRETOUR.x
    let newDeltaYRETOUR = copyPosRed.y - posCibleRETOUR.y

    if (newDeltaXRETOUR < 0) {
      newDeltaXRETOUR = newDeltaXRETOUR * -1
    }
    if (newDeltaYRETOUR < 0) {
      newDeltaYRETOUR = newDeltaYRETOUR * (-1)
    }

    let hypoUpRETOUR;
    let hypoLeftRETOUR;
    let hypoDownRETOUR;
    let hypoRightRETOUR;

    if (posCibleRETOUR.y < copyPosRed.y) {
      let deltaXupRETOUR = newDeltaXRETOUR
      let deltaYupRETOUR = newDeltaYRETOUR - 10
      hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
    } else if (posCibleRETOUR.y > copyPosRed.y) {
      let deltaXupRETOUR = newDeltaXRETOUR
      let deltaYupRETOUR = newDeltaYRETOUR + 10
      hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
    } else {
      let deltaXupRETOUR = newDeltaXRETOUR
      let deltaYupRETOUR = newDeltaYRETOUR + 10
      hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
    }

    if (posCibleRETOUR.x < copyPosRed.x) {
      let deltaXleftRETOUR = newDeltaXRETOUR - 10
      let deltaYleftRETOUR = newDeltaYRETOUR
      hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
    } else if (posCibleRETOUR.x > copyPosRed.x) {
      let deltaXleftRETOUR = newDeltaXRETOUR + 10
      let deltaYleftRETOUR = newDeltaYRETOUR
      hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
    } else {
      let deltaXleftRETOUR = newDeltaXRETOUR + 10
      let deltaYleftRETOUR = newDeltaYRETOUR
      hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
    }

    if (posCibleRETOUR.y > copyPosRed.y) {
      let deltaXdownRETOUR = newDeltaXRETOUR
      let deltaYdownRETOUR = newDeltaYRETOUR - 10
      hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
    } else if (posCibleRETOUR.y < copyPosRed.y) {
      let deltaXdownRETOUR = newDeltaXRETOUR
      let deltaYdownRETOUR = newDeltaYRETOUR + 10
      hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
    } else {
      let deltaXdownRETOUR = newDeltaXRETOUR
      let deltaYdownRETOUR = newDeltaYRETOUR + 10
      hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
    }

    if (posCibleRETOUR.x > copyPosRed.x) {
      let deltaXrightRETOUR = newDeltaXRETOUR - 10
      let deltaYrightRETOUR = newDeltaYRETOUR
      hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
    } else if (posCibleRETOUR.x < copyPosRed.x) {
      let deltaXrightRETOUR = newDeltaXRETOUR + 10
      let deltaYrightRETOUR = newDeltaYRETOUR
      hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
    } else {
      let deltaXrightRETOUR = newDeltaXRETOUR + 10
      let deltaYrightRETOUR = newDeltaYRETOUR
      hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
    }

    //PAS ENCORE DE DIRECTION
    if (directionRed === '') {
      setDirectionRed('LEFT')
      copyPosRed.x -= 10
      setPosRed(copyPosRed)
      setModeRed(mode)
    }

    if (teleport === false) {
      if (directionRed !== '') {
        setPrevModeRed(modeRed)
        setModeRed(mode)
      }

      if (prevModeRed === 'SCATTER' && modeRed === 'CHASE' && retourRed === false) {
        directionForce(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosRed, wallUp, wallLeft, wallDown, wallRight, setDirectionRed, setPosRed)
      }

      if (prevModeRed === 'CHASE' && modeRed === 'SCATTER' && retourRed === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, setDirectionRed, setPosRed)
      }

      if (prevModeRed === 'CHASE' && modeRed === 'AFRAID' && retourRed === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, setDirectionRed, setPosRed)
      }
      if (prevModeRed === 'SCATTER' && modeRed === 'AFRAID' && retourRed === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, setDirectionRed, setPosRed)
      }

      // CHOIX DE LA DIRECTION ET DU DEPLACEMENT
      if (prevModeRed === 'AFRAID' && modeRed === 'AFRAID' && retourRed === false) {
        let aleaNb1 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb2 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb3 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb4 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0

        if (directionRed === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallLeft === false) {
            copyPosRed.x -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }

        if (directionRed === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallUp === false) {
            copyPosRed.y -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }

        if (directionRed === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallRight === false) {
            copyPosRed.x += 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }
        if (directionRed === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallDown === false) {
            copyPosRed.y += 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }
      } else if (prevModeRed === 'SCATTER' && modeRed === 'SCATTER' && retourRed === false) {
        if (directionRed === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallLeft === false) {
            copyPosRed.x -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }

        if (directionRed === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallUp === false) {
            copyPosRed.y -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }

        if (directionRed === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallRight === false) {
            copyPosRed.x += 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }
        if (directionRed === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallDown === false) {
            copyPosRed.y += 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }
      } else if (prevModeRed === 'CHASE' && modeRed === 'CHASE' && retourRed === false) {
        if (directionRed === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallLeft === false) {
            copyPosRed.x -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }

        if (directionRed === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallUp === false) {
            copyPosRed.y -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }

        if (directionRed === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallRight === false) {
            copyPosRed.x += 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }
        if (directionRed === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallDown === false) {
            copyPosRed.y += 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }
      } else if (retourRed) {
        if (directionRed === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallLeft === false) {
            copyPosRed.x -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }

        if (directionRed === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallUp === false) {
            copyPosRed.y -= 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }

        if (directionRed === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallRight === false) {
            copyPosRed.x += 10
            setPosRed(copyPosRed)
          } else {
            if (wallUp === false) {
              copyPosRed.y -= 10
              setPosRed(copyPosRed)
              setDirectionRed('UP')
            }
            if (wallDown === false) {
              copyPosRed.y += 10
              setPosRed(copyPosRed)
              setDirectionRed('DOWN')
            }
          }
        }
        if (directionRed === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosRed, wallUp, wallLeft, wallDown, wallRight, directionRed, setDirectionRed, setPosRed)
          } else if (wallDown === true) { 
            directionForce(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosRed, wallUp, wallLeft, wallDown, wallRight, setDirectionRed, setPosRed)
          } else if (wallDown === false) {
            copyPosRed.y += 10
            setPosRed(copyPosRed)
          } else {
            if (wallLeft === false) {
              copyPosRed.x -= 10
              setPosRed(copyPosRed)
              setDirectionRed('LEFT')
            }
            if (wallRight === false) {
              copyPosRed.x += 10
              setPosRed(copyPosRed)
              setDirectionRed('RIGHT')
            }
          }
        }
      }
    } else if (teleport && copyPosRed.x < 100) {
      copyPosRed.x = 500
      copyPosRed.y = 270
      setPosRed(copyPosRed)
    } else if (teleport && copyPosRed.x > 100) {
      copyPosRed.x = 10
      copyPosRed.y = 270
      setPosRed(copyPosRed)
    }
  }

  // FONCTIONS DE COMPORTEMENTS DU GHOST PINK => PINKY
  const movePinky = () => {
    let copyPosPink = { ...posPink }
    let wallLeft = false
    let wallUp = false
    let wallRight = false
    let wallDown = false
    let teleport = false
    let onIntersection = false

    posWalls.map(pos => {
      if (copyPosPink.x === pos.x && copyPosPink.y + 10 === pos.y) {
        wallLeft = true
      }
      if (copyPosPink.x + 10 === pos.x && copyPosPink.y === pos.y) {
        wallUp = true
      }
      if (copyPosPink.x + 20 === pos.x && copyPosPink.y + 10 === pos.y) {
        wallRight = true
      }
      if (copyPosPink.x + 10 === pos.x && copyPosPink.y + 20 === pos.y) {
        wallDown = true
      }
    })

    posIntersections.map(pos => {
      if (copyPosPink.x + 10 === pos.x && copyPosPink.y + 10 === pos.y) {
        onIntersection = true
      }
    })

    posTeleport.map(pos => {
      if (copyPosPink.x + 10 === pos.x && copyPosPink.y + 10 === pos.y) {
        teleport = true
      }
    })

    if (isOutPink === false && copyPosPink.y !== 210) {
      copyPosPink.y -= 10
      setPosPink(copyPosPink)
    } else if (teleport === false && isOutPink === true) {
      const posCible = { x: 40, y: -120 }

      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS DE BLINKY
      let newDeltaX = copyPosPink.x - posCible.x
      let newDeltaY = copyPosPink.y - posCible.y
      if (newDeltaX < 0) {
        newDeltaX = newDeltaX * -1
      }
      if (newDeltaY < 0) {
        newDeltaY = newDeltaY * (-1)
      }

      let deltaXup = newDeltaX
      let deltaYup = newDeltaY - 10
      let hypoUp = calcHypo(deltaXup, deltaYup)

      let deltaXleft = newDeltaX - 10
      let deltaYleft = newDeltaY
      let hypoLeft = calcHypo(deltaXleft, deltaYleft)

      let deltaXdown = newDeltaX
      let deltaYdown = newDeltaY + 10
      let hypoDown = calcHypo(deltaXdown, deltaYdown)

      let deltaXright = newDeltaX + 10
      let deltaYright = newDeltaY
      let hypoRight = calcHypo(deltaXright, deltaYright)

      // CALCUL DES DELTAS ET DES HYPOTENUSE EN MODE CHASE ------------
      const posCibleCHASE = { ...posPacman }

      if (direction === 'UP') {
        posCibleCHASE.x = posPacman.x
        posCibleCHASE.y = posPacman.y - 100
      }
      if (direction === 'LEFT') {
        posCibleCHASE.x = posPacman.x - 100
        posCibleCHASE.y = posPacman.y
      }
      if (direction === 'DOWN') {
        posCibleCHASE.x = posPacman.x
        posCibleCHASE.y = posPacman.y + 100
      }
      if (direction === 'RIGHT') {
        posCibleCHASE.x = posPacman.x + 100
        posCibleCHASE.y = posPacman.y
      }

      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

      let newDeltaXCHASE = copyPosPink.x - posCibleCHASE.x
      let newDeltaYCHASE = copyPosPink.y - posCibleCHASE.y

      if (newDeltaXCHASE < 0) {
        newDeltaXCHASE = newDeltaXCHASE * -1
      }
      if (newDeltaYCHASE < 0) {
        newDeltaYCHASE = newDeltaYCHASE * (-1)
      }

      // CALCUL DISTANCE ENTRE CIBLE ET LA POS DE BLINKY
      let hypoUpCHASE;
      let hypoLeftCHASE;
      let hypoDownCHASE;
      let hypoRightCHASE;

      if (posCibleCHASE.y < copyPosPink.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE - 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else if (posCibleCHASE.y > copyPosPink.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      }

      if (posCibleCHASE.x < copyPosPink.x) {
        let deltaXleftCHASE = newDeltaXCHASE - 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else if (posCibleCHASE.x > copyPosPink.x) {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      }

      if (posCibleCHASE.y > copyPosPink.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE - 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else if (posCibleCHASE.y < copyPosPink.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      }

      if (posCibleCHASE.x > copyPosPink.x) {
        let deltaXrightCHASE = newDeltaXCHASE - 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else if (posCibleCHASE.x < copyPosPink.x) {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      }

        // CALCUL DISTANCE ENTRE LA POS INITIAL ET LA POS DE BLINKY POUR LE RETOUR TO HOME

      const posCibleRETOUR = { ...initial_ghostPink }
      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

      let newDeltaXRETOUR = copyPosPink.x - posCibleRETOUR.x
      let newDeltaYRETOUR = copyPosPink.y - posCibleRETOUR.y

      if (newDeltaXRETOUR < 0) {
        newDeltaXRETOUR = newDeltaXRETOUR * -1
      }
      if (newDeltaYRETOUR < 0) {
        newDeltaYRETOUR = newDeltaYRETOUR * (-1)
      }

      let hypoUpRETOUR;
      let hypoLeftRETOUR;
      let hypoDownRETOUR;
      let hypoRightRETOUR;

      if (posCibleRETOUR.y < copyPosPink.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR - 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else if (posCibleRETOUR.y > copyPosPink.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      }

      if (posCibleRETOUR.x < copyPosPink.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR - 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else if (posCibleRETOUR.x > copyPosPink.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      }

      if (posCibleRETOUR.y > copyPosPink.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR - 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else if (posCibleRETOUR.y < copyPosPink.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      }

      if (posCibleRETOUR.x > copyPosPink.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR - 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else if (posCibleRETOUR.x < copyPosPink.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      }

      //PAS ENCORE DE DIRECTION
      if (directionPink === '') {
        setDirectionPink('LEFT')
        copyPosPink.x -= 10
        setPosPink(copyPosPink)
        setModePink(mode)
      }

      if (directionPink !== '') {
        setPrevModePink(modePink)
        setModePink(mode)
      }

      // CHOIX DE LA DIRECTION ET DU DEPLACEMENT
      if (prevModePink === 'SCATTER' && modePink === 'CHASE' && retourPink === false) {
        directionForce(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosPink, wallUp, wallLeft, wallDown, wallRight, setDirectionPink, setPosPink)
      }
      if (prevModePink === 'CHASE' && modePink === 'SCATTER' && retourPink === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, setDirectionPink, setPosPink)
      }
      if (prevModePink === 'SCATTER' && modePink === 'AFRAID' && retourPink === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, setDirectionPink, setPosPink)
      }
      if (prevModePink === 'CHASE' && modePink === 'AFRAID' && retourPink === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, setDirectionPink, setPosPink)
      }

      // CHOIX DE LA DIRECTION ET DU DEPLACEMENT
      if (prevModePink === 'AFRAID' && modePink === 'AFRAID'  && retourPink === false) {
        let aleaNb1 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb2 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb3 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb4 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0

        if (directionPink === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallLeft === false) {
            copyPosPink.x -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }

        if (directionPink === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallUp === false) {
            copyPosPink.y -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }

        if (directionPink === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallRight === false) {
            copyPosPink.x += 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }
        if (directionPink === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallDown === false) {
            copyPosPink.y += 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }
      } else if (prevModePink === 'SCATTER' && modePink === 'SCATTER' && retourPink === false) {
        if (directionPink === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallLeft === false) {
            copyPosPink.x -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }

        if (directionPink === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallUp === false) {
            copyPosPink.y -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }

        if (directionPink === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallRight === false) {
            copyPosPink.x += 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }
        if (directionPink === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallDown === false) {
            copyPosPink.y += 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }
      } else if (prevModePink === 'CHASE' && modePink === 'CHASE' && retourPink === false) {
        if (directionPink === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallLeft === false) {
            copyPosPink.x -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }

        if (directionPink === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallUp === false) {
            copyPosPink.y -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }

        if (directionPink === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallRight === false) {
            copyPosPink.x += 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }
        if (directionPink === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallDown === false) {
            copyPosPink.y += 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }
      } else if (retourPink) {
        if (directionPink === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallLeft === false) {
            copyPosPink.x -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }

        if (directionPink === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallUp === false) {
            copyPosPink.y -= 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }

        if (directionPink === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallRight === false) {
            copyPosPink.x += 10
            setPosPink(copyPosPink)
          } else {
            if (wallUp === false) {
              copyPosPink.y -= 10
              setPosPink(copyPosPink)
              setDirectionPink('UP')
            }
            if (wallDown === false) {
              copyPosPink.y += 10
              setPosPink(copyPosPink)
              setDirectionPink('DOWN')
            }
          }
        }
        if (directionPink === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosPink, wallUp, wallLeft, wallDown, wallRight, directionPink, setDirectionPink, setPosPink)
          } else if (wallDown === true) { 
            directionForce(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosPink, wallUp, wallLeft, wallDown, wallRight, setDirectionPink, setPosPink)
          } else if (wallDown === false) {
            copyPosPink.y += 10
            setPosPink(copyPosPink)
          } else {
            if (wallLeft === false) {
              copyPosPink.x -= 10
              setPosPink(copyPosPink)
              setDirectionPink('LEFT')
            }
            if (wallRight === false) {
              copyPosPink.x += 10
              setPosPink(copyPosPink)
              setDirectionPink('RIGHT')
            }
          }
        }
      }
    } else if (teleport && copyPosPink.x < 100) {
      copyPosPink.x = 500
      copyPosPink.y = 270
      setPosPink(copyPosPink)
    } else if (teleport && copyPosPink.x > 100) {
      copyPosPink.x = 10
      copyPosPink.y = 270
      setPosPink(copyPosPink)
    }
  }

  // FONCTIONS DE COMPORTEMENTS DU GHOST BLUE => INKY
  const moveInky = () => {
    let copyPosBlue = { ...posBlue }
    let wallLeft = false
    let wallUp = false
    let wallRight = false
    let wallDown = false
    let teleport = false
    let onIntersection = false

    posWalls.map(pos => {
      if (copyPosBlue.x === pos.x && copyPosBlue.y + 10 === pos.y) {
        wallLeft = true
      }
      if (copyPosBlue.x + 10 === pos.x && copyPosBlue.y === pos.y) {
        wallUp = true
      }
      if (copyPosBlue.x + 20 === pos.x && copyPosBlue.y + 10 === pos.y) {
        wallRight = true
      }
      if (copyPosBlue.x + 10 === pos.x && copyPosBlue.y + 20 === pos.y) {
        wallDown = true
      }
    })

    posIntersections.map(pos => {
      if (copyPosBlue.x + 10 === pos.x && copyPosBlue.y + 10 === pos.y) {
        onIntersection = true
      }
    })

    posTeleport.map(pos => {
      if (copyPosBlue.x + 10 === pos.x && copyPosBlue.y + 10 === pos.y) {
        teleport = true
      }
    })

    if (pointsEat.current >= 19 && isOutBlue === false && copyPosBlue.x !== 260 && round === 2) {
      copyPosBlue.x += 10
      return setPosBlue(copyPosBlue)
    } else if (pointsEat.current >= 29 && isOutBlue === false && copyPosBlue.x !== 260 && round === 1) {
      copyPosBlue.x += 10
      return setPosBlue(copyPosBlue)
    } else if (isOutBlue === false && copyPosBlue.x !== 260 && round > 2) {
      copyPosBlue.x += 10
      return setPosBlue(copyPosBlue)
    }

    if (pointsEat.current >= 19 && isOutBlue === false && copyPosBlue.y !== 210 && round === 2) {
      copyPosBlue.y -= 10
      return setPosBlue(copyPosBlue)
    } else if (pointsEat.current >= 29 && isOutBlue === false && copyPosBlue.y !== 210 && round === 1) {
      copyPosBlue.y -= 10
      return setPosBlue(copyPosBlue)
    } else if (isOutBlue === false && copyPosBlue.y !== 210 && round > 2 && copyPosBlue.x === 260) {
      copyPosBlue.y -= 10
      return setPosBlue(copyPosBlue)
    }

    if (isOutBlue && teleport === false) {
      // CALCUL DES DELTAS ET DES HYPOTENUSE EN MODE SCATTER -------------
      const posCible = { x: 540, y: 660 }

      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS 
      let newDeltaX = copyPosBlue.x - posCible.x
      let newDeltaY = copyPosBlue.y - posCible.y
      if (newDeltaX < 0) {
        newDeltaX = newDeltaX * -1
      }
      if (newDeltaY < 0) {
        newDeltaY = newDeltaY * (-1)
      }
      // CALCUL DISTANCE ENTRE CIBLE ET LA POS
      let deltaXup = newDeltaX
      let deltaYup = newDeltaY + 10
      let hypoUp = calcHypo(deltaXup, deltaYup)

      let deltaXleft = newDeltaX + 10
      let deltaYleft = newDeltaY
      let hypoLeft = calcHypo(deltaXleft, deltaYleft)

      let deltaXdown = newDeltaX
      let deltaYdown = newDeltaY - 10
      let hypoDown = calcHypo(deltaXdown, deltaYdown)

      let deltaXright = newDeltaX - 10
      let deltaYright = newDeltaY
      let hypoRight = calcHypo(deltaXright, deltaYright)

      // CALCUL DES DELTAS ET DES HYPOTENUSE EN MODE CHASE ------------

      const posCibleCHASE = { ...posPacman }

      if (direction === 'UP') {
        posCibleCHASE.x = posPacman.x - 80
        posCibleCHASE.y = posPacman.y - 80
      }
      if (direction === 'LEFT') {
        posCibleCHASE.x = posPacman.x - 80
        posCibleCHASE.y = posPacman.y + 80
      }
      if (direction === 'DOWN') {
        posCibleCHASE.x = posPacman.x + 80
        posCibleCHASE.y = posPacman.y + 80
      }
      if (direction === 'RIGHT') {
        posCibleCHASE.x = posPacman.x + 80
        posCibleCHASE.y = posPacman.y - 80
      }

      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

      let newDeltaXCHASE = copyPosBlue.x - posCibleCHASE.x
      let newDeltaYCHASE = copyPosBlue.y - posCibleCHASE.y

      if (newDeltaXCHASE < 0) {
        newDeltaXCHASE = newDeltaXCHASE * -1
      }
      if (newDeltaYCHASE < 0) {
        newDeltaYCHASE = newDeltaYCHASE * (-1)
      }
      // CALCUL DISTANCE ENTRE CIBLE ET LA POS DE BLINKY
      let hypoUpCHASE;
      let hypoLeftCHASE;
      let hypoDownCHASE;
      let hypoRightCHASE;

      if (posCibleCHASE.y < copyPosBlue.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE - 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else if (posCibleCHASE.y > copyPosBlue.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      }

      if (posCibleCHASE.x < copyPosBlue.x) {
        let deltaXleftCHASE = newDeltaXCHASE - 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else if (posCibleCHASE.x > copyPosBlue.x) {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      }

      if (posCibleCHASE.y > copyPosBlue.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE - 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else if (posCibleCHASE.y < copyPosBlue.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      }

      if (posCibleCHASE.x > copyPosBlue.x) {
        let deltaXrightCHASE = newDeltaXCHASE - 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else if (posCibleCHASE.x < copyPosBlue.x) {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      }

      // CALCUL DISTANCE ENTRE LA POS INITIAL ET LA POS DE BLINKY POUR LE RETOUR TO HOME

      const posCibleRETOUR = { ...initial_ghostBlue }
      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

      let newDeltaXRETOUR = copyPosBlue.x - posCibleRETOUR.x
      let newDeltaYRETOUR = copyPosBlue.y - posCibleRETOUR.y

      if (newDeltaXRETOUR < 0) {
        newDeltaXRETOUR = newDeltaXRETOUR * -1
      }
      if (newDeltaYRETOUR < 0) {
        newDeltaYRETOUR = newDeltaYRETOUR * (-1)
      }

      let hypoUpRETOUR;
      let hypoLeftRETOUR;
      let hypoDownRETOUR;
      let hypoRightRETOUR;

      if (posCibleRETOUR.y < copyPosBlue.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR - 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else if (posCibleRETOUR.y > copyPosBlue.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      }

      if (posCibleRETOUR.x < copyPosBlue.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR - 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else if (posCibleRETOUR.x > copyPosBlue.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      }

      if (posCibleRETOUR.y > copyPosBlue.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR - 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else if (posCibleRETOUR.y < copyPosBlue.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      }

      if (posCibleRETOUR.x > copyPosBlue.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR - 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else if (posCibleRETOUR.x < copyPosBlue.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      }

      //PAS ENCORE DE DIRECTION
      if (directionBlue === '') {
        setDirectionBlue('LEFT')
        copyPosBlue.x -= 10
        setPosBlue(copyPosBlue)
        setModeBlue(mode)
      }

      if (directionBlue !== '') {
        setPrevModeBlue(modeBlue)
        setModeBlue(mode)
      }

      if (prevModeBlue === 'SCATTER' && modeBlue === 'CHASE' && retourBlue === false) {
        directionForce(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, setDirectionBlue, setPosBlue)
      }

      if (prevModeBlue === 'CHASE' && modeBlue === 'SCATTER' && retourBlue === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, setDirectionBlue, setPosBlue)
      }

      if (prevModeBlue === 'SCATTER' && modeBlue === 'AFRAID' && retourBlue === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, setDirectionBlue, setPosBlue)
      }
      if (prevModeBlue === 'CHASE' && modeBlue === 'AFRAID' && retourBlue === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, setDirectionBlue, setPosBlue)
      }

      // CHOIX DE LA DIRECTION ET DU DEPLACEMENT
      if (prevModeBlue === 'AFRAID' && modeBlue === 'AFRAID' && retourBlue === false) {
        let aleaNb1 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb2 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb3 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb4 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0

        if (directionBlue === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallLeft === false) {
            copyPosBlue.x -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }

        if (directionBlue === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallUp === false) {
            copyPosBlue.y -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }

        if (directionBlue === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallRight === false) {
            copyPosBlue.x += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }
        if (directionBlue === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallDown === false) {
            copyPosBlue.y += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }
      } else if (prevModeBlue === 'SCATTER' && modeBlue === 'SCATTER' && retourBlue === false) {

        if (directionBlue === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallLeft === false) {
            copyPosBlue.x -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }

        if (directionBlue === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallUp === false) {
            copyPosBlue.y -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }

        if (directionBlue === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallRight === false) {
            copyPosBlue.x += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }
        if (directionBlue === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallDown === false) {
            copyPosBlue.y += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }
      } else if (prevModeBlue === 'CHASE' && modeBlue === 'CHASE' && retourBlue === false) {
        if (directionBlue === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallLeft === false) {
            copyPosBlue.x -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }

        if (directionBlue === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallUp === false) {
            copyPosBlue.y -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }

        if (directionBlue === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallRight === false) {
            copyPosBlue.x += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }
        if (directionBlue === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallDown === false) {
            copyPosBlue.y += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }
      } else if (retourBlue) {
        if (directionBlue === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallLeft === false) {
            copyPosBlue.x -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }

        if (directionBlue === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallUp === false) {
            copyPosBlue.y -= 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }

        if (directionBlue === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallRight === false) {
            copyPosBlue.x += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallUp === false) {
              copyPosBlue.y -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('UP')
            }
            if (wallDown === false) {
              copyPosBlue.y += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('DOWN')
            }
          }
        }
        if (directionBlue === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, directionBlue, setDirectionBlue, setPosBlue)
          } else if (wallDown === true) { 
            directionForce(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosBlue, wallUp, wallLeft, wallDown, wallRight, setDirectionBlue, setPosBlue)
          } else if (wallDown === false) {
            copyPosBlue.y += 10
            setPosBlue(copyPosBlue)
          } else {
            if (wallLeft === false) {
              copyPosBlue.x -= 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('LEFT')
            }
            if (wallRight === false) {
              copyPosBlue.x += 10
              setPosBlue(copyPosBlue)
              setDirectionBlue('RIGHT')
            }
          }
        }
      }
    } else if (teleport && copyPosBlue.x < 100) {
      copyPosBlue.x = 500
      copyPosBlue.y = 270
      setPosBlue(copyPosBlue)
    } else if (teleport && copyPosBlue.x > 100) {
      copyPosBlue.x = 10
      copyPosBlue.y = 270
      setPosBlue(copyPosBlue)
    }
  }

  // FONCTIONS DE COMPORTEMENTS DU GHOST YELLOW => CLYDE
  const moveClyde = () => {
    let copyPosYellow = { ...posYellow }
    let wallLeft = false
    let wallUp = false
    let wallRight = false
    let wallDown = false
    let teleport = false
    let onIntersection = false

    posWalls.map(pos => {
      if (copyPosYellow.x === pos.x && copyPosYellow.y + 10 === pos.y) {
        wallLeft = true
      }
      if (copyPosYellow.x + 10 === pos.x && copyPosYellow.y === pos.y) {
        wallUp = true
      }
      if (copyPosYellow.x + 20 === pos.x && copyPosYellow.y + 10 === pos.y) {
        wallRight = true
      }
      if (copyPosYellow.x + 10 === pos.x && copyPosYellow.y + 20 === pos.y) {
        wallDown = true
      }
    })

    posIntersections.map(pos => {
      if (copyPosYellow.x + 10 === pos.x && copyPosYellow.y + 10 === pos.y) {
        onIntersection = true
      }
    })

    posTeleport.map(pos => {
      if (copyPosYellow.x + 10 === pos.x && copyPosYellow.y + 10 === pos.y) {
        teleport = true
      }
    })


    if (pointsEat.current >= 49 && isOutYellow === false && copyPosYellow.x !== 260 && round === 2) {
      copyPosYellow.x -= 10
      return setPosYellow(copyPosYellow)
    } else if (pointsEat.current >= 79 && isOutYellow === false && copyPosYellow.x !== 260 && round === 1) {
      copyPosYellow.x -= 10
      return setPosYellow(copyPosYellow)
    } else if (isOutYellow === false && copyPosYellow.x !== 260 && round > 2) {
      copyPosYellow.x -= 10
      return setPosYellow(copyPosYellow)
    }

    if (pointsEat.current >= 49 && isOutYellow === false && copyPosYellow.y !== 210 && round === 2) {
      copyPosYellow.y -= 10
      return setPosYellow(copyPosYellow)
    } else if (pointsEat.current >= 79 && isOutYellow === false && copyPosYellow.y !== 210 && round === 1) {
      copyPosYellow.y -= 10
      return setPosYellow(copyPosYellow)
    } else if (isOutYellow === false && copyPosYellow.y !== 210 && round > 2 && copyPosYellow.x === 260) {
      copyPosYellow.y -= 10
      return setPosYellow(copyPosYellow)
    }

    if (isOutYellow && teleport === false) {
      const posCible = { x: 0, y: 660 }

      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS
      let newDeltaX = copyPosYellow.x - posCible.x
      let newDeltaY = copyPosYellow.y - posCible.y
      if (newDeltaX < 0) {
        newDeltaX = newDeltaX * -1
      }
      if (newDeltaY < 0) {
        newDeltaY = newDeltaY * (-1)
      }

      let deltaXup = newDeltaX
      let deltaYup = newDeltaY + 10
      let hypoUp = calcHypo(deltaXup, deltaYup)

      let deltaXleft = newDeltaX - 10
      let deltaYleft = newDeltaY
      let hypoLeft = calcHypo(deltaXleft, deltaYleft)

      let deltaXdown = newDeltaX
      let deltaYdown = newDeltaY - 10
      let hypoDown = calcHypo(deltaXdown, deltaYdown)

      let deltaXright = newDeltaX + 10
      let deltaYright = newDeltaY
      let hypoRight = calcHypo(deltaXright, deltaYright)

      // CALCUL DU DELTA ENTRE CIBLE ET POS EN MODE CHASE
      let posCibleCHASE = { ...posPacman }

      let newDeltaXCHASE = copyPosYellow.x - posCibleCHASE.x
      let newDeltaYCHASE = copyPosYellow.y - posCibleCHASE.y


      if (newDeltaXCHASE < 0) {
        newDeltaXCHASE = newDeltaXCHASE * -1
      }
      if (newDeltaYCHASE < 0) {
        newDeltaYCHASE = newDeltaYCHASE * (-1)
      }
      if (newDeltaXCHASE + newDeltaYCHASE <= 200) {
        posCibleCHASE = { x: 0, y: 660 }
      }

      let hypoUpCHASE;
      let hypoLeftCHASE;
      let hypoDownCHASE;
      let hypoRightCHASE;

      if (posCibleCHASE.y < copyPosYellow.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE - 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else if (posCibleCHASE.y > copyPosYellow.y) {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      } else {
        let deltaXupCHASE = newDeltaXCHASE
        let deltaYupCHASE = newDeltaYCHASE + 10
        hypoUpCHASE = calcHypo(deltaXupCHASE, deltaYupCHASE)
      }

      if (posCibleCHASE.x < copyPosYellow.x) {
        let deltaXleftCHASE = newDeltaXCHASE - 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else if (posCibleCHASE.x > copyPosYellow.x) {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      } else {
        let deltaXleftCHASE = newDeltaXCHASE + 10
        let deltaYleftCHASE = newDeltaYCHASE
        hypoLeftCHASE = calcHypo(deltaXleftCHASE, deltaYleftCHASE)
      }

      if (posCibleCHASE.y > copyPosYellow.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE - 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else if (posCibleCHASE.y < copyPosYellow.y) {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      } else {
        let deltaXdownCHASE = newDeltaXCHASE
        let deltaYdownCHASE = newDeltaYCHASE + 10
        hypoDownCHASE = calcHypo(deltaXdownCHASE, deltaYdownCHASE)
      }

      if (posCibleCHASE.x > copyPosYellow.x) {
        let deltaXrightCHASE = newDeltaXCHASE - 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else if (posCibleCHASE.x < copyPosYellow.x) {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      } else {
        let deltaXrightCHASE = newDeltaXCHASE + 10
        let deltaYrightCHASE = newDeltaYCHASE
        hypoRightCHASE = calcHypo(deltaXrightCHASE, deltaYrightCHASE)
      }

      // CALCUL DISTANCE ENTRE LA POS INITIAL ET LA POS DE BLINKY POUR LE RETOUR TO HOME

      const posCibleRETOUR = { ...initial_ghostYellow }
      //CALCUL DU DELTA ENTRE LA CIBLE ET LA POS

      let newDeltaXRETOUR = copyPosYellow.x - posCibleRETOUR.x
      let newDeltaYRETOUR = copyPosYellow.y - posCibleRETOUR.y

      if (newDeltaXRETOUR < 0) {
        newDeltaXRETOUR = newDeltaXRETOUR * -1
      }
      if (newDeltaYRETOUR < 0) {
        newDeltaYRETOUR = newDeltaYRETOUR * (-1)
      }

      let hypoUpRETOUR;
      let hypoLeftRETOUR;
      let hypoDownRETOUR;
      let hypoRightRETOUR;

      if (posCibleRETOUR.y < copyPosYellow.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR - 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else if (posCibleRETOUR.y > copyPosYellow.y) {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      } else {
        let deltaXupRETOUR = newDeltaXRETOUR
        let deltaYupRETOUR = newDeltaYRETOUR + 10
        hypoUpRETOUR = calcHypo(deltaXupRETOUR, deltaYupRETOUR)
      }

      if (posCibleRETOUR.x < copyPosYellow.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR - 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else if (posCibleRETOUR.x > copyPosYellow.x) {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      } else {
        let deltaXleftRETOUR = newDeltaXRETOUR + 10
        let deltaYleftRETOUR = newDeltaYRETOUR
        hypoLeftRETOUR = calcHypo(deltaXleftRETOUR, deltaYleftRETOUR)
      }

      if (posCibleRETOUR.y > copyPosYellow.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR - 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else if (posCibleRETOUR.y < copyPosYellow.y) {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      } else {
        let deltaXdownRETOUR = newDeltaXRETOUR
        let deltaYdownRETOUR = newDeltaYRETOUR + 10
        hypoDownRETOUR = calcHypo(deltaXdownRETOUR, deltaYdownRETOUR)
      }

      if (posCibleRETOUR.x > copyPosYellow.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR - 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else if (posCibleRETOUR.x < copyPosYellow.x) {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      } else {
        let deltaXrightRETOUR = newDeltaXRETOUR + 10
        let deltaYrightRETOUR = newDeltaYRETOUR
        hypoRightRETOUR = calcHypo(deltaXrightRETOUR, deltaYrightRETOUR)
      }

      //PAS ENCORE DE DIRECTION
      if (directionYellow === '') {
        setDirectionYellow('LEFT')
        copyPosYellow.x -= 10
        setPosYellow(copyPosYellow)
        setModeYellow(mode)
      }

      if (directionYellow !== '') {
        setPrevModeYellow(modeYellow)
        setModeYellow(mode)
      }

      if (prevModeYellow === 'SCATTER' && modeYellow === 'CHASE' && retourYellow === false) {
        directionForce(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, setDirectionYellow, setPosYellow)
      }

      if (prevModeYellow === 'CHASE' && modeYellow === 'SCATTER' && retourYellow === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, setDirectionYellow, setPosYellow)
      }

      if (prevModeYellow === 'SCATTER' && modeYellow === 'AFRAID' && retourYellow === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, setDirectionYellow, setPosYellow)
      }
      if (prevModeYellow === 'CHASE' && modeYellow === 'AFRAID' && retourYellow === false) {
        directionForce(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, setDirectionYellow, setPosYellow)
      }

      // CHOIX DE LA DIRECTION ET DU DEPLACEMENT
      if (prevModeYellow === 'AFRAID' && modeYellow === 'AFRAID' && retourYellow === false) {
        let aleaNb1 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb2 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb3 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0
        let aleaNb4 = Math.floor(Math.random() * (5000 - 0 + 1)) + 0

        if (directionYellow === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallLeft === false) {
            copyPosYellow.x -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }

        if (directionYellow === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallUp === false) {
            copyPosYellow.y -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }

        if (directionYellow === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallRight === false) {
            copyPosYellow.x += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }
        if (directionYellow === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(aleaNb1, aleaNb2, aleaNb3, aleaNb4, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallDown === false) {
            copyPosYellow.y += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }
      } else if (prevModeYellow === 'SCATTER' && modeYellow === 'SCATTER' && retourYellow === false) {
        if (directionYellow === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallLeft === false) {
            copyPosYellow.x -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }

        if (directionYellow === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallUp === false) {
            copyPosYellow.y -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }

        if (directionYellow === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallRight === false) {
            copyPosYellow.x += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }
        if (directionYellow === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUp, hypoLeft, hypoDown, hypoRight, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallDown === false) {
            copyPosYellow.y += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }
      } else if (prevModeYellow === 'CHASE' && modeYellow === 'CHASE' && retourYellow === false) {
        if (directionYellow === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallLeft === false) {
            copyPosYellow.x -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }

        if (directionYellow === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallUp === false) {
            copyPosYellow.y -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }

        if (directionYellow === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallRight === false) {
            copyPosYellow.x += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }
        if (directionYellow === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpCHASE, hypoLeftCHASE, hypoDownCHASE, hypoRightCHASE, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallDown === false) {
            copyPosYellow.y += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }
      } else if (retourYellow) {
        if (directionYellow === 'LEFT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallLeft === false) {
            copyPosYellow.x -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }

        if (directionYellow === 'UP') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallUp === false) {
            copyPosYellow.y -= 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }

        if (directionYellow === 'RIGHT') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallRight === false) {
            copyPosYellow.x += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallUp === false) {
              copyPosYellow.y -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('UP')
            }
            if (wallDown === false) {
              copyPosYellow.y += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('DOWN')
            }
          }
        }
        if (directionYellow === 'DOWN') {
          if (onIntersection === true) {
            cibleIntersection(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, directionYellow, setDirectionYellow, setPosYellow)
          } else if (wallDown === true) { 
            directionForce(hypoUpRETOUR, hypoLeftRETOUR, hypoDownRETOUR, hypoRightRETOUR, copyPosYellow, wallUp, wallLeft, wallDown, wallRight, setDirectionYellow, setPosYellow)
          } else if (wallDown === false) {
            copyPosYellow.y += 10
            setPosYellow(copyPosYellow)
          } else {
            if (wallLeft === false) {
              copyPosYellow.x -= 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('LEFT')
            }
            if (wallRight === false) {
              copyPosYellow.x += 10
              setPosYellow(copyPosYellow)
              setDirectionYellow('RIGHT')
            }
          }
        }
      }
    } else if (teleport && copyPosYellow.x < 100) {
      copyPosYellow.x = 500
      copyPosYellow.y = 270
      setPosYellow(copyPosYellow)
    } else if (teleport && copyPosYellow.x > 100) {
      copyPosYellow.x = 10
      copyPosYellow.y = 270
      setPosYellow(copyPosYellow)
    }
  }

  // FONCTION CALCUL HYPOTENUSE 
  const calcHypo = (deltaX, deltaY) => {
    return (Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)));
  }
  // FONCTION CONNAITRE LA PROCHAINE CIBLE EN MODE SCATTER
  const cibleIntersection = (hypoUp, hypoLeft, hypoDown, hypoRight, copyPos, wallUp, wallLeft, wallDown, wallRight, direction, setDirection, setPos) => {
    let plusPetitHypo
   
    if (direction === 'UP') {
      if (wallLeft === false && wallUp === false && wallRight === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoUp, hypoRight)
      }
      if (wallLeft === true && wallUp === false && wallRight === false) {
        plusPetitHypo = Math.min(hypoUp, hypoRight)
      }
      if (wallLeft === false && wallUp === true && wallRight === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoRight)
      }
      if (wallLeft === false && wallUp === false && wallRight === true) {
        plusPetitHypo = Math.min(hypoLeft, hypoUp)
      }
    }
    if (direction === 'LEFT') {
      if (wallLeft === false && wallUp === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoUp, hypoDown)
      }
      if (wallLeft === true && wallUp === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoUp, hypoDown)
      }
      if (wallLeft === false && wallUp === true && wallDown === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoDown)
      }
      if (wallLeft === false && wallUp === false && wallDown === true) {
        plusPetitHypo = Math.min(hypoLeft, hypoUp)
      }
    }
    if (direction === 'DOWN') {
      if (wallLeft === false && wallRight === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoRight, hypoDown)
      }
      if (wallLeft === true && wallRight === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoRight, hypoDown)
      }
      if (wallLeft === false && wallRight === true && wallDown === false) {
        plusPetitHypo = Math.min(hypoLeft, hypoDown)
      }
      if (wallLeft === false && wallRight === false && wallDown === true) {
        plusPetitHypo = Math.min(hypoLeft, hypoRight)
      }
    }
    if (direction === 'RIGHT') {
      if (wallRight === false && wallUp === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoRight, hypoUp, hypoDown)
      }
      if (wallRight === true && wallUp === false && wallDown === false) {
        plusPetitHypo = Math.min(hypoUp, hypoDown)
      }
      if (wallRight === false && wallUp === true && wallDown === false) {
        plusPetitHypo = Math.min(hypoRight, hypoDown)
      }
      if (wallRight === false && wallUp === false && wallDown === true) {
        plusPetitHypo = Math.min(hypoRight, hypoUp)
      }
    }

    if (plusPetitHypo === hypoUp && wallUp === false && direction !== 'DOWN') {
      copyPos.y -= 10
      setPos(copyPos)
      setDirection('UP')
    } else if (plusPetitHypo === hypoLeft && wallLeft === false && direction !== 'RIGHT') {
      copyPos.x -= 10
      setPos(copyPos)
      setDirection('LEFT')
    } else if (plusPetitHypo === hypoDown && wallDown === false && direction !== 'UP') {
      copyPos.y += 10
      setPos(copyPos)
      setDirection('DOWN')
    } else if (plusPetitHypo === hypoRight && wallRight === false && direction !== 'LEFT') {
      copyPos.x += 10
      setPos(copyPos)
      setDirection('RIGHT')
    }
  }
  const directionForce = (hypoUp, hypoLeft, hypoDown, hypoRight, copyPos, wallUp, wallLeft, wallDown, wallRight, setDirection, setPos) => {
    const mesHypos = [hypoUp, hypoLeft, hypoDown, hypoRight]

    const compare = (x, y) => {
      return x - y
    }

    mesHypos.sort(compare)

    let petitHypoUn = mesHypos[0]
    let petitHypoDeux = mesHypos[1]
    let petitHypoTrois = mesHypos[2]
    let petitHypoQuatre = mesHypos[3]

    if (petitHypoUn === hypoUp && wallUp === false) {
      copyPos.y -= 10
      setPos(copyPos)
      return setDirection('UP')
    } else if (petitHypoUn === hypoLeft && wallLeft === false) {
      copyPos.x -= 10
      setPos(copyPos)
      return setDirection('LEFT')
    } else if (petitHypoUn === hypoDown && wallDown === false) {
      copyPos.y += 10
      setPos(copyPos)
      return setDirection('DOWN')
    } else if (petitHypoUn === hypoRight && wallRight === false) {
      copyPos.x += 10
      setPos(copyPos)
      return setDirection('RIGHT')
    } else if (petitHypoDeux === hypoUp && wallUp === false) {
      copyPos.y -= 10
      setPos(copyPos)
      return setDirection('UP')
    } else if (petitHypoDeux === hypoLeft && wallLeft === false) {
      copyPos.x -= 10
      setPos(copyPos)
      return setDirection('LEFT')
    } else if (petitHypoDeux === hypoDown && wallDown === false) {
      copyPos.y += 10
      setPos(copyPos)
      return setDirection('DOWN')
    } else if (petitHypoDeux === hypoRight && wallRight === false) {
      copyPos.x += 10
      setPos(copyPos)
      return setDirection('RIGHT')
    } else if (petitHypoTrois === hypoUp && wallUp === false) {
      copyPos.y -= 10
      setPos(copyPos)
      return setDirection('UP')
    } else if (petitHypoTrois === hypoLeft && wallLeft === false) {
      copyPos.x -= 10
      setPos(copyPos)
      return setDirection('LEFT')
    } else if (petitHypoTrois === hypoDown && wallDown === false) {
      copyPos.y += 10
      setPos(copyPos)
      return setDirection('DOWN')
    } else if (petitHypoQuatre === hypoRight && wallRight === false) {
      copyPos.x += 10
      setPos(copyPos)
      return setDirection('RIGHT')
    } else if (petitHypoQuatre === hypoUp && wallUp === false) {
      copyPos.y -= 10
      setPos(copyPos)
      return setDirection('UP')
    } else if (petitHypoQuatre === hypoLeft && wallLeft === false) {
      copyPos.x -= 10
      setPos(copyPos)
      return setDirection('LEFT')
    } else if (petitHypoQuatre === hypoDown && wallDown === false) {
      copyPos.y += 10
      setPos(copyPos)
      return setDirection('DOWN')
    } else if (petitHypoQuatre === hypoRight && wallRight === false) {
      copyPos.x += 10
      setPos(copyPos)
      return setDirection('RIGHT')
    } else if (petitHypoQuatre === hypoRight && wallRight === false) {
      copyPos.x += 10
      setPos(copyPos)
      return setDirection('RIGHT')
    }
  }

  // TIMER DU MODE AFRAID
  let timer = useRef(null)
  useEffect(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
    }
    if (mode === 'AFRAID') {
      timer.current = setTimeout(() => {
        setAfraidRed(false)
        setAfraidPink(false)
        setAfraidBlue(false)
        setAfraidYellow(false)
        setDelayGhost(60)
        setDelayChangeMode(1000)
        setIsActive(true)
      }, 8000)
    }
    return () => clearTimeout(timer.current)
  }, [mode, posSuperPoints])

  // FONCTION TIMER 
  useEffect(() => {
    let timer = null
    if (isActive) {
      timer = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isActive])

  // GESTION FONCTION INTERVAL
  const useInterval = async (callback, delay) => {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
      checkIfDeadOrEat()
    }, [callback]);
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(movePacman, delay)
  useInterval(moveBlinky, delayGhost)
  useInterval(movePinky, delayGhost)
  useInterval(moveInky, delayGhost)
  useInterval(moveClyde, delayGhost)
  useInterval(changeMode, delayChangeMode)

  // GESTION DES DIRECTIONS & DEBUT DE PARTIE
  const keyDown = e => {
    const { keyCode } = e;

    if (keyCode === 32) {
      if (debut) {
        let newVies = [...vies]
        newVies.pop()
        setVies(newVies)
      }
      setDelayChangeMode(1000)
      setDebut(false)
      setReStart(false)
      setDelayGhost(60)
      setDelay(60)
      setIsActive(true)
    }

    if (debut === false && reStart === false) {
      if (keyCode === 37) {
        setDirectionVoulu('LEFT')
      } else if (keyCode === 38) {
        setDirectionVoulu('UP')
      } else if (keyCode === 39) {
        setDirectionVoulu('RIGHT')
      } else if (keyCode === 40) {
        setDirectionVoulu('DOWN')
      }
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    return () => {
      window.removeEventListener("keydown", keyDown);
    };
  }, [keyDown]);

  useEffect(() => {
    if (posPink.y === 210 && posPink.x === 260) {
      setIsOutPink(true)
      setRetourPink(false)
    }
  }, [retourPink, isOutPink, posPink])

  useEffect(() => {
    if (posBlue.y === 210 && posBlue.x === 260) {
      setIsOutBlue(true)
      setRetourBlue(false)
    }
  }, [retourBlue, isOutBlue, posBlue])

  useEffect(() => {
    if (posYellow.y === 210 && posYellow.x === 260) {
      setIsOutYellow(true)
      setRetourYellow(false)
    }
  }, [retourYellow, isOutYellow, posYellow])

  useEffect(() => {
    if (posRed.y === 210 && posRed.x === 260 && retourRed) {
      setRetourRed(false)
    }
  }, [retourRed, posRed])

  useLayoutEffect(() => {
    if (round === 1 && score >= 200) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 2 && score >= 100) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 3 && score >= 2800 * 3) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 4 && score >= 2800 * 4) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 5 && score >= 2800 * 5) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 6 && score >= 2800 * 6) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 7 && score >= 2800 * 7) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 8 && score >= 2800 * 8) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 9 && score >= 3000 * 9) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 10 && score >= 3000 * 10) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round === 11 && score >= 3000 * 11) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
    if (round >= 12 && score >= 3000 * 12) {
      pointsEat.current = 0
      posPoints.map(pos => {
        if (pos.x === null) {
          pointsEat.current += 1
        }
      })
      superPointsEat.current = 0
      posSuperPoints.map(pos => {
        if (pos.x === null) {
          superPointsEat.current += 1
        }
      })
    }
  }, [posPoints, posSuperPoints, score])

  useEffect(() => {
    if (retourRed) {
      setScore(score => score + 200)
    }
    if (retourPink) {
      setScore(score => score + 200)
    }
    if (retourBlue) {
      setScore(score => score + 200)
    }
    if (retourYellow) {
      setScore(score => score + 200)
    }
  }, [retourRed, retourPink, retourBlue, retourYellow])

  const fetchDB = () => {
    read()
    .then(snapshot => {
      const highscores = snapshot.docs.map(doc => doc.data())
      const highscore = highscores.map(highscore => highscore.highscore)
      const pseudo = highscores.map(highscore => highscore.pseudo)
      setHighscore(highscore[0])
      setLastWinner(pseudo[0])
    })
    .catch(err => console.log(err))
  }
  useEffect(() => {
    if (lastScore > highscore) {
      setModalVisible(true)
    }
  }, [lastScore, highscore])

  useEffect(() => {
    fetchDB()
    // eslint-disable-next-line
  }, [modalVisible, setModalVisible, lastScore])

  return (
    <div className='App'>
        {modalVisible &&
            <NewRecord setLastScore={setLastScore} setModalVisible={setModalVisible} lastScore={lastScore} highscore={highscore} />
        }
      <div className='container-score'>
        <div className='container-score-titre'>
          <span className='score-titre'>MY SCORE</span>
          <span className='score'>{score}</span>
        </div>
        <div className='container-score-titre'>
          <span className='score-titre'>HIGH SCORE</span>
          <span className='score-high'>{lastWinner} : {highscore}</span>
        </div>
      </div>
      <div className='game-area'>
        <Pacman direction={direction} posPacman={posPacman} />
        <GhostRed posRed={posRed} isAfraid={afraidRed} isRetour={retourRed} />
        <GhostPink posPink={posPink} isAfraid={afraidPink} isRetour={retourPink} />
        <GhostBlue posBlue={posBlue} isAfraid={afraidBlue} isRetour={retourBlue} />
        <GhostYellow posYellow={posYellow} isAfraid={afraidYellow} isRetour={retourYellow} />
        <Map debut={debut} setPosIntersections={setPosIntersections} setPosSuperPoints={setPosSuperPoints} setPosWalls={setPosWalls} setPosPoints={setPosPoints} setPosTeleport={setPosTeleport} />
        <Points posPoints={posPoints} />
        <SuperPoints posSuperPoints={posSuperPoints} />
      </div>
      <div className='container'>
        <Vies vies={vies} />
        {
          debut &&
          <span className='press-space'>Press SPACE to Start</span>
        }
        {
          reStart && debut === false ?
          <span className='press-space-restart'>Press SPACE to Restart</span>
          : null
        }
      </div>
    </div>
  );
}

export default App;
