import React, {useEffect, useState} from 'react';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {getResult, getResultVotes, progressSelector, resultDataSelector, resultVotesSelector} from "../../ducks/result";
import {Button, Card, Dimmer, Dropdown, Form, Grid, Label, Loader, Tab, Table} from "semantic-ui-react";
import ResultTable from "../ResultTable";

const ResultData = ({id, apps, juries: allJuries = [], points}) => {
    console.log(allJuries)
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);

    const votes = useSelector(resultDataSelector);
    const loading = useSelector(progressSelector);

    console.log(votes)

    const changePage = (e, {activePage}) => {
        setPage(Math.round(activePage));
    }

    const [juries, setJuries] = useState(allJuries.map(j => j.id));
    const [tabs, setTabs] = useState([]);

    const loadData = () => {
        dispatch(getResult({
            id: id,
            data: {juries}
        }));
    }

    useEffect(() => {
        juries.length === allJuries.length && loadData();
    }, [id, juries]);

    useEffect(() => {
        setTabs(votes?.result.map((res, index) => (
            {
                menuItem: res.user ? `Жюри - №${index + 1} ${res.user.name} ${res.user.surname}` : 'Зрители',
                render: () => table(res)
            }
        )))
    }, [votes]);

    const name = (pt) => {
        const a = apps.find(app => app.id.toString() === pt.app.toString());
        return `${a?.application_stage?.number} - ${a.songName}`
    }

    const table = (res) => {
        return (

            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <div className='data-block__table'>
                            <Table inverted color="violet">
                                <Table.Header className='table__header'>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Место
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Заявка
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Баллы
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {
                                        res.pointsAll.map((pt, index) => (
                                            <Table.Row
                                                className={apps.find(a => a.applicationStateId === 6 && (a.id.toString() === pt.app.toString()))
                                                    ? 'table-row_dsq' : (votes && votes.stage && ((votes.stage.winCount >= index + 1) ?
                                                    'table-row_green' : ((votes.stage.secondChanceCount + votes.stage.winCount >= index + 1)
                                                        && 'table-row_yellow')))}>
                                                <Table.Cell>
                                                    {apps.find(a => a.applicationStateId === 6 && (a.id.toString() === pt.app.toString()))? 'DSQ' : index + 1}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {name(pt)}
                                                </Table.Cell>
                                                <Table.Cell style={{fontSize: '20px'}}>
                                                    <b>{pt.points || 0}</b>
                                                    {
                                                        res.points.find(pnt => pnt.app.toString() === pt.app.toString()) &&
                                                        <Label color='orange' style={{marginLeft: '5px'}}>
                                                            <b>
                                                                + {res.points.find(pnt => pnt.app.toString() === pt.app.toString()).points}
                                                            </b>
                                                        </Label>
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table>
                        </div>
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <Table inverted color="violet">
                            <Table.Header className='table__header'>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        Заявка
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Баллы
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    res.points.sort(
                                        function (a, b) {
                                            if (a.points > b.points) {
                                                return -1;
                                            }
                                            if (a.points < b.points) {
                                                return 1;
                                            }
                                            return 0;
                                        }
                                    ).map(pt => (
                                            <Table.Row>
                                                <Table.Cell>
                                                    {name(pt)}
                                                </Table.Cell>
                                                <Table.Cell style={{fontSize: '16px'}}>
                                                    <b>{pt.points}</b>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    )
                                }

                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return (
        <div>
            {loading && <Dimmer active={loading}>
                <Loader inverted size='large'>Loading</Loader>
            </Dimmer>}
            <Form.Field className='m-b-5'>
                <label>Порядок жюри</label>
                <Dropdown
                    options={(allJuries || []).map(u => ({
                        value: u.id, name: `${u.name} ${u.surname}`, text: `${u.name} ${u.surname}`
                    }))}
                    placeholder='Введите id пользователей'
                    search
                    selection
                    fluid
                    allowAdditions
                    multiple
                    value={juries || null}
                    onChange={(e, {value}) => {
                        setJuries(value);
                    }}
                />
            </Form.Field>
            <Tab
                menu={{color: 'violet', inverted: true}}
                panes={tabs}
            />
        </div>
    )
};

export default ResultData;