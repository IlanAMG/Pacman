import React from 'react'
import pinkRight from '../ASSETS/pinkRight.png'
import afraidGhost from '../ASSETS/afraidGhost.png'
import eyes from '../ASSETS/eyes.png'

export const GhostPink = ({posPink, isAfraid, isRetour}) => {
 
        if (isAfraid && isRetour === false) {
            return  <img alt='ghost' className='pinkRight' src={afraidGhost} style={{top: `${posPink.y}px`, left:`${posPink.x}px`}}/>
        } else if (isAfraid === false && isRetour) {
            return <img alt='ghost' className='pinkRight' src={eyes} style={{top: `${posPink.y}px`, left:`${posPink.x}px`}}/>
        } else {
            return <img alt='ghost' className='pinkRight' src={pinkRight} style={{top: `${posPink.y}px`, left:`${posPink.x}px`}}/>
        }

}