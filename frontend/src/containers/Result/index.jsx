import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getResult, resultDataSelector} from "../../ducks/result";
import {useParams} from "react-router";
import {Label, Tab} from "semantic-ui-react";
import {getStage, stageSelector} from "../../ducks/season";
import {getVoteSystem, voteSystemSelector} from "../../ducks/vote";
import ResultTable from "../../components/ResultTable";

const Result = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const data = useSelector(resultDataSelector);
    const stageData = useSelector(stageSelector);
    const {points: voteSystem = [], voteOpen} = useSelector(voteSystemSelector);

    useEffect(() => {
        dispatch(getResult({
            id: params?.id
        }));
        params?.id && dispatch(getStage(params.id));
        dispatch(getVoteSystem({
            id: params.id
        }));
    }, [params]);

    const panes = [
        {
            menuItem: `Жюри`,
            render: () => <ResultTable countAll={stageData?.users?.length} isJury id={params.id} points={voteSystem} apps={stageData?.applications}/>
        },
        {
            menuItem: `Зрители`,
            render: () => <ResultTable id={params.id} points={voteSystem} apps={stageData?.applications}/>
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
