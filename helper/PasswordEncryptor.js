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

  comparePassword = async () => {
    const isThePassword = await bcrypt.compare(this.plainTextPassword, this.hashPassword);
    return isThePassword;
  };
}

module.exports = PasswordEncryptor;
