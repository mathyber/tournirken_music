import React from 'react';
import './styles.scss';
import {useEffect, useState} from "react";
import {COUNT_ITEMS} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import PaginationBlock from "../../components/Pagination";
import {appsSelector, getApps} from "../../ducks/application";
import {useParams} from "react-router";

const AppsPage = (props) => {

    const params = useParams();
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const apps = useSelector(state => appsSelector(state));

    useEffect(() => {
        dispatch(getApps({
            page,
            limit: COUNT_ITEMS,
            seasonId: params.id
        }));
    }, [page]);

    const changePage = (e, {activePage}) => {
        setPage(Math.round(activePage));
    }

    return (
        <div className='container'>
            <h1 className='data-block__header'>
                Поданные заявки
            </h1>
            <PaginationBlock totalPages={apps.count / COUNT_ITEMS} active={page} onChange={changePage}/>
        </div>
    );
}

export default AppsPage;