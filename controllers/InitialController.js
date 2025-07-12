// AUTO-GENERATED CONTROLLER for InitialService from InitialService.js

const InitialService = require('../services/InitialService.js');
const initialService = new InitialService();

exports.InitialFunction = async (req, res) => {
  try {
    // no params

    const result = await initialService.InitialFunction();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};