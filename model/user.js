const emailAddressParser = require('email-addresses');
const isString = require('is-string');

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

  constructor(emailAddress, password, firstName, lastName, jobTitle = null, userId = null) {
    this.userId = userId;
    this.emailAddress = emailAddress;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.jobTitle = jobTitle;
    this.createdOn = new Date();
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    if (!Number.isSafeInteger(userId)) {
      if (userId !== null) {
        throw new UserException(`${userId} is not a valid Number format`);
      }
    }

    this.#userId = userId;

    return this.#userId;
  }

  get emailAddress() {
    return this.#emailAddress;
  }

  set emailAddress(emailAddress) {
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
    if (!isString(password)) {
      throw new UserException(`${password} is not a valid String`);
    }

    this.#password = password;
    return this.#password;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(firstName) {
    if (!isString(firstName)) {
      throw new UserException(`${firstName} is not a valid String`);
    }

    this.#firstName = firstName;
    return this.#firstName;
  }

  get lastName() {
    return this.#firstName;
  }

  set lastName(lastName) {
    if (!isString(lastName)) {
      throw new UserException(`${lastName} is not a valid String`);
    }

    this.#lastName = lastName;
    return this.#lastName;
  }

  get jobTitle() {
    return this.#jobTitle;
  }

  set jobTitle(jobTitle) {
    if (!isString(jobTitle)) {
      if (!jobTitle === null) {
        throw new UserException(`${jobTitle} is not a valid String`);
      }
    }

    this.#jobTitle = jobTitle;
    return this.#jobTitle;
  }

  static isEmailAddress(emailAddress) {
    const addrs = emailAddressParser(emailAddress);

    return addrs !== null;
  }
}

const user = new User('zulfadhli@gmail.com', 'anypassword', 'pally', 'zaki', null);

console.log(user.jobTitle);
