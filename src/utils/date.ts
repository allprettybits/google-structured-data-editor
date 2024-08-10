export const dateToInput = (date?: Date | string) => {

    if (!date) return '';

    date = new Date(date);

    // get the timezone offset
    const offset = date.getTimezoneOffset();

    // adjust the offset
    date.setMinutes(date.getMinutes() - offset)

    // convert to iso string (this will get rid of the offset again, leaving an iso string in local time)
    const inputString = date.toISOString();

    // remove the timezone part from the iso string (the input doesn't handle timezones)
    return inputString.substring(0, inputString.indexOf('T') + 6);
};

export const dateToISO = (date: Date | string) => {

    return new Date(date).toISOString();
};
