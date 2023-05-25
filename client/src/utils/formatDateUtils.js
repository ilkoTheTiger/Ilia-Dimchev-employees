export const formatDate = (date) => {
    return `
        ${date.getFullYear()}-
        ${String(date.getMonth() + 1).padStart(2, '0')}-
        ${String(date.getDate()).padStart(2, '0')}`.replace(/\s+/g, '').trim();
};

export const dateDifferenceInDays = (startDate, endDate) => {
    return (new Date(endDate) - new Date(startDate)) / 86400000
}