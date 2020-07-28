import React from 'react';
import './styles.css';

function Badge({badgeImg, countAlert}){
    return(
        <div className="badge">
            <img src={badgeImg} alt="badgeImg"/>
            <p>{countAlert}</p>
        </div>
    )
}
export default Badge;