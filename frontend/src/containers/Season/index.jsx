import React from 'react';
import {useSelector} from "react-redux";
import {infoSelector} from "../../ducks/contest";

const Season = () => {

    const data = useSelector(state=>infoSelector(state));
    console.log(data)

    return (
        <div className='container'>

        </div>
    )
};

export default Season;
