const { selectTopics } = require('../Models/topics.model')

exports.getTopics = (req, res, next) => {
  selectTopics().then((topic) => {
    res.status(200).send({topic})
  });
};