import React, {useEffect, useState} from 'react';
import {Button, Dimmer, Divider, Form, Grid, Input, Loader} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import "react-datepicker/dist/react-datepicker.css";
import StageForm from "./stageForm";
import {getSeason, progressSelector, saveSeason, seasonSelector} from "../../ducks/season";
import {toFormat} from "../../utils/time";
import {toast} from "react-toastify";
import {isAdminSelector} from "../../ducks/user";
import {APPS_LINK, NEW_APP_LINK, SEASON_LINK, SEASON_SETTINGS_LINK} from "../../router/links";

const SeasonForm = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const loading = useSelector(progressSelector);
    const seasonData = useSelector(seasonSelector);
    const isAdmin = useSelector(isAdminSelector);


    useEffect(() => {
        params?.id && dispatch(getSeason(params.id));
    }, [params]);

    useEffect(() => {
        params?.id && seasonData && setForm(seasonData);
    }, [seasonData]);

    const [form, setForm] = useState({
        final: {
            name: 'Финал'
        },
        semifinals: [],
        secondChance: null
    });

    console.log(form)

    // const [errors, setErrors] = useState([]);

    const onChange = (e, {name, value}) => {
        setForm(f => ({
            ...f,
            [name]: value
        }))
    };

    const save = () => {
        if (form.secondChance && !form.semifinals.find(sf => sf.secondChanceCount)) {
            toast.warning('Во второй шанс не выходят. Укажите минимум одно участника, выходящего во второй шанс')
        } else dispatch(saveSeason({
            form,
            callback: params?.id ? null : (id) => navigate(SEASON_LINK.replace(':id', id))
        }));
    };

    const addSemifinal = () => {
        onChange(null, {
            name: 'semifinals',
            value: [...form.semifinals, {}]
        });
    };

    const deleteSemifinal = (index) => {
        let sfs = form.semifinals;
        sfs.splice(index, 1);
        onChange(null, {
            name: 'semifinals',
            value: sfs
        });
        !sfs.length && deleteSecondChance();
    };

    const deleteSecondChance = () => {
        onChange(null, {
            name: 'secondChance',
            value: null
        });
    };

    const addSecondChance = () => {
        onChange(null, {
            name: 'secondChance',
            value: {}
        });
    };

    const onChangeFinal = (e, {value, name}) => {
        onChange(e, {
            name: 'final',
            value: {
                ...form.final,
                [name]: value
            }
        });
    }

    const onChangeSecondChance = (e, {value, name}) => {
        onChange(e, {
            name: 'secondChance',
            value: {
                ...form.secondChance,
                [name]: value
            }
        });
    }

    const onChangeSemifinal = (index, {value, name}) => {
        let newSfs = [...form.semifinals];
        newSfs[index] = {
            ...newSfs[index],
            [name]: value
        };

        onChange(null, {
            name: 'semifinals',
            value: newSfs
        });
    }

    return (
        <div className='container'>
            <div className=''>
                {loading && <Dimmer active={loading}>
                    <Loader inverted size='large'>Loading</Loader>
                </Dimmer>}
                <h1 className='data-block__header'>
                    {params?.id ? form.name : `Новый сезон`}
                    <div>{params?.id && (Date.parse(form.dateEnd) > Date.parse(new Date())) &&
                        <Button
                            onClick={() => navigate(NEW_APP_LINK.replace(':id', params.id))}
                            color='green'
                        >
                            ПОДАТЬ ЗАЯВКУ
                        </Button>}
                        {params?.id && isAdmin &&
                            <Button
                                onClick={() => navigate(APPS_LINK.replace(':id', params.id))}
                                color='violet'
                            >
                                Поданные заявки
                            </Button>}
                        {params?.id && isAdmin &&
                            <Button
                                onClick={() => navigate(SEASON_SETTINGS_LINK.replace(':id', params.id))}
                                color='violet'
                            >
                                Настройки сезона
                            </Button>}
                    </div>
                </h1>
                <Form inverted onSubmit={save}>
                    <Grid className='form_user'>
                        <Grid.Row className='form_data'>
                            <Grid.Column width={4}>
                                <Divider horizontal inverted>
                                    Общие настройки
                                </Divider>
                                <Form.Input
                                    disabled={!isAdmin}
                                    required
                                    label='Название сезона'
                                    name='name'
                                    value={form.name || ''}
                                    onChange={onChange}
                                />
                                <Form.TextArea
                                    disabled={!isAdmin}
                                    label='Описание'
                                    name='description'
                                    value={form.description}
                                    onChange={onChange}
                                />
                                <Form.Input
                                    disabled={!isAdmin}
                                    label='Дата начала приема заявок'
                                    name='dateStart'
                                    type='datetime-local'
                                    value={toFormat(form.dateStart)}
                                    onChange={onChange}
                                />
                                <Form.Input
                                    disabled={!isAdmin}
                                    label='Дата окончания приема заявок'
                                    name='dateEnd'
                                    type='datetime-local'
                                    value={toFormat(form.dateEnd)}
                                    onChange={onChange}
                                />
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <StageForm
                                    disabled={!isAdmin}
                                    nameStage='Настройки финала'
                                    form={form.final}
                                    onChange={onChangeFinal}
                                    isFinal
                                />
                            </Grid.Column>

                            <Grid.Column width={8}>
                                <Divider horizontal inverted>
                                    Настройки прочих стадий
                                </Divider>
                                <Grid>
                                    {isAdmin && <Grid.Row>
                                        <Grid.Column width={8}>
                                            <Button
                                                color='blue'
                                                type='button'
                                                className='form-btn'
                                                onClick={addSemifinal}
                                                content='Добавить полуфинал'/>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Button
                                                disabled={form.secondChance || !form.semifinals?.length}
                                                color='blue'
                                                type='button'
                                                className='form-btn'
                                                onClick={addSecondChance}
                                                content='Добавить второй шанс'/>
                                        </Grid.Column>
                                    </Grid.Row>}
                                    <Grid.Row className='form_data form_stages'>
                                        {
                                            form.semifinals?.map((sf, index) => (
                                                <Grid.Column width={8} className='m-b-50' key={'id_' + index}>
                                                    <StageForm
                                                        disabled={!isAdmin}
                                                        nameStage={`Настройки полуфинала ${index + 1}`}
                                                        form={sf}
                                                        onChange={(e, {name, value}) => onChangeSemifinal(index, {
                                                            value,
                                                            name
                                                        })}
                                                        isSemifinal
                                                        secondChance={form.secondChance}
                                                    />
                                                    {isAdmin && <Button
                                                        color='red'
                                                        type='button'
                                                        className='form-btn'
                                                        onClick={() => deleteSemifinal(index)}
                                                        content={`Удалить полуфинал ${index + 1}`}
                                                    />}
                                                </Grid.Column>
                                            ))
                                        }

                                        {
                                            form.secondChance &&
                                            <Grid.Column width={8}>
                                                <StageForm
                                                    disabled={!isAdmin}
                                                    form={form.secondChance}
                                                    nameStage='Настройки Второго шанса'
                                                    onChange={onChangeSecondChance}
                                                    isSecondChance
                                                />
                                                {isAdmin && <Button
                                                    color='red'
                                                    type='button'
                                                    className='form-btn'
                                                    onClick={deleteSecondChance}
                                                    content={`Удалить второй шанс`}
                                                />}
                                            </Grid.Column>
                                        }
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        {isAdmin && <Grid.Row className='btn-block'>
                            <Grid.Column width={4}>
                                <Form.Button
                                    className='form-btn'
                                    loading={loading}
                                    disabled={loading}
                                    color='violet'
                                    content='Сохранить'/>
                            </Grid.Column>
                        </Grid.Row>}
                    </Grid>
                </Form>
            </div>
        </div>
    )
};

export default SeasonForm;
