const {
  validateCharLength,
  stringValidator,
  intValidator,
  stringValidatorAllowNull,
  intValidatorAllowNull,
} = require('../helper/validator');
const { asyncAddProject, asyncUpdateProjectById } = require('../dbSubcriber');

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

  async saveProjectInfo() {
    const res = await asyncAddProject();
    this.projectId = res.projectId;
  }

  async updateProjectInfo() {
    if (this.projectId === null) {
      throw new Error('projectId is not set');
    }

    await asyncUpdateProjectById(
      this.projectId,
      this.projectName,
      this.projectDescription,
      this.#projectLeaderId,
      this.projectManagerId
    );
  }
}

module.exports = Project;
