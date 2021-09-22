const emailAddressParser = require('email-addresses');
const {
  intValidatorAllowNull,
  stringValidator,
  stringValidatorAllowNull,
  dateTimeValidatorAllowNull,
  validateCharLength,
} = require('../helper/validator');
const { pool } = require('../dbConnection');

function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

class User {
  #userId;

  #emailAddress;

  #password;

  #firstName;

  #lastName;

  #jobTitle;

  #createdOn;

  constructor(emailAddress, password, firstName, lastName, jobTitle = null, userId = null, createdOn = null) {
    this.userId = userId;
    this.emailAddress = emailAddress;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.jobTitle = jobTitle;
    this.createdOn = createdOn;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    intValidatorAllowNull(userId, UserException);

    this.#userId = userId;
  }

  get emailAddress() {
    return this.#emailAddress;
  }

  set emailAddress(emailAddress) {
    const MAX_CHAR_LENGTH = 255;

    stringValidator(emailAddress, UserException);

    validateCharLength(emailAddress, MAX_CHAR_LENGTH, UserException);

    if (!User.isEmailAddress(emailAddress)) {
      throw new UserException(`${emailAddress} is not a valid email address`);
    }

    this.#emailAddress = emailAddress;
  }

  get password() {
    return this.#password;
  }

  set password(password) {
    const MAX_CHAR_LENGTH = 512;

    validateCharLength(password, MAX_CHAR_LENGTH, UserException);

    stringValidator(password, UserException);

    this.#password = password;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(firstName) {
    const MAX_CHAR_LENGTH = 255;

    validateCharLength(firstName, MAX_CHAR_LENGTH, UserException);

    stringValidator(firstName, UserException);

    this.#firstName = firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(lastName) {
    const MAX_CHAR_LENGTH = 255;

    validateCharLength(lastName, MAX_CHAR_LENGTH, UserException);

    stringValidator(lastName, UserException);

    this.#lastName = lastName;
  }

  get jobTitle() {
    return this.#jobTitle;
  }

  set jobTitle(jobTitle) {
    const MAX_CHAR_LENGTH = 255;

    stringValidatorAllowNull(jobTitle, UserException);
    if (jobTitle !== null) {
      validateCharLength(jobTitle, MAX_CHAR_LENGTH, UserException);
    }

    this.#jobTitle = jobTitle;
  }

  get createdOn() {
    return this.#createdOn;
  }

  set createdOn(createdOn) {
    dateTimeValidatorAllowNull(createdOn, UserException);

    this.#createdOn = createdOn === null ? null : new Date(createdOn);
  }

  static isEmailAddress(emailAddress) {
    const addrs = emailAddressParser(emailAddress);

    return addrs !== null;
  }

  asyncAddUser() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CALL createUser(?,?,?,?,?)',
        [this.emailAddress, this.firstName, this.lastName, this.jobTitle, this.password],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(results);
        }
      );
    });
  }

  async saveUserInfo() {
    const respond = await this.asyncAddUser();
    this.userId = respond[0][0].userId;
    this.createdOn = respond[0][0].createdOn;
  }
}

module.exports = User;
