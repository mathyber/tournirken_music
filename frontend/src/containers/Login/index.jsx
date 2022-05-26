import React, {useState} from 'react';
import {Container, Form} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {login, loginProgressSelector} from "../../ducks/user";

const Login = () => {

    const dispatch = useDispatch();
    const loading = useSelector(loginProgressSelector);

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
        dispatch(login(form));
    }

    return (
        <div className='container'>
            <Form onSubmit={onSubmit}>
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
    )
};

export default Login;
