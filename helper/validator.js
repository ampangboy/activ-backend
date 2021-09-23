const isString = require('is-string');

const intValidatorAllowNull = (int) => {
  if (!Number.isSafeInteger(int)) {
    if (int !== null) {
      throw new Error(`${int} is not a valid Number format`);
    }
  }
};

const stringValidator = (string) => {
  if (!isString(string)) {
    throw new Error(`${string} is not a valid String`);
  }
};

const stringValidatorAllowNull = (string) => {
  if (!isString(string)) {
    if (string !== null) {
      throw new Error(`${string} is not a valid String`);
    }
  }
};

const dateTimeValidatorAllowNull = (dateTime) => {
  if (!(dateTime instanceof Date)) {
    if (dateTime !== null) {
      throw new Error(`${dateTime} is in invalid date time format`);
    }
  }
};

const validateCharLength = (string, maxCharLength) => {
  if (string.length > maxCharLength) {
    throw new Error(`string exceed allowable character`);
  }
};

module.exports = {
  intValidatorAllowNull,
  stringValidator,
  stringValidatorAllowNull,
  dateTimeValidatorAllowNull,
  validateCharLength,
};
