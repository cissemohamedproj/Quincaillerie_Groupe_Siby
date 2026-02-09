const Bon = require('../models/Bon');

exports.createBon = async (req, res) => {
  try {
    const result = await Bon.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json(result);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
};

exports.updateBon = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Bon.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    return res.status(201).json(result);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
};

exports.getAllBon = async (req, res) => {
  try {
    const result = await Bon.find().populate('user').sort({ createdAt: -1 });

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
};
exports.getBon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Bon.findById(id).populate('user');
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
};

exports.deleteBon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Bon.findByIdAndDelete(id);

    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
};
