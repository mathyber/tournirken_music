import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {
    getSeason,
    getStage,
    progressSelector,
    saveStage,
    seasonSelector,
    setJury,
    stageSelector
} from "../../ducks/season";
import {getUsers, isAdminSelector, usersSelector} from "../../ducks/user";
import {Button, Dimmer, Dropdown, Form, Grid, Label, Loader, Segment, Table} from "semantic-ui-react";
import {appsSelector, getApps, setStagesApps} from "../../ducks/application";
import {COUNT_ITEMS} from "../../constants";
import {toast} from "react-toastify";
import pkg from "../../../package.json";
import {RESULT_LINK, STAGE_LINK, USER_LINK} from "../../router/links";
import {unique} from "../../utils/array";

const StageSettings = ({}) => {

    //const data = useSelector(state=>infoSelector(state));
    //console.log(data)

    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const loading = useSelector(progressSelector);
    const seasonData = useSelector(seasonSelector);
    const [userData, setUserData] = useState([]);
    const users = useSelector(usersSelector);

    const stageData = useSelector(stageSelector);

    const isAdmin = useSelector(isAdminSelector);
    const appsData = useSelector(state => appsSelector(state));

    const [form, setForm] = useState({});

    const onChange = (e, {name, value}) => {
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const searchUsers = (value) => {
        dispatch(getUsers({search: value}));
    }

    useEffect(() => {
        params?.id && dispatch(getStage(params.id));
    }, [params]);


    useEffect(() => {
        isAdmin && stageData && stageData.seasonId && stageData.nextStage && loadData(stageData.seasonId);
    }, [stageData]);

    const loadData = (id) => {
        dispatch(getApps({
            page: 0,
            limit: 1000000,
            seasonId: id,
            state: 'ACCEPTED'
        }));
    }

    const [participants, setParticipants] = useState([]);
    const [apps, setApps] = useState([]);

    useEffect(() => {
        stageData?.applications && setParticipants(stageData.applications.map(app => ({app: app.id})));
        stageData?.users && onChange(null, {name: 'users', value: stageData.users.map(u => u.id)});
    }, [stageData]);

    useEffect(() => {
        setApps({
            rows: unique([...(stageData?.applications ? stageData.applications.map(app => app) : []), ...(appsData.rows || [])])
        });
    }, [appsData, stageData]);

    const save = () => {
        dispatch(saveStage({
            id: params.id,
            apps: participants.map((p, i) => ({
                app: p.app,
                number: i + 1
            }))
        }))
        dispatch(setJury({
            id: params.id,
            juries: form.users || []
        }))
    };

    const addPtr = (id) => {
        setParticipants(participants => ([
            ...participants,
            {
                app: id
            }
        ]))
    };

    const delPtr = (id) => {
        setParticipants(participants => (participants.filter(p => p.app !== id)));
    };

    const row = (app, isNew, indx) => {

        const isDsq = app.applicationStateId === 6;

        return <Table.Row key={'key_'+app.id} className={isDsq && 'table-row_dsq'}>
            <Table.Cell>
                <b>{!isNew && indx}</b>
            </Table.Cell>
            <Table.Cell>
                <audio controls>
                    <source src={`${pkg.proxy}/${app?.audioFile}`}
                            type="audio/mpeg"/>
                </audio>
            </Table.Cell>
            {isAdmin && <Table.Cell>
                {app.users?.map((user, index) => (
                    <div key={user.id + "_" + index}>
                        <a style={{color: 'white'}}
                           href={USER_LINK.replace(':id', user.id)}>
                            {`${user.name} ${user.surname}`}
                            {user.alias && `(${user.alias})`}
                        </a>
                    </div>
                ))}
            </Table.Cell>}
            <Table.Cell>
                {app.originalSongName}
            </Table.Cell>
            <Table.Cell>
                {app.songName}
            </Table.Cell>
            {isAdmin && <Table.Cell>
                {isNew && !isDsq && <Button
                    disabled={stageData.count && stageData.count <= participants.length}
                    color='green' className='m-b-5' icon='plus'
                    onClick={() => addPtr(app.id)}/>}
                {
                    !isNew && <Button color='red' className='m-b-5' icon='delete'
                                      onClick={() => delPtr(app.id)}/>
                }
            </Table.Cell>}
        </Table.Row>
    }

    return (
        <div className='container'>
            {loading && <Dimmer active={loading}>
                <Loader inverted size='large'>Loading</Loader>
            </Dimmer>}
            <h1>Стадия: {stageData.name}, сезон: {stageData.season?.name}</h1>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <h2>Участники {participants.length}/{stageData.count}</h2>
                        <div className='data-block__table'>
                            <Table inverted color="violet">
                                <Table.Header className='table__header'>
                                    <Table.Row>
                                        <Table.HeaderCell/>
                                        <Table.HeaderCell>
                                            Аудио
                                        </Table.HeaderCell>
                                        {isAdmin && <Table.HeaderCell>
                                            Участник(и)
                                        </Table.HeaderCell>}
                                        <Table.HeaderCell>
                                            Песня-оригинал
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Название заявки
                                        </Table.HeaderCell>
                                        {isAdmin && <Table.HeaderCell/>}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        (participants || []).map((prt, index) => {
                                            const app = apps.rows.find(a => a.id === prt.app) || {};
                                            return row(app, false, index+1)
                                        })
                                    }
                                </Table.Body>
                            </Table>
                        </div>

                        {isAdmin && <>
                            <h2>Добавить из списка:</h2>
                            <div className='data-block__table'>
                                <Table inverted color='grey'>
                                    <Table.Header className='table__header'>
                                        <Table.Row>
                                            <Table.HeaderCell/>
                                            <Table.HeaderCell>
                                                Аудио
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Участник(и)
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Песня-оригинал
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Название заявки
                                            </Table.HeaderCell>
                                            {isAdmin && <Table.HeaderCell/>}
                                        </Table.Row>
                                    </Table.Header>
                                    {
                                        (apps.rows || []).filter(a => !participants.map(prt => prt.app).includes(a.id)).map((app, index) => {
                                            console.log(app)
                                            return row(app, true)
                                        })
                                    }
                                </Table>
                            </div>
                        </>}

                    </Grid.Column>

                    <Grid.Column width={6}>

                        {isAdmin && <Grid.Column width={12}>
                            <Button className='form-btn m-b-5' color='green'
                                    onClick={() => navigate(RESULT_LINK.replace(':id', params.id))}
                                    type='button'>Открыть страницу голосующих</Button>
                        </Grid.Column>}

                        <Segment color={'violet'} inverted padded>
                            <Label color={'violet'} attached='top'>Описание</Label>
                            <div>
                                Дата и время начала
                                голосования: <b>{stageData.startVote && `${new Date(stageData.startVote).toLocaleDateString()} ${new Date(stageData.startVote).toLocaleTimeString()}`}</b>
                            </div>
                            <div>
                                Дата и время завершения
                                голосования: <b>{stageData.endVote && `${new Date(stageData.endVote).toLocaleDateString()} ${new Date(stageData.endVote).toLocaleTimeString()}`}</b>
                            </div>
                            <div>
                                Система голосования: <b>{`${stageData.juryPercent}%/${100 - stageData.juryPercent}`}% -
                                жюри/зрители</b>
                            </div>
                            {stageData.nextStage && <div>
                                Проходящих дальше: <b>{stageData.winCount}</b>
                            </div>}
                            {stageData.secondChanceStage && <div>
                                Проходящих во второй шанс: <b>{stageData.secondChanceCount}</b>
                            </div>}
                        </Segment>
                        <Grid.Row>
                            <Form.Field className='m-b-5'>
                                <label>Члены жюри</label>
                                <Dropdown
                                    disabled={!isAdmin}
                                    options={unique([...(users.rows || []),...(stageData.users || []), ...userData]).map(u => {
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
                            <Grid.Column width={12}>
                                {isAdmin && <Button className='form-btn m-b-5' color='violet'
                                         onClick={save}
                                         type='button'>Сохранить</Button>}
                            </Grid.Column>
                            {/*<Grid.Column width={12}>*/}
                            {/*    <Button className='form-btn m-b-5' color='violet'*/}
                            {/*        //onClick={() => navigate(STAGE_LINK.replace(':id', sf.id))}*/}
                            {/*            type='button'>Начать голосование прямо сейчас</Button>*/}
                            {/*</Grid.Column>*/}
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        </div>
    )
};

export default StageSettings;
