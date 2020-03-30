import React from 'react'

export const Points = React.memo( ({ posPoints }) => {

    return (
        <>{
            
            posPoints.map((posPoint) => {
                if (posPoint.x !== null || posPoint.y !== null) {
                    return (
                        <div className='path' style={{ top: `${posPoint.y}px`, left: `${posPoint.x}px` }}>
                            <div className='point'></div>
                        </div>
                    )
                }
            })
        } </>
    )
})
