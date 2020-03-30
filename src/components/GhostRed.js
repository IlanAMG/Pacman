import React from 'react'
import redRight from '../ASSETS/redRight.png'
import afraidGhost from '../ASSETS/afraidGhost.png'
import eyes from '../ASSETS/eyes.png'

export const GhostRed = ({posRed, isAfraid, isRetour}) => {
 
        if (isAfraid && isRetour === false) {
            return  <img alt='ghost' className='redRight' src={afraidGhost} style={{top: `${posRed.y}px`, left:`${posRed.x}px`}}/>
        } else if (isAfraid === false && isRetour) {
            return <img alt='ghost' className='redRight' src={eyes} style={{top: `${posRed.y}px`, left:`${posRed.x}px`}}/>
        } else {
            return <img alt='ghost' className='redRight' src={redRight} style={{top: `${posRed.y}px`, left:`${posRed.x}px`}}/>
        }

}
