import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getResult, resultDataSelector} from "../../ducks/result";
import {useParams} from "react-router";
import {Button, Label, Tab} from "semantic-ui-react";
import {getStage, stageSelector} from "../../ducks/season";
import {getVoteSystem, saveVote, voteSystemSelector} from "../../ducks/vote";
import ResultTable from "../../components/ResultTable";
import ResultData from "../../components/ResultData";

const Result = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const data = useSelector(resultDataSelector);
    const stageData = useSelector(stageSelector);
    const {points: voteSystem = [], voteOpen} = useSelector(voteSystemSelector);

    useEffect(() => {
        params?.id && dispatch(getStage(params.id));
        dispatch(getVoteSystem({
            id: params.id
        }));
    }, [params]);

    const saveVoting = () => {
        dispatch(saveVote({
            id: params.id
        }))
    }

    const panes = [
        {
            menuItem: `Жюри`,
            render: () => <ResultTable countAll={stageData?.users?.length} isJury id={params.id} points={voteSystem} apps={stageData?.applications}/>
        },
        {
            menuItem: `Зрители`,
            render: () => <ResultTable id={params.id} points={voteSystem} apps={stageData?.applications}/>
        },
        {
            menuItem: `РЕЗУЛЬТАТЫ`,
            render: () => <ResultData juries={stageData?.users} id={params.id} points={voteSystem} apps={stageData?.applications}/>
        }
    ]

    return (
        <div className='container'>
            <h1 className='data-block__header'>
                Таблицы голосования - стадия {stageData.name}
                <div>
                    {voteOpen && <Label color='red'>
                        Идет голосование
                    </Label>}
                    {!voteOpen && stageData.startVote && <Button size="mini" color='green' onClick={saveVoting}>
                        Подтвердить результаты
                    </Button>}
                </div>
            </h1>
            <Tab
                menu={{ color: 'violet', inverted: true }}
                panes={panes}
            />
        </div>
    )
};

export default Result;
