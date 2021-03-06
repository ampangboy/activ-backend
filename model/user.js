const emailAddressParser = require('email-addresses');
const {
  intValidatorAllowNull,
  stringValidator,
  stringValidatorAllowNull,
  dateTimeValidatorAllowNull,
  validateCharLength,
} = require('../helper/validator');
const PasswordEncryptor = require('../helper/PasswordEncryptor');
const { asyncCreateUser, asyncGetUserByEmailAddress } = require('../dbSubcriber');

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
    intValidatorAllowNull(userId);

    this.#userId = userId;
  }

  get emailAddress() {
    return this.#emailAddress;
  }

  set emailAddress(emailAddress) {
    const MAX_CHAR_LENGTH = 255;

    stringValidator(emailAddress);

    validateCharLength(emailAddress, MAX_CHAR_LENGTH);

    if (!User.isEmailAddress(emailAddress)) {
      throw new Error(`${emailAddress} is not a valid email address`);
    }

    this.#emailAddress = emailAddress;
  }

  get password() {
    return this.#password;
  }

  set password(password) {
    const MAX_CHAR_LENGTH = 512;

    validateCharLength(password, MAX_CHAR_LENGTH);

    stringValidator(password);

    this.#password = password;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(firstName) {
    const MAX_CHAR_LENGTH = 255;

    validateCharLength(firstName, MAX_CHAR_LENGTH);

    stringValidator(firstName);

    this.#firstName = firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(lastName) {
    const MAX_CHAR_LENGTH = 255;

    validateCharLength(lastName, MAX_CHAR_LENGTH);

    stringValidator(lastName);

    this.#lastName = lastName;
  }

  get jobTitle() {
    return this.#jobTitle;
  }

  set jobTitle(jobTitle) {
    const MAX_CHAR_LENGTH = 255;

    stringValidatorAllowNull(jobTitle);
    if (jobTitle !== null) {
      validateCharLength(jobTitle, MAX_CHAR_LENGTH);
    }

    this.#jobTitle = jobTitle;
  }

  get createdOn() {
    return this.#createdOn;
  }

  set createdOn(createdOn) {
    dateTimeValidatorAllowNull(createdOn);

    this.#createdOn = createdOn === null ? null : createdOn;
  }

  static isEmailAddress(emailAddress) {
    const addrs = emailAddressParser(emailAddress);

    return addrs !== null;
  }

  async saveUserInfo() {
    const respond = await asyncCreateUser(
      this.emailAddress,
      this.firstName,
      this.lastName,
      this.jobTitle,
      this.password
    );
    // @ts-ignore
    this.userId = respond.userId;
    // @ts-ignore
    this.createdOn = respond.createdOn;
  }

  async encyptPassword() {
    const passwordEncryptor = new PasswordEncryptor(this.password);
    await passwordEncryptor.encryptPassword();
    this.password = passwordEncryptor.hashPassword;
  }

  static async findUserInfo(emailAddress) {
    const respond = await asyncGetUserByEmailAddress(emailAddress);

    if (respond === null) {
      return null;
    }

    const user = new User(
      respond.emailAddress,
      respond.password,
      respond.firstName,
      respond.lastName,
      respond.jobTitle,
      respond.userId,
      respond.createdOn
    );

    return user;
  }
}

module.exports = User;
