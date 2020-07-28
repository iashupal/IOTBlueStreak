import React from 'react';
import './styles.css';
import {Divider} from 'antd';

function Heading({clientName, heading, count, fontSize}){
    return(
        <div className="heading">
            <h3 style={{fontSize}}>{clientName} <strong>{heading}</strong></h3> 
            <div className="clients_count">
               { count && <Divider type="vertical"/> }
                {count}
            </div>
        </div>
    )
}
export default Heading;