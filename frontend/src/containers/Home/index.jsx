import React from 'react';
import {useSelector} from "react-redux";
import {infoSelector} from "../../ducks/contest";
import {Button} from "semantic-ui-react";
import {NEW_APP_LINK} from "../../router/links";
import {useNavigate} from "react-router";

const Home = () => {

    const navigate = useNavigate();
    const data = useSelector(state => infoSelector(state));

    return (
        <div className='container'>
            <h1>
                {data.name}
            </h1>
            <p>
                {data.description}
            </p>
            {data.seasons?.map(s => (<div key={"key_"+s.id}>
                <Button
                    className='m-b-5'
                    onClick={() => navigate(NEW_APP_LINK.replace(':id', s.id))}
                    color='violet'
                >
                    {s.name}: Подать заявку на участие в сезоне
                </Button>
            </div>))}
        </div>
    )
};

export default Home;
