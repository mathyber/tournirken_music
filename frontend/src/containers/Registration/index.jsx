import React, {useState} from 'react';
import {Checkbox, Form, Input} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {regProgressSelector, regUser} from "../../ducks/user";
import {HOME_LINK, PERSONAL_LINK} from "../../router/links";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const Registration = () => {

    const dispatch = useDispatch();
    const loading = useSelector(regProgressSelector);
    let navigate = useNavigate();


    const [form, setForm] = useState({
        email: '',
        surname: '',
        name: '',
        vk: '',
        password: '',
        password2: '',
        pdCheckbox: false,
        reCaptcha: false
    });

    const [errors, setErrors] = useState([]);

    const onChange = (e, {name, value}) => {
        setErrors(errors.filter(e => e !== name));
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const onSubmit = () => {
        if (form.password !== form.password2) {
            setErrors(['password', 'password2']);
            toast.error('Пароли не совпадают!')
        } else if (!form.pdCheckbox) {
            toast.error('Примите условия политики обработки персональных данных')
        } else if (!form.reCaptcha) {
            toast.error('Пройдите проверку на робота')
        } else dispatch(regUser({
            form,
            callback: () => navigate(HOME_LINK)
        }));
    }

    return (
        <div className='container container__center'>
            <div className='form_center'>
                <Form className='form-login' onSubmit={onSubmit}>
                    <Form.Input
                        required
                        label='Имя'
                        name='name'
                        value={form.name}
                        onChange={onChange}
                    />
                    <Form.Input
                        required
                        label='Фамилия'
                        name='surname'
                        value={form.surname}
                        onChange={onChange}
                    />
                    <Form.Input
                        required
                        label='E-mail'
                        name='email'
                        type='email'
                        value={form.email}
                        onChange={onChange}
                    />
                    <Form.Field>
                        <label>Ссылка на профиль ВКонтакте</label>
                        <Input
                            label='vk.com/'
                            name='vk'
                            value={form.vk}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Input
                        required
                        error={errors.includes('password')}
                        label='Пароль'
                        name='password'
                        type='password'
                        value={form.password}
                        onChange={onChange}
                    />
                    <Form.Input
                        required
                        error={errors.includes('password2')}
                        label='Повторите пароль'
                        name='password2'
                        type='password'
                        value={form.password2}
                        onChange={onChange}
                    />
                    <Form.Field
                        control={Checkbox}
                        checked={form.pdCheckbox}
                        onChange={(e) => onChange(e, {name: 'pdCheckbox', value: !form.pdCheckbox})}
                        label={{children: <div> <span style={{color: "red"}}>*</span> Я даю согласие на обработку персональных данных в соответствии с <a href={PERSONAL_LINK}>политикой</a></div>}}
                    />
                    <Form.Field>
                        <ReCAPTCHA
                            sitekey="6LcxoaMZAAAAANucfHAq3UK9ymNQEZ6WJlgIGLg-"
                            onChange={(value) => onChange(null, {name: 'reCaptcha', value})}
                        />
                    </Form.Field>
                    <Form.Button loading={loading} disabled={loading} style={{width: '100%'}} color='violet' content='Зарегистрироваться'/>
                </Form>
            </div>
        </div>
    )
};

export default Registration;
