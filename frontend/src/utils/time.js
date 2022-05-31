import moment from "moment";

export const toFormat = (date) => {
    return date ? moment(date).local().format('YYYY-MM-DDTHH:mm') : null
}