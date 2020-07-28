import React, { useState, Fragment } from 'react';
import UserPool from './UserPool';
// import* as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import Moment from 'react-moment';
import { Button } from 'antd';

function SignUp(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  
    const onSubmit = event => {
        event.preventDefault();
        UserPool.signUp(email, password, [], null, (err, data) => {
            if(err) console.error(err);
            console.log(data);
        });
    }

    return(
        <Fragment>
            <form onSubmit={onSubmit}>
                <input value={email} onChange={event => setEmail(event.target.value)} type="text"/>
                <input value={password} onChange={event => setPassword(event.target.value)} type="text  "/>
                <button type="submit">Submit</button>
            </form>
        </Fragment>
    )
}
export default SignUp;