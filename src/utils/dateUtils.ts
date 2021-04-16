export const getDateDiffInSeconds = (earlyDate: Date, lateDate: Date = new Date()): number => {
    return (lateDate.getTime() - earlyDate.getTime()) / 1000;
}