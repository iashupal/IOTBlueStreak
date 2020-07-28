import React, { Fragment } from 'react';
import './styles.css';

function ContentCard({contents, styleName }){
    return(
        <Fragment>
        {contents.map((content, index) => (
            <div className={`card_wrapper ${styleName}`} key={index}>
                {content}
            </div>
            ))}
        </Fragment>
    )
}
export default ContentCard;