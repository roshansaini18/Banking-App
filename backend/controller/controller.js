const bcrypt = require("bcrypt");
const dbService = require("../services/db.service");

// GET all records
const getData = async (req, res, schema) => {
  try {
    const dbRes = await dbService.findAllRecord(schema);
    return res.status(200).json({
      message: "Record found",
      data: dbRes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// CREATE new record
const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const dbRes = await dbService.createNewRecord(data, schema);
    res.status(200).json({
      message: "Data inserted successfully",
      success: true,
      data: dbRes,
    });
  } catch (error) {
    if (error.code == 11000) {
      res.status(422).json({
        message: "Already exist",
        success: false,
        error,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        error,
      });
    }
  }
};

// UPDATE user by ID
const updateData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const dbRes = await dbService.updateRecord(id, data, schema);

    if (!dbRes) {
      return res.status(404).json({
        message: "Record not found",
      });
    }

    return res.status(200).json({
      message: "Record updated!",
      data: dbRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// DELETE record
const deleteData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const dbRes = await dbService.deleteRecord(id, schema);
    return res.status(200).json({
      message: "Record deleted!",
      data: dbRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

// FIND record by account number
const findByAccount = async (req, res, schema) => {
  try {
    const dbRes = await schema.findOne(req.body);

    if (!dbRes) {
      return res.status(404).json({
        message: "No record found",
      });
    }

    return res.status(200).json({
      message: "Record Found",
      data: dbRes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// GET transaction summary
const getTransactionSummary = async (req, res, schema) => {
  const { branch, accountNo } = req.query;
  let matchStage = {};
  if (branch) {
    matchStage.branch = branch;
  }
  if (accountNo) {
    matchStage.accountNo = Number(accountNo);
  }

  try {
    const summary = await schema.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "cr"] }, "$transactionAmount", 0],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "dr"] }, "$transactionAmount", 0],
            },
          },
          creditCount: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "cr"] }, 1, 0],
            },
          },
          debitCount: {
            $sum: {
              $cond: [{ $eq: ["$transactionType", "dr"] }, 1, 0],
            },
          },
          totalTransactions: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCredit: 1,
          totalDebit: 1,
          creditCount: 1,
          debitCount: 1,
          totalTransactions: 1,
          balance: { $subtract: ["$totalCredit", "$totalDebit"] },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(404).json({
        message: "No matching transaction found!",
      });
    }

    return res.status(200).json({
      message: "Summary fetched successfully",
      data: summary[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error calculating summary!",
      error,
    });
  }
};

module.exports = {
  createData,
  getData,
  updateData,
  deleteData,
  findByAccount,
  getTransactionSummary,
};
