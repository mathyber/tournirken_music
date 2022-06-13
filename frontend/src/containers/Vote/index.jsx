import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Form, Grid, Label, Message, Table} from "semantic-ui-react";
import {useParams} from "react-router";
import {getStage, seasonSelector, stageSelector} from "../../ducks/season";
import {isAdminSelector} from "../../ducks/user";
import {appsSelector} from "../../ducks/application";
import {useEffect} from "react";
import pkg from "../../../package.json";
import {getVoteSystem, isJurySelector, progressSelector, setVotePoints, voteSystemSelector} from "../../ducks/vote";

const Vote = () => {

    //const data = useSelector(state=>infoSelector(state));
    //console.log(data)

    const dispatch = useDispatch();
    const params = useParams();
    const loading = useSelector(progressSelector);
    // const seasonData = useSelector(seasonSelector);

    const stageData = useSelector(stageSelector);
    const {points: voteSystemPrev = [], isJury, voteOpen} = useSelector(voteSystemSelector);
    const [voteSystem, setVoteSystem] = useState(voteSystemPrev);
    // const isAdmin = useSelector(isAdminSelector);
    // const appsData = useSelector(state => appsSelector(state));

    useEffect(() => {
        //params?.id && dispatch(getSeason(params.id));
        params?.id && dispatch(getStage(params.id));
        dispatch(getVoteSystem({
            id: params.id
        }));
    }, [params]);

    useEffect(() => {
        const l = stageData?.applications?.filter(a => a.applicationStateId !== 6).length;
        if (l < voteSystemPrev.length) {
            let vS = [...voteSystemPrev];
            vS.splice(0, voteSystemPrev.length - l);
            console.log(vS)
            setVoteSystem(vS)
        } else setVoteSystem(voteSystemPrev);
    }, [stageData, voteSystemPrev]);

    const [points, setPoints] = useState({});
    const [pt, setPt] = useState();

    console.log(points);

    const save = () => {
        dispatch(setVotePoints({
            id: params.id,
            points,
           // callback: () =>
        }));
    };

    const setPoint = (point, id) => {

        setPoints(ps => {
            let data = {
                ...ps,
                [point]: id
            }
            const isPointed = Object.keys(ps).find(key => ps[key] === id);

            if (isPointed) data[isPointed] = null;

            return data;
        })
    };

    return (
        <div className='container'>
            <h1 className='data-block__header'>
                Голосование {
                isJury && <div>
                    <Label color='red'>
                        Вы - член жюри. Голосуйте профессионально!
                    </Label>
                </div>
            }
                <div className='m-b-5'>
                    {voteSystem.map(point => (
                        <Button
                            key={'pt_'+point}
                            color='violet'
                            onClick={() => setPt(pt === point ? null : point)}
                            disabled={points[point]}
                        >
                            {point}
                        </Button>
                    ))}
                </div>
            </h1>
            {voteOpen ? <Form inverted onSubmit={save}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <div className='data-block__table data-block__vote'>
                                <Table inverted color="violet">

                                    <Table.Header className='table__header'>
                                        <Table.Row>
                                            <Table.HeaderCell width={1}>
                                                Номер
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Аудио
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Название заявки
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Ваши баллы
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {
                                            stageData?.applications?.filter(a => a.applicationStateId !== 6).map(app => (
                                                <Table.Row key={app.id}>
                                                    <Table.Cell>
                                                        <b>{app?.application_stage.number}</b>
                                                    </Table.Cell>
                                                    <Table.Cell width={5}>
                                                        <audio style={{width: '100%'}} controls>
                                                            <source src={`${pkg.proxy}/${app?.audioFile}`}
                                                                    type="audio/mpeg"/>
                                                        </audio>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {app.songName}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {voteSystem.map(point => (
                                                            <Button
                                                                type='button'
                                                                className='m-b-5'
                                                                disabled={pt && pt !== point}
                                                                color={points[point] === app.id ? 'orange' : 'blue'}
                                                                onClick={() => setPoint(point, app.id)}>
                                                                {point}
                                                            </Button>
                                                        ))}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        }

                                    </Table.Body>
                                </Table>
                            </div>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Grid>
                    <Grid.Row className='btn-block'>
                        <Grid.Column width={4}>
                            <Form.Button
                                className='form-btn'
                                loading={loading}
                                disabled={loading}
                                color='violet'
                                content='Сохранить'/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form> :
                <Message
                    error
                    header='Голосование окончено или не начато'
                />
            }
        </div>
    )
};

export default Vote;
