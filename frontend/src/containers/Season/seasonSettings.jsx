import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {getSeason, progressSelector, seasonSelector} from "../../ducks/season";
import {isAdminSelector} from "../../ducks/user";
import {Button, Dropdown, Form, Grid, Label, Segment} from "semantic-ui-react";
import {appsSelector, getApps, setStagesApps} from "../../ducks/application";
import {COUNT_ITEMS} from "../../constants";
import {toast} from "react-toastify";
import {STAGE_LINK} from "../../router/links";

const SeasonSettings = ({semifinalsSettings}) => {

    //const data = useSelector(state=>infoSelector(state));
    //console.log(data)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const loading = useSelector(progressSelector);
    const seasonData = useSelector(seasonSelector);
    const isAdmin = useSelector(isAdminSelector);
    const apps = useSelector(state => appsSelector(state));

    const [form, setForm] = useState({});


    const onChange = (e, {name, value}) => {
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const setAppsToStage = (value, id) => {
        onChange(null, {
            name: 'stages',
            value: {
                ...form.stages,
                [id]: value
            }
        })
    };

    console.log(seasonData)

    useEffect(() => {
        params?.id && dispatch(getSeason(params.id));
        loadData();
    }, [params]);

    const loadData = () => {
        dispatch(getApps({
            page: 0,
            limit: 1000000,
            seasonId: params.id,
            state: 'ACCEPTED'
        }));
    }

    console.log(form)

    const options = (id) => {

        let appRows = apps.rows || [];
        let usersIdsInOthers = [];
        const dataStages = form.stages || {};
        for (let key in dataStages) {
            if (key != id) {
                usersIdsInOthers.push(...(dataStages[key] || []));
            }
        }

        let filter = appRows.filter(r => !usersIdsInOthers.includes(r.id)).map(u => ({
            value: u.id,
            name: u.id,
            text: `${u.songName} (${u.users.map((us) => us.name + " " + us.surname)})`
        }))

        return filter;
    }

    const save = () => {
        console.log('save', form)
    };

    const saveStages = () => {
        dispatch(setStagesApps({
            form,
            callback: () => console.log()
        }))
    }

    return (
        <div className='container'>
            <h1>Сезон: {seasonData.name}</h1>
            <Form inverted onSubmit={saveStages}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Segment color={'violet'} inverted padded>
                                <Label color={'violet'} attached='top'>Описание</Label>
                                <div>
                                    Дата и время начала подачи
                                    заявок: <b>{seasonData.dateStart && `${new Date(seasonData.dateStart).toLocaleDateString()} ${new Date(seasonData.dateStart).toLocaleTimeString()}`}</b>
                                </div>
                                <div>
                                    Дата и время завершения подачи
                                    заявок: <b>{seasonData.dateEnd && `${new Date(seasonData.dateEnd).toLocaleDateString()} ${new Date(seasonData.dateEnd).toLocaleTimeString()}`}</b>
                                </div>
                                <div>
                                    Количество полуфиналов: <b>{seasonData.semifinals?.length}</b>
                                </div>
                                <div>
                                    Наличие второго шанса: <b>{seasonData.secondChance ? 'Да' : 'Нет'}</b>
                                </div>
                            </Segment>
                            {
                                seasonData.semifinals.map(sf => (
                                    <Grid.Row>
                                        <Grid.Column width={12}>
                                            <Button className='form-btn m-b-5' color='violet'
                                                    onClick={() => navigate(STAGE_LINK.replace(':id', sf.id))}
                                                    type='button'>{sf.name}</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                ))
                            }
                            {
                                seasonData.secondChance &&
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Button className='form-btn m-b-5' color='violet'
                                                onClick={() => navigate(STAGE_LINK.replace(':id', seasonData.secondChance.id))}
                                                type='button'>{seasonData.secondChance.name}</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            }
                            {
                                seasonData.final &&
                                <Grid.Row>
                                    <Grid.Column width={6}>
                                        <Button className='form-btn m-b-5' color='violet'
                                                onClick={() => navigate(STAGE_LINK.replace(':id', seasonData.final.id))}
                                                type='button'>{seasonData.final.name}</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            }

                        </Grid.Column>
                        {/*{semifinalsSettings && <Grid.Column width={10}>*/}

                        {/*    {*/}
                        {/*        seasonData.semifinals.map(sf => (*/}
                        {/*            <Form.Field>*/}
                        {/*                <label>{sf.name} -*/}
                        {/*                    участников: {form.stages ? (form.stages[sf.id] || []).length : 0}/{sf.count || '-'}</label>*/}
                        {/*                <Dropdown*/}
                        {/*                    style={{width: '100%'}}*/}
                        {/*                    options={options(sf.id)}*/}
                        {/*                    search*/}
                        {/*                    selection*/}
                        {/*                    fluid*/}
                        {/*                    multiple*/}
                        {/*                    value={form.stages ? form.stages[sf.id] : null}*/}
                        {/*                    onChange={(e, {value}) => (!sf.count || (value.length <= sf.count)) ?*/}
                        {/*                        setAppsToStage(value, sf.id) : toast.error(`Нельзя добавить больше ${sf.count}`)*/}
                        {/*                    }*/}
                        {/*                />*/}
                        {/*            </Form.Field>*/}
                        {/*        ))*/}
                        {/*    }*/}
                        {/*</Grid.Column>}*/}

                    </Grid.Row>
                </Grid>
                {/*<Grid>*/}
                {/*    {isAdmin && <Grid.Row className='btn-block'>*/}
                {/*        <Grid.Column width={4}>*/}
                {/*            <Form.Button*/}
                {/*                className='form-btn'*/}
                {/*                loading={loading}*/}
                {/*                disabled={loading}*/}
                {/*                color='violet'*/}
                {/*                content='Сохранить'/>*/}
                {/*        </Grid.Column>*/}
                {/*    </Grid.Row>}*/}
                {/*</Grid>*/}
            </Form>
        </div>
    )
};

export default SeasonSettings;
