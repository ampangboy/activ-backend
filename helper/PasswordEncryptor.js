const bcrypt = require('bcrypt');
const { stringValidator } = require('./validator');

class PasswordEncryptor {
  #plainTextPassword;

  constructor(plainTextPassword) {
    this.plainTextPassword = plainTextPassword;
    this.hashPassword = null;
  }

  get plainTextPassword() {
    return this.#plainTextPassword;
  }

  set plainTextPassword(plainTextPassword) {
    stringValidator(plainTextPassword);

    this.#plainTextPassword = plainTextPassword;
  }

  encryptPassword = async () => {
    const saltRounds = 10;

    this.hashPassword = await bcrypt.hash(this.plainTextPassword, saltRounds);
  };
}

module.exports = PasswordEncryptor;
