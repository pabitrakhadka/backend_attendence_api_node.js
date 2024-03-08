const currentDate = new Date();
const numDays=2;
const startDate = new Date(currentDate);
startDate.setDate(startDate.getDate() - numDays);

console.log("start data",startDate);
console.log("Current date",startDate);
