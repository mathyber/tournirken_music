import React, {useEffect, useState} from 'react';
import {Form, Grid, Input} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {
    banUserById, isAdminSelector,
    newPassword as newPasswordRequest, newRoleForUser,
    saveProgressSelector,
    updateUser
} from "../../ducks/user";
import {useParams} from "react-router";

const UserForm = ({formData = {}, isUserPage}) => {

    const dispatch = useDispatch();
    const params = useParams();
    const loading = useSelector(saveProgressSelector);
    const isAdmin = useSelector(isAdminSelector);
    const [form, setForm] = useState(formData);

    useEffect(() => {
        setForm(formData);
    }, [formData]);

    const [errors, setErrors] = useState([]);

    const onChange = (e, {name, value}) => {
        setErrors(errors.filter(e => e !== name));
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const saveNewPassword = () => {
        const {password, newPassword} = form;
        dispatch(newPasswordRequest({
            form: {
                password,
                newPassword
            }
        }))
    };

    const saveProfile = () => {
        dispatch(updateUser({form}))
    };

    const banUser = (e) => {
        e.stopPropagation();
        dispatch(banUserById({id: params.id, callback: () => window.location.reload()}))
    }

    const setRole = (e) => {
        e.stopPropagation();
        dispatch(newRoleForUser({
            id: params.id,
            form: {roleName: !form.roles.includes('ADMIN') ? 'ADMIN' : 'USER'},
            callback: () => window.location.reload()
        }))
    }

    return (
        <Grid className='form_user'>
            <Grid.Row>
                <Grid.Column width={isUserPage ? 16 : 8}>
                    <Form className='' onSubmit={saveProfile}>
                        <Form.Input
                            label='Имя'
                            name='name'
                            value={form.name}
                            onChange={onChange}
                            disabled={isUserPage}
                        />
                        <Form.Input
                            label='Фамилия'
                            name='surname'
                            value={form.surname}
                            onChange={onChange}
                            disabled={isUserPage}
                        />
                        <Form.Input
                            label='Псевдоним'
                            name='alias'
                            value={form.alias}
                            onChange={onChange}
                            disabled={isUserPage}
                        />
                        <Form.Input
                            label='E-mail'
                            name='email'
                            type='email'
                            value={form.email}
                            onChange={onChange}
                            disabled={isUserPage}
                        />
                        <Form.Field>
                            <label>Ссылка на профиль ВКонтакте</label>
                            <Input
                                label='vk.com/'
                                name='vk'
                                value={form.vk}
                                onChange={onChange}
                                disabled={isUserPage}
                            />
                        </Form.Field>
                        {!isUserPage &&
                            <Form.Button loading={loading} disabled={loading} style={{width: '100%'}} color='violet'
                                         content='Сохранить изменения'/>}

                        {isUserPage && isAdmin && form.isActive &&
                            <Form.Button onClick={banUser} loading={loading} disabled={loading} style={{width: '100%'}}
                                         icon='ban' color='red'
                                         content='Заблокировать аккаунт'/>}

                        {isUserPage && isAdmin && form.isActive &&
                            <Form.Button onClick={setRole} loading={loading} disabled={loading} style={{width: '100%'}}
                                         color='green'
                                         content={!form.roles.includes('ADMIN') ? 'Назначить администратором' : 'Снять роль администратора'}/>}
                    </Form>
                </Grid.Column>

                {!isUserPage && <Grid.Column width={8}>
                    <Form onSubmit={saveNewPassword}>
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
                            error={errors.includes('newPassword')}
                            label='Новый пароль'
                            name='newPassword'
                            type='password'
                            value={form.newPassword}
                            onChange={onChange}
                        />
                        <Form.Button loading={loading} disabled={loading} style={{width: '100%'}} color='violet'
                                     content='Изменить пароль'/>
                    </Form>
                </Grid.Column>}
            </Grid.Row>
        </Grid>
    )
};

export default UserForm;
