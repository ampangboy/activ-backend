const {
  validateCharLength,
  stringValidator,
  intValidator,
  stringValidatorAllowNull,
  intValidatorAllowNull,
} = require('../helper/validator');

class Project {
  #projectName;

  #projectLeaderId;

  #projectManagerId;

  #projectId;

  #projectDescription;

  constructor(projectName, projectLeaderId, projectManagerId, projectId = null, projectDescription = null) {
    this.projectName = projectName;
    this.projectLeaderId = projectLeaderId;
    this.projectManagerId = projectManagerId;
    this.projectId = projectId;
    this.projectDescription = projectDescription;
  }

  get projectName() {
    return this.#projectName;
  }

  set projectName(projectName) {
    const MAX_CHAR_LENGTH = 100;

    stringValidator(projectName);
    validateCharLength(projectName, MAX_CHAR_LENGTH);

    this.#projectName = projectName;
  }

  get projectLeaderId() {
    return this.#projectLeaderId;
  }

  set projectLeaderId(projectLeaderId) {
    intValidator(projectLeaderId);

    this.#projectLeaderId = projectLeaderId;
  }

  get projectManagerId() {
    return this.#projectManagerId;
  }

  set projectManagerId(projectManagerId) {
    intValidator(projectManagerId);

    this.#projectManagerId = projectManagerId;
  }

  get projectId() {
    return this.#projectId;
  }

  set projectId(projectId) {
    intValidatorAllowNull(projectId);

    this.#projectId = projectId;
  }

  get projectDescription() {
    return this.#projectDescription;
  }

  set projectDescription(projectDescription) {
    stringValidatorAllowNull(projectDescription);

    this.#projectDescription = projectDescription;
  }
}

module.exports = Project;
