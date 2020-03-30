import React from 'react'
import yellowRight from '../ASSETS/yellowRight.png'
import afraidGhost from '../ASSETS/afraidGhost.png'
import eyes from '../ASSETS/eyes.png'

export const GhostYellow = ({posYellow, isAfraid, isRetour}) => {
 
        if (isAfraid && isRetour === false) {
            return  <img alt='ghost' className='yellowRight' src={afraidGhost} style={{top: `${posYellow.y}px`, left:`${posYellow.x}px`}}/>
        } else if (isAfraid === false && isRetour) {
            return <img alt='ghost' className='yellowRight' src={eyes} style={{top: `${posYellow.y}px`, left:`${posYellow.x}px`}}/>
        } else {
            return <img alt='ghost' className='yellowRight' src={yellowRight} style={{top: `${posYellow.y}px`, left:`${posYellow.x}px`}}/>
        }

}
