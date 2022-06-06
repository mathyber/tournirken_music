import React, {useEffect, useState} from 'react';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {getResultVotes, progressSelector, resultVotesSelector} from "../../ducks/result";
import {COUNT_ITEMS} from "../../constants";
import PaginationBlock from "../Pagination";
import {Button, Dimmer, Loader, Table} from "semantic-ui-react";
import {deleteVotePoints} from "../../ducks/vote";

const ResultTable = ({isJury, id, points, apps, countAll}) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);

    const votes = useSelector(resultVotesSelector);
    const loading = useSelector(progressSelector);

    const changePage = (e, {activePage}) => {
        setPage(Math.round(activePage));
    }

    const loadData = () => {
        dispatch(getResultVotes({
            id,
            data: {
                isJury,
                page, limit: COUNT_ITEMS
            }
        }))
    }

    useEffect(() => {
        loadData()
    }, [isJury, id]);

    const deleteVote = (userId) => {
        dispatch(deleteVotePoints({
            id,
            userId,
            callback: loadData
        }))
    }

    return (
        <div className='data-block__table'>
            {loading && <Dimmer active={loading}>
                <Loader inverted size='large'>Loading</Loader>
            </Dimmer>}
            <Table inverted color="violet">
                <Table.Header className='table__header'>
                    <Table.Row>
                        <Table.HeaderCell>
                            Пользователь {`(${votes.count}${countAll ? '/'+countAll : ''})`}
                        </Table.HeaderCell>
                        {
                            (apps||[]).map(app => (
                                <Table.HeaderCell key={app.id}>
                                    за {app.application_stage.number} - {app.songName}
                                </Table.HeaderCell>
                            ))
                        }
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        (votes.rows || []).map((v) => (
                            <Table.Row key={v.user.id}>
                                <Table.Cell width={2}>
                                    {v.user?.name} {v.user?.surname}
                                </Table.Cell>
                                {
                                    (apps||[]).map(app => (
                                        <Table.Cell key={app.id}>
                                            {
                                                v.points?.find(p => p.app?.applicationId === app.id)?.points
                                            }
                                        </Table.Cell>
                                    ))
                                }

                                <Table.Cell>
                                    <Button icon='delete' color='red' onClick={()=>deleteVote(v.user?.id)}/>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>


            <PaginationBlock totalPages={votes.count / COUNT_ITEMS} active={page} onChange={changePage}/>
        </div>
    )
};

export default ResultTable;