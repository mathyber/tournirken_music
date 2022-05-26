import React, {useState} from 'react';
import {Form} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {login, loginProgressSelector} from "../../ducks/user";
import {HOME_LINK} from "../../router/links";
import {useNavigate} from "react-router";

const Login = () => {

    const dispatch = useDispatch();
    const loading = useSelector(loginProgressSelector);
    let navigate = useNavigate();


    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const onChange = (e, {name, value}) => {
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const onSubmit = () => {
        dispatch(login({
            form,
            callback: () => navigate(HOME_LINK)
        }));
    }

    return (
        <div className='container container__center'>
            <div className='form_center'>
                <Form className='form-login' onSubmit={onSubmit}>
                    <Form.Input
                        placeholder='E-mail'
                        name='email'
                        type='email'
                        value={form.email}
                        onChange={onChange}
                    />
                    <Form.Input
                        placeholder='Пароль'
                        name='password'
                        type='password'
                        value={form.password}
                        onChange={onChange}
                    />
                    <Form.Button loading={loading} style={{width: '100%'}} color='violet' content='Войти'/>
                </Form>
            </div>
        </div>
    )
};

export default Login;
