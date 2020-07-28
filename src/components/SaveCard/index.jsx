import React, { Fragment } from 'react';
import plusBlue from '../../assets/images/plus-blue.png';
import ellipsisGrey from '../../assets/images/ellipsis-vgrey.png';
import './styles.css'

function SavaCard({heading, additionalPoints, contents}){
    return(
        <Fragment>
        {contents.map((content, index) => (
            <div className="savecard_container" key={index}>
                <div className="savecard_header">
                    <p>{heading}</p>
                    {additionalPoints && 
                    <div className="img_wrapper">
                        <img src={plusBlue} alt="additional_row"/>
                        <img src={ellipsisGrey} alt="additional_point"/>
                    </div>}
                </div>
                <div>
                    {content}
                </div>
            </div>
            ))}
        </Fragment>
    )
}
export default SavaCard;