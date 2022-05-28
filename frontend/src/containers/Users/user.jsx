import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {userById, userSelector} from "../../ducks/user";
import UserForm from "./userForm";
import {useLocation} from "react-router-dom";
import {Icon} from "semantic-ui-react";
import {useParams} from "react-router";

const User = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const profile = useSelector(userSelector);
    const params = useParams();

    useEffect(() => {
        dispatch(userById({id: params.id}))
    }, [location]);

    return (
        <div className='container container__center'>
            <div className='form_center'>
                <h1>
                    Пользователь {`${profile.name} ${profile.surname}`} {profile.alias ? `(${profile.alias})` : ''}
                    {!profile.isActive && <Icon color='red' name='ban'/>}
                </h1>
                <UserForm formData={profile} isUserPage/>
            </div>
        </div>
    )
};

export default User;
