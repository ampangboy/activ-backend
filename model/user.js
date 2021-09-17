const emailAddressParser = require('email-addresses');
const {
  intValidatorAllowNull,
  stringValidator,
  stringValidatorAllowNull,
  dateTimeValidatorAllowNull,
} = require('../helper/validator');

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

  #createOn;

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

    return this.#userId;
  }

  get emailAddress() {
    return this.#emailAddress;
  }

  set emailAddress(emailAddress) {
    stringValidator(emailAddress, UserException);

    if (!User.isEmailAddress(emailAddress)) {
      throw new UserException(`${emailAddress} is not a valid email address`);
    }

    this.#emailAddress = emailAddress;
    return this.#emailAddress;
  }

  get password() {
    return this.#password;
  }

  set password(password) {
    stringValidator(password);

    this.#password = password;
    return this.#password;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(firstName) {
    stringValidator(firstName);

    this.#firstName = firstName;
    return this.#firstName;
  }

  get lastName() {
    return this.#firstName;
  }

  set lastName(lastName) {
    stringValidator(lastName);

    this.#lastName = lastName;
    return this.#lastName;
  }

  get jobTitle() {
    return this.#jobTitle;
  }

  set jobTitle(jobTitle) {
    stringValidatorAllowNull(jobTitle);

    this.#jobTitle = jobTitle;
    return this.#jobTitle;
  }

  get createdOn() {
    return this.#createOn;
  }

  set createdOn(createdOn) {
    dateTimeValidatorAllowNull(createdOn, UserException);

    if (createdOn === null) {
      this.#createOn = null;
      return this.#createOn;
    }

    this.#createOn = new Date(createdOn);
    return this.#createOn;
  }

  static isEmailAddress(emailAddress) {
    const addrs = emailAddressParser(emailAddress);

    return addrs !== null;
  }
}

module.exports = User;
