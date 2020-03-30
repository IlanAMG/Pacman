import React from 'react'

export const SuperPoints = React.memo( ({ posSuperPoints }) => {

    return (
        <>
            {
                posSuperPoints.map((posSuperPoint) => {
                    if (posSuperPoint.x !== null || posSuperPoint.y !== null) {
                        return (
                            <div className='path' style={{ top: `${posSuperPoint.y}px`, left: `${posSuperPoint.x}px` }}>
                                <div className='bonus'></div>
                            </div>
                        )
                    }
                })
            }
        </>
    )
})