const Newsletter = require('../models/newsletter.model');

const getEmails = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  Newsletter.paginate({}, options)
    .then((newsletter) => {
      res.status(200).send({
        ok: true,
        newsletter,
      });
    })
    .catch(() => {
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener los emails',
      });
    });
};

const newSubscription = (req, res) => {
  const { email } = req.body;
  const newEmail = new Newsletter({ email: email.toLowerCase() });
  newEmail.save() 
    .then(() => { 
      res.status(200).send({ 
        ok: true, 
        msg: 'Subscripción  satisfactoria' 
      }) 
    })
    .catch(() => { 
      res.status(500).json({ 
        ok: false, 
        msg: 'Error realizar la subscription' 
      }) 
    });
};

const cancelSubscription = (req, res) => {
  const { email } = req.body;
  Newsletter.findOneAndDelete({ email: email.toLowerCase() })
    .then(() => {
      res.status(200).send({
        ok: true,
        msg: 'Cancelación de subscripción satisfactoria',
      });
    })
    .catch(() => {
      res.status(500).json({
        ok: false,
        msg: 'Error al cancelar la subscripción',
      });
    });
};

module.exports = {
  getEmails,
  newSubscription,
  cancelSubscription,
};