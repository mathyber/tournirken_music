import React from 'react';
import {useSelector} from "react-redux";
import {profileSelector} from "../../ducks/user";
import UserForm from "./userForm";

const Profile = () => {

    const profile = useSelector(profileSelector);

    return (
        <div className='container container__center'>
            <div className='form_center'>
                <h1>
                    Профиль
                </h1>
                <UserForm formData={profile}/>
            </div>
        </div>
    )
};

export default Profile;
