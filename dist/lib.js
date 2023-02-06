export const log = (message) => {
    console.log(`${getDateOnlyTimestamp()} ${getTimeOnlyTimestamp()}: ${message}`);
};
function getDateOnlyTimestamp() {
    const now = new Date();
    const dateOnlyTimeStamp = `${now.getFullYear()}-${`${now.getMonth()}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
    return dateOnlyTimeStamp;
}
function getTimeOnlyTimestamp() {
    const now = new Date();
    const dateOnlyTimeStamp = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}:${`${now.getSeconds()}`.padStart(2, "0")}`;
    return dateOnlyTimeStamp;
}
const lib = {
    log,
    getDateOnlyTimestamp,
    getTimeOnlyTimestamp,
};
export default lib;
