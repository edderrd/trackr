'use strict';

const Services = {
  OpenProject: require('../Services/OpenProject'),
  Harvest: require('../Services/Harvest'),
};

const serviceSource = (settings) => {
  return new Services[settings.type](settings);
};

module.exports = function(Service) {
  Service.validatesInclusionOf('type', {in: ['OpenProject', 'Harvest']});

  const app = Service.app;

  /** fetch remote time entries */
  Service.beforeRemote('*.__get__timeEntries', (ctx, instance, next) => {
    let source = serviceSource(ctx.instance);
    let sourceFilters = {};
    let filter = ctx.args.filter || {};

    if (filter.from && filter.to) {
      filter.where = Object.assign({}, filter.where, {
        spentOn: {gte: filter.from, lte: filter.to},
      });
      sourceFilters.from = filter.from;
      sourceFilters.to = filter.to;
    }

    source.getTimeEntries(sourceFilters)
      .then((entries) => {
        entries.forEach((entry) => {
          Service.app.models.TimeEntry.upsertWithWhere({'sourceId': {like: `${entry.sourceId}`}}, entry, (err) => {
            if (err) console.error('cant insert or update time entry for ', ctx.instance.type, entry.comment, entry.sourceId, err, '\n\n\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
          });
        });
        next();
      })
      .catch((error) => {
        console.error(error);
        next(error);
      });
  });

  Service.beforeRemote('*.__create__timeEntries', (ctx, instance, next) => {
    let source = serviceSource(ctx.instance);
    source.addTimeEntry(ctx.args.data).then(entry => {
      ctx.args.data = entry;
      console.log(ctx.args);
      next();
    }).catch((error) => {
      console.error(error, ctx.args.data, error.stack);
      next(error);
    });
  });

  /**
   * Fetch service projects for time entries
   * @param {string} id service id
   * @param {Function(Error, array)} callback
   */
  Service.prototype.projects = function(callback) {
    serviceSource(this).getProjects()
      .then((data) => {
        callback(null, data);
      })
      .catch(error => {
        callback(null, {error: error.response.statusText});
      });
  };
};
