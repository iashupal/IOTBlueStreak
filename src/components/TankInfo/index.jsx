import React from 'react';
import './styles.css';
import { Divider } from 'antd';

function TankInfo({tankHead, tankDetail}){
    return(
        <div className="tank_details">
            <div className="tank_head">{tankHead} <Divider type="vertical"/></div>
            
            <p className="tank_head">{tankDetail}</p>
        </div>
    );
}
export default TankInfo;
