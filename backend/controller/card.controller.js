const Card = require('../model/card.model');

exports.getCardDetails = async (req, res) => {
  try {
    const card = await Card.findOne({ owner: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'No card found for this user.' });
    }
    res.status(200).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateCardSettings = async (req, res) => {
  const { status, spendingLimits, enabledTransactions } = req.body;
  try {
    const card = await Card.findOne({ owner: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found.' });
    }

    if (status) card.status = status;
    if (spendingLimits) card.spendingLimits = { ...card.spendingLimits, ...spendingLimits };
    if (enabledTransactions) card.enabledTransactions = { ...card.enabledTransactions, ...enabledTransactions };

    await card.save();
    res.status(200).json({ success: true, data: card, message: 'Card settings updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};
