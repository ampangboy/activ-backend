const pool = require('./dbConnection');

const asyncGetPasswordByEmailAddress = (emailAddress) =>
  new Promise((resolve, reject) => {
    pool.query('CALL getPasswordByEmailAddress(?)', [emailAddress], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      const password = results[0][0] === undefined ? null : results[0][0].password;

      resolve(password);
    });
  });

const asyncCreateUser = (emailAddress, firstName, lastName, jobTitle, password) =>
  new Promise((resolve, reject) => {
    pool.query(
      'CALL createUser(?,?,?,?,?)',
      [emailAddress, firstName, lastName, jobTitle, password],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results[0][0]);
      }
    );
  });

const asyncGetUserByEmailAddress = (emailAddress) =>
  new Promise((resolve, reject) => {
    pool.query('CALL getUserByEmailAddress(?)', [emailAddress], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      results = results[0][0] === undefined ? null : results[0][0];

      resolve(results);
    });
  });

const asyncAddProject = (projectName, projectDescription, projectLeaderId, projectManagerId) =>
  new Promise((resolve, reject) => {
    pool.query(
      'CALL createProject(?,?,?,?)',
      [projectName, projectDescription, projectLeaderId, projectManagerId],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results[0][0]);
      }
    );
  });

const asyncUpdateProjectById = (projectId, projectName, projectDescription, projectLeaderId, projectManagerId) =>
  new Promise((resolve, reject) => {
    pool.query(
      'CALL updateProjectByProjectId(?,?,?,?,?)',
      [projectId, projectName, projectDescription, projectLeaderId, projectManagerId],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      }
    );
  });

const asyncDeleteProjectById = (projectId) =>
  new Promise((resolve, reject) => {
    pool.query('CALL deleteProjectByProjectId(?)', [projectId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(results);
    });
  });

const asyncCreateActivity = (
  userId,
  assigneeId,
  name,
  description,
  projectId,
  status,
  startDate,
  plannedEndDate,
  endDate
) =>
  new Promise((resolve, reject) => {
    pool.query(
      'CALL createActivity(?,?,?,?,?,?,?,?,?)',
      [userId, assigneeId, name, description, projectId, status, startDate, plannedEndDate, endDate],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      }
    );
  });

module.exports = {
  asyncGetPasswordByEmailAddress,
  asyncCreateUser,
  asyncGetUserByEmailAddress,
  asyncAddProject,
  asyncUpdateProjectById,
  asyncDeleteProjectById,
  asyncCreateActivity,
};
