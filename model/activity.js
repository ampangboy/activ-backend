const {
  intValidator,
  validateCharLength,
  stringValidator,
  stringValidatorAllowNull,
  intValidatorAllowNull,
  dateTimeValidator,
  validateEnumerator,
  dateTimeValidatorAllowNull,
} = require('../helper/validator');
const { pool } = require('../dbConnection');

class Activity {
  #activityId;

  #userId;

  #assigneeId;

  #name;

  #description;

  #projectId;

  #status;

  #startDate;

  #plannedEndDate;

  #createdOn;

  constructor(
    userId,
    assigneeId,
    name,
    projectId,
    status,
    startDate,
    plannedEndDate,
    activityId = null,
    description = null,
    endDate = null,
    createOn = null
  ) {
    this.userId = userId;
    this.assigneeId = assigneeId;
    this.name = name;
    this.status = status;
    this.projectId = projectId;
    this.startDate = startDate;
    this.plannedEndDate = plannedEndDate;
    this.description = description;
    this.activityId = activityId;
    this.endDate = endDate;
    this.createdOn = createOn;
  }

  get activityId() {
    return this.#activityId;
  }

  set activityId(activityId) {
    intValidatorAllowNull(activityId);

    this.#activityId = activityId;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    intValidator(userId);

    this.#userId = userId;
  }

  get assigneeId() {
    return this.#assigneeId;
  }

  set assigneeId(assigneeId) {
    intValidator(assigneeId);

    this.#assigneeId = assigneeId;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    const MAX_CHAR_LENGTH = 400;

    validateCharLength(name, MAX_CHAR_LENGTH);

    stringValidator(name);

    this.#name = name;
  }

  get projectId() {
    return this.#projectId;
  }

  set projectId(projectId) {
    intValidator(projectId);

    this.#projectId = projectId;
  }

  get description() {
    return this.#description;
  }

  set description(description) {
    stringValidatorAllowNull(description);

    this.#description = description;
  }

  get startDate() {
    return this.#startDate;
  }

  set startDate(startDate) {
    dateTimeValidator(startDate);

    this.#startDate = startDate;
  }

  get plannedEndDate() {
    return this.#plannedEndDate;
  }

  set plannedEndDate(plannedEndDate) {
    dateTimeValidator(plannedEndDate);

    this.#plannedEndDate = plannedEndDate;
  }

  get status() {
    return this.#status;
  }

  set status(status) {
    const ENUM = ['NS', 'IP', 'C', 'P'];
    validateEnumerator(status, ENUM);

    this.#status = status;
  }

  get createdOn() {
    return this.#createdOn;
  }

  set createdOn(createdOn) {
    dateTimeValidatorAllowNull(createdOn);

    this.#createdOn = createdOn === null ? null : createdOn;
  }

  asyncCreateActivity() {
    return new Promise((resolve, reject) => {
      pool.query(
        'CALL createActivity(?,?,?,?,?,?,?,?,?)',
        [
          this.userId,
          this.assigneeId,
          this.name,
          this.description,
          this.projectId,
          this.status,
          this.startDate,
          this.plannedEndDate,
          this.endDate,
        ],
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

  async saveActivity() {
    const respond = await this.asyncCreateActivity();
    this.activityId = respond[0][0].activityId;
  }
}

module.exports = Activity;

// const activity = new Activity(1, 1, 'New Activity', 1, 'NS', new Date('20201-01-01'), new Date('2021-01-02'));

// (async () => {
//   const id = await activity.asyncCreateActivity();
//   console.log(id);
// })();
// activity.asyncCreateActivity();