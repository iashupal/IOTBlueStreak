import React from 'react';
import './styles.css';

function ArrowButton({iconName, backgroundColor, onClick}){
    return(
            <i className={`arrow_btn fas ${iconName}`} style={{backgroundColor}} onClick={onClick} />
    )
}
export default ArrowButton;
