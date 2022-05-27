import React from 'react';
import {useSelector} from "react-redux";
import {infoSelector} from "../../ducks/contest";

const Home = () => {

    const data = useSelector(state=>infoSelector(state));
    console.log(data)

    return (
        <div className='container'>
            <h1>
                {data.name}
            </h1>
            <p>
                {data.description}
            </p>
        </div>
    )
};

export default Home;
