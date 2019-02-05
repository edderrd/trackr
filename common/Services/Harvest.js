'use strict';

const axios = require('axios');

module.exports = class Harvest {
  constructor(service) {
    this.service = service;
  }

  /**
   * list of time entries for given service
   * @param {Object} params
   */
  getTimeEntries(params = {}) {
    return this.request('get', 'time_entries', params)
    .then(({data}) => {
      return this.formatEntries(data.time_entries);
    });
  }

  /**
   * List projects assigned to current user
   * @param {object} params
   */
  getProjects(params = {}) {
    return this.request('get', 'users/me/project_assignments', params)
      .then(({data}) => data.project_assignments);
  }

  addTimeEntry(params) {
    return this.request('post', 'time_entries', params.metadata)
      .then(({data}) => this.formatEntry(data));
  }

  request(method = 'get', endpoint, params = {}) {
    let config = {
      method,
      url: this.endpoint(endpoint),
      headers: {
        Authorization: `Bearer ${this.service.settings.token}`,
        'Harvest-Account-Id': this.service.settings.accountId,
        'User-Agent': 'Trackr Api',
      },
    };

    if (method === 'get')config['params'] = params;
    else config['data'] = params;

    return axios(config);
  }

  endpoint(path) {
    return `https://api.harvestapp.com/v2/${path}`;
  }

  formatEntries(entries) {
    return entries.map(entry => {
      return this.formatEntry(entry);
    });
  }

  formatEntry(entry) {
    return {
      sourceId: `${this.service.id}-${entry.id}`,
      comment: entry.notes,
      serviceId: this.service.id,
      hours: `${entry.hours}`,
      spentOn: `${entry.spent_date}T01:00:00.000Z`,
      category: entry.task.name,
      project: entry.project.name,
      metadata: entry,
    }
  }
}
