import React from 'react'

export const Vies = React.memo( ({ vies }) => {
    return (
        <div className='vies-container'>
            {
                vies.map(() => {
                    return (
                        <svg className='vie-container'>
                            <circle cx="50%" cy="50%" r="25%" />
                        </svg>
                    )
                })
            }
        </div>
    )
})
