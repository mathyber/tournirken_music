import React from 'react';
import './styles.scss';
import {Card, Container, Header} from "semantic-ui-react";

const SeasonCard = ({onClick, row}) => {

    console.log(row)

    return (
        <Container className='season-card' fluid onClick={onClick}>
            <h2>{row.name}</h2>
            <p>{row.description}</p>
        </Container>
    )
};

export default SeasonCard;