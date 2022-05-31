import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getSeasons, progressSelector, seasonsSelector} from "../../ducks/season";
import SeasonCard from "../../components/SeasonCard";
import {Button, Card} from "semantic-ui-react";
import PaginationBlock from "../../components/Pagination";
import {COUNT_ITEMS} from "../../constants";
import {useNavigate} from "react-router";
import {isAdminSelector} from "../../ducks/user";
import {NEW_SEASON_LINK, SEASON_LINK} from "../../router/links";

const Seasons = () => {

    const seasonData = useSelector(state => seasonsSelector(state));
    const loading = useSelector(state => progressSelector(state));
    const isAdmin = useSelector(state => isAdminSelector(state));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    useEffect(() => {
        dispatch(getSeasons({
            page, limit: COUNT_ITEMS
        }));
    }, [page]);

    const changePage = (e, {activePage}) => {
        setPage(Math.round(activePage));
    }

    return (
        <div className='container container__center'>
            <div className='data-block'>
                <h1 className='data-block__header'>
                    СЕЗОНЫ КОНКУРСА
                    {isAdmin && <Button onClick={() => navigate(NEW_SEASON_LINK)} color='green'>Новый сезон</Button>}
                </h1>

                <Card.Group className='data-block__items'>
                    {
                        seasonData.rows && seasonData.rows.map(s => (
                            <SeasonCard onClick={() => navigate(SEASON_LINK.replace(':id', s.id))} key={s.id} row={s}/>
                        ))
                    }
                </Card.Group>
                <PaginationBlock totalPages={seasonData.count / COUNT_ITEMS} active={page} onChange={changePage}/>
            </div>
        </div>
    )
};

export default Seasons;
