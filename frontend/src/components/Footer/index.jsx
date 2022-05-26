import React, {useEffect, useState} from 'react';
import './styles.scss';
import {Segment} from "semantic-ui-react";

const Footer = () => {

    return (
        <div className='footer'>
            <Segment inverted>
                by <a style={{color: 'white'}} href={'https://github.com/mathyber'}>mathyber</a>, 2022
            </Segment>
        </div>
    )
};

export default Footer;