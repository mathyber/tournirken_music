import React from 'react';
import './styles.scss';
import {useEffect, useState} from "react";
import {COUNT_ITEMS, statuses} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import PaginationBlock from "../../components/Pagination";
import {appsSelector, changeStateApp, getApps} from "../../ducks/application";
import {useParams} from "react-router";
import {Button, Table} from "semantic-ui-react";
import {USER_LINK} from "../../router/links";
import pkg from '../../../package.json';

const AppsPage = (props) => {

    const params = useParams();
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const apps = useSelector(state => appsSelector(state));

    const loadData = () => {
        dispatch(getApps({
            page,
            limit: COUNT_ITEMS,
            seasonId: params.id
        }));
    }

    useEffect(() => {
        loadData();
    }, [page]);

    const changePage = (e, {activePage}) => {
        setPage(Math.round(activePage));
    }

    const changeState = (id, newStatus) => {
        dispatch(changeStateApp({
            id, newStatus, callback: loadData
        }))
    }

    const btns = (id, state) => {
        const st = statuses.find(s => s.name === state);

        return st.next.map(n => (
            <Button className='m-b-5' color='green' key={`${id}_${n}`} onClick={() => changeState(id, n)}>
                to {n}
            </Button>
        ))
    };

    return (
        <div className='container'>
            <h1 className='data-block__header'>
                Поданные заявки
            </h1>
            <div className='data-block__table'>
                <Table inverted color="violet">
                    <Table.Header className='table__header'>
                        <Table.Row>
                            <Table.HeaderCell>
                                ID
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Статус
                            </Table.HeaderCell>
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
                            <Table.HeaderCell>
                                Дата и время подачи
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Действия
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            (apps.rows || []).map((app) => (
                                <Table.Row key={app.id}>
                                    <Table.Cell width={1}>
                                        {app.id}
                                    </Table.Cell>
                                    <Table.Cell width={2}>
                                        {app.application_state ? `${app.application_state.name} - ${app.application_state.description}` : ''}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <audio controls>
                                            <source src={`${pkg.proxy}/${app.audioFile}`} type="audio/mpeg"/>
                                        </audio>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {app.users.map((user, index) => (
                                            <div key={user.id + "_" + index}>
                                                <a style={{color: 'white'}} href={USER_LINK.replace(':id', user.id)}>
                                                    {`${user.name} ${user.surname}`}
                                                    {user.alias && `(${user.alias})`}
                                                </a>
                                            </div>
                                        ))}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {app.originalSongName}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {app.songName}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {`${new Date(app.createdAt).toLocaleDateString()} ${new Date(app.createdAt).toLocaleTimeString()}`}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {btns(app.id, app.application_state.name)}
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>

            <PaginationBlock totalPages={apps.count / COUNT_ITEMS} active={page} onChange={changePage}/>
        </div>
    );
}

export default AppsPage;