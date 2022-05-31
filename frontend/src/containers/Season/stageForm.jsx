import React from 'react';
import {Divider, Form} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {toFormat} from "../../utils/time";

const StageForm = ({nameStage, disabled, form = {}, onChange, isFinal, isSemifinal, isSecondChance, secondChance}) => {

    return (
        <>
            <Divider horizontal inverted>
                {nameStage}
            </Divider>
            <Form.Input
                required
                label='Название'
                name='name'
                value={form.name || ''}
                onChange={onChange}
                disabled={disabled}
            />
            <Form.Input
                label='Процент влияния голосования жюри'
                name='juryPercent'
                type='number'
                min={0}
                max={100}
                value={form.juryPercent || null}
                onChange={onChange}
                disabled={disabled}
            />
            <Form.Input
                label='Количество участников'
                name='count'
                type='number'
                min={0}
                //max={100}
                value={form.count || 0}
                onChange={onChange}
                disabled={disabled}
            />
            {!isFinal && <Form.Input
                label='Количество участников, выходящих в финал'
                name='winCount'
                type='number'
                min={0}
                //max={100}
                value={form.winCount || 0}
                onChange={onChange}
                disabled={disabled}
            />}
            {isSemifinal && secondChance && <Form.Input
                label='Количество участников, выходящих во второй шанс'
                name='secondChanceCount'
                type='number'
                min={0}
                //max={100}
                value={form.secondChanceCount || 0}
                onChange={onChange}
                disabled={disabled}
            />}
            <Form.Input
                label='Старт голосования'
                name='startVote'
                type='datetime-local'
                value={toFormat(form.startVote) || null}
                onChange={onChange}
                disabled={disabled}
            />
            <Form.Input
                label='Завершение голосования'
                name='endVote'
                type='datetime-local'
                value={toFormat(form.endVote) || null}
                onChange={onChange}
                disabled={disabled}
            />
        </>
    )
};

export default StageForm;
