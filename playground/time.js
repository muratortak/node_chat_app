// Jan 1st 1970 00:00:00 am
var moment = require('moment');
// var date = new Date();
// var months = ['Jan', 'Feb']

var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
// date.add(1, 'year').subtract(9, 'month')
// console.log(date.format('MMM Do, YYYY'));


console.log(date.format('h:mm a'))




