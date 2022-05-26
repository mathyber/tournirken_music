import React, {useEffect, useState} from 'react';
import './styles.scss';
import {Menu} from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import {HOME_LINK} from "../../router/links";

const Header = () => {

    const location = useLocation();

    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    return (
        <div className='header'>
            <Menu inverted color='violet'>
                <Menu.Item active={activeItem === HOME_LINK}>
                    TOURNIRKEN MUSIC
                </Menu.Item>
            </Menu>
        </div>
    )
};

export default Header;