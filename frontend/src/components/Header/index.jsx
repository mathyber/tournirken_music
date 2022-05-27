import React, {useEffect, useState} from 'react';
import './styles.scss';
import {Button, Icon, Menu} from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import {HOME_LINK, LOGIN_LINK} from "../../router/links";
import {useDispatch, useSelector} from "react-redux";
import {isAuthSelector, logout, profile, profileSelector} from "../../ducks/user";
import {useNavigate} from "react-router";

const Header = () => {

    const location = useLocation();
    const dispatch = useDispatch();

    const [activeItem, setActiveItem] = useState('');
    const isAuth = useSelector(isAuthSelector);
    const profileData = useSelector(profileSelector);

    let navigate = useNavigate();

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        isAuth && dispatch(profile());
    }, [isAuth]);

    const onLogout = () => {
        dispatch(logout());
    }

    return (
        <div className='header'>
            <Menu inverted color='violet'>
                <Menu.Item active={activeItem === HOME_LINK}>
                    TOURNIRKEN MUSIC
                </Menu.Item>

                {isAuth && <Menu.Item
                    position='right'
                    name='Пользователь'
                >
                    {profileData.name+" "+profileData.surname}
                    <Button title='Выйти' inverted color='violet' className='button-exit' size='mini' compact onClick={onLogout} icon='sign-out'/>
                </Menu.Item>}

                {!isAuth && <Menu.Item
                    position='right'
                    name='Пользователь'
                >
                    Гость
                    <Button title='Войти' inverted color='violet' className='button-exit' size='mini' compact onClick={()=>navigate(LOGIN_LINK)} icon='sign in'/>
                </Menu.Item>}
            </Menu>
        </div>
    )
};

export default Header;