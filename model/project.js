const {
  validateCharLength,
  stringValidator,
  intValidator,
  stringValidatorAllowNull,
  intValidatorAllowNull,
} = require('../helper/validator');
const { pool } = require('../dbConnection');

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
    const res = await this.asyncAddProject();
    this.projectId = res[0][0].projectId;
  }

  async asyncAddProject() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CALL createProject(?,?,?,?)',
        [this.projectName, this.projectDescription, this.projectLeaderId, this.projectManagerId],
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

  async updateProjectInfo() {
    if (this.projectId === null) {
      throw new Error('projectId is not set');
    }

    await this.asyncUpdateProjectById();
  }

  async asyncUpdateProjectById() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CALL updateProjectByProjectId(?,?,?,?,?)',
        [this.projectId, this.projectName, this.projectDescription, this.projectLeaderId, this.projectManagerId],
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

  async deleteProjectInfo() {
    if (this.projectId === null) {
      throw new Error('projectId is not set');
    }

    await this.asyncDeleteProjectById();
  }

  async asyncDeleteProjectById() {
    return new Promise((resolve, reject) => {
      pool.query('CALL deleteProjectByProjectId(?)', [this.projectId], (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  }
}

module.exports = Project;
