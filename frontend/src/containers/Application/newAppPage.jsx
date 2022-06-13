import React from 'react';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Dimmer, Dropdown, Form, Grid, Loader} from "semantic-ui-react";
import {createOrEditApp, progressSelector} from "../../ducks/application";
import {useState} from "react";
import {HOME_LINK} from "../../router/links";
import {getUsers, usersSelector} from "../../ducks/user";
import {unique} from "../../utils/array";

const NewAppPage = (props) => {
    const dispatch = useDispatch();
    const params = useParams();
    const loading = useSelector(progressSelector);
    const users = useSelector(usersSelector);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        season: params.id
    });
    const [userData, setUserData] = useState([]);

    const [file, setFile] = useState(null);

    const onChange = (e, {name, value}) => {
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const onChangeInputFile = (e) => {
        setFile(e.target.files[0]);
    }

    const save = () => {
        const formData = new FormData();
        formData.append('audioFile', file);
        for (let key in form) {
            formData.append(key, JSON.stringify(form[key]));
        }
        dispatch(createOrEditApp({
            formData,
            callback: () => navigate(HOME_LINK)
        }))
    }

    const searchUsers = (value) => {
      dispatch(getUsers({search: value}));
    }

    return (
        <div className='container container__center'>
            <div className='form_center'>
                {loading && <Dimmer active={loading}>
                    <Loader inverted size='large'>Loading</Loader>
                </Dimmer>}
                <h1 className='data-block__header'>
                    Подача заявки на участие
                </h1>
                <Form inverted onSubmit={save}>
                    <Grid className='form_user'>
                        <Grid.Row className='form_data'>
                            <Grid.Column width={16}>
                                <Form.Input
                                    required
                                    placeholder='Группа "Супергруппа" - Суперхит'
                                    label='Название оригинальной песни'
                                    name='originalSongName'
                                    value={form.originalSongName || ''}
                                    onChange={onChange}
                                />
                                <Form.Input
                                    required
                                    placeholder='Группа "Мы поем" - Суперхит'
                                    label='Название конкурсной заявки'
                                    name='songName'
                                    value={form.songName || ''}
                                    onChange={onChange}
                                />

                                <Form.Input
                                    type='file'
                                    required
                                    label='Аудиофайл'
                                    name='audioFile'
                                    onChange={onChangeInputFile}
                                    accept=".mp3, .m4a, .flac, .wav, .wma"
                                />

                                <Form.Field>
                                    <label>Заявка подается совместно с</label>
                                    <Dropdown
                                        options={unique([...(users.rows || []), ...userData]).map(u => {
                                            return {key: u.id, text: u.name + " " + u.surname, value: u.id}
                                        })}
                                        placeholder='Поиск пользователя'
                                        search
                                        selection
                                        fluid
                                        multiple
                                        value={form.users || []}
                                        onSearchChange={(e, { searchQuery }) => searchUsers(searchQuery)}
                                        onChange={(e, {value}) => {
                                            onChange(e, {name: 'users', value: value});
                                            let id = value.find(v => !(form.users || []).includes(v));
                                            if (id) {
                                                let u = users.rows.find(u => u.id === id);
                                                setUserData([...userData, u])
                                            }
                                        }}
                                    />
                                </Form.Field>



                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        <Grid.Row className='btn-block'>
                            <Grid.Column width={16}>
                                <Form.Button
                                    className='form-btn'
                                    loading={loading}
                                    disabled={loading}
                                    color='violet'
                                    content='Сохранить'/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>

            </div>
        </div>
    );
}

export default NewAppPage;