import React from 'react'
import blueRight from '../ASSETS/blueRight.png'
import afraidGhost from '../ASSETS/afraidGhost.png'
import eyes from '../ASSETS/eyes.png'

export const GhostBlue = ({posBlue, isAfraid, isRetour}) => {
 
        if (isAfraid && isRetour === false) {
            return  <img alt='ghost' className='blueRight' src={afraidGhost} style={{top: `${posBlue.y}px`, left:`${posBlue.x}px`}}/>
        } else if (isAfraid === false && isRetour) {
            return <img alt='ghost' className='blueRight' src={eyes} style={{top: `${posBlue.y}px`, left:`${posBlue.x}px`}}/>
        } else {
            return <img alt='ghost' className='blueRight' src={blueRight} style={{top: `${posBlue.y}px`, left:`${posBlue.x}px`}}/>
        }

}
