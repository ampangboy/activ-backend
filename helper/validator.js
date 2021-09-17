const isString = require('is-string');
const { DateTime } = require('luxon');

const intValidatorAllowNull = (int, ExceptionType) => {
  if (!Number.isSafeInteger(int)) {
    if (int !== null) {
      throw new ExceptionType(`${int} is not a valid Number format`);
    }
  }
};

const stringValidator = (string, ExceptionType) => {
  if (!isString(string)) {
    throw new ExceptionType(`${string} is not a valid String`);
  }
};

const stringValidatorAllowNull = (string, ExceptionType) => {
  if (!isString(string)) {
    if (!string === null) {
      throw new ExceptionType(`${string} is not a valid String`);
    }
  }
};

const dateTimeValidatorAllowNull = (date, ExceptionType) => {
  if (!DateTime.isDateTime(date)) {
    if (!date === null) {
      throw new ExceptionType(`${date} is invalid date`);
    }
  }
};

module.exports = {
  intValidatorAllowNull,
  stringValidator,
  stringValidatorAllowNull,
  dateTimeValidatorAllowNull,
};
