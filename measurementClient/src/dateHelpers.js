/*
 * dateHelpers.js
 *
 * Juha-Pekka Liimatainen 7.3.2020
*/

// helper functions for manipulating dates
const dateHelpers = {

  // returns a component object created from a date object
  createDateObject: date => {
    let dateObj = {};

    dateObj.Year = '' + date.getFullYear();
    dateObj.Month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
    dateObj.Day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
    dateObj.Hours = date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours();
    dateObj.Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes();
    dateObj.Seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds();

    return dateObj;
  },

  // creates a string from a component based date object
  dateObjToString: dateObj => {
    return dateObj.Year + '-' + dateObj.Month + '-' + dateObj.Day + 'T'
      + dateObj.Hours + ':' + dateObj.Minutes + ':' + dateObj.Seconds;
  },

  // test if a valid date
  isValidDate: dateObj => {
    const shortMonths = ['04', '06', '09', '11'];
    const day = parseInt(dateObj.Day);
    const year = parseInt(dateObj.Year);
    
    if (dateObj.Day === '31' && shortMonths.includes(dateObj.Month)) {
      return false;
    }
    
    if (dateObj.Month === '02' && day > 29) {
      return false
    }
    // test leap year
    if (dateObj.Month === '02' && dateObj.Day === '29' && (year % 4 !== 0 || 
        (year % 100 === 0 && year % 400 !== 0))) {
      return false;
    }

    return true;
  }
};

export default dateHelpers;