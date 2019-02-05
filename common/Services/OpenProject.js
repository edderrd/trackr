'use strict';

const axios = require('axios');

module.exports = class OpenProject {

  constructor(service) {
    this.service = service;
  }

  getTimeEntries(params = {}) {
    return this.request('get', 'time_entries', Object.assign({}, params, {
      filters: `[{"user": {"operator": "=", "values": ["${this.service.settings.userId}"]}}]`,
      pageSize: 1000,
    }))
    .then(({data}) => {
      return this.commonFormat(data._embedded.elements);
    });
  }

  request(method = 'get', endpoint, parameters = {}) {
    let params = Object.assign({}, parameters);
    let auth = {username: 'apikey', password: this.service.settings.token};
    return axios[method](this.endpoint(endpoint), {params: params, auth: auth});
  }

  endpoint(path) {
    return `${this.service.settings.domain}/api/v3/${path}`;
  }

  commonFormat(items) {
    let hoursRegex = /[a-z|A-Z]+/g;
    return items.map(item => {
      return {
        sourceId: `${this.service.id}-${item.id}`,
        comment: item.comment,
        hours: item.hours.replace(hoursRegex, ''),
        spentOn: `${item.spentOn}T01:00:00`,
        category: item._links.activity.title || null,
        task: item._links.workPackage.title  || null,
        project: item._links.project.title  || null,
        metadata: item,
        serviceId: this.service.id,
      };
    });
  }
}
