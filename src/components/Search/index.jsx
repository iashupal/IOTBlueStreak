import React from 'react';
import {Button} from 'antd';
import { SaveOutlined} from '@ant-design/icons';
import search from '../../assets/images/Search-grey.png';
import './styles.css';

const Search = ({styleName, onChange, onKeyPress, value, placeholder, saveIcon,  saveiconStyle}) => {
    return(
        <div className={`inputBox ${styleName}`}>
            <img src={search} alt="search" style={{width: '25px', paddingLeft: 10}}/>
            <input
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                onKeyPress={onKeyPress}
                defaultValue={value}
            />
            {saveIcon && <Button type="link" icon={<SaveOutlined className={`${saveiconStyle}`} style={{float: 'right', fontSize: 18, color: 'var(--color-greyiesh)'}}/>}></Button>}
        </div>
    )
}
export default Search;

Search.defaultProps = {
    styleName: '',
    value: '',
  };