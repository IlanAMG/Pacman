import React from 'react'

export const Pacman = ({ direction, posPacman }) => {
    return (
        <svg className={`pacman-${direction}`} style={{top: `${posPacman.y}px`, left:`${posPacman.x}px`}}>
            <circle className='pacman' cx="50%" cy="50%" r="25%"/>
        </svg>
    )
}
