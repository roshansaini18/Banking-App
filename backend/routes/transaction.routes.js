const express=require("express");
const router =express.Router();
const controller=require("../controller/controller");
const transactionSchema=require("../model/transaction.model");

router.get("/",(req,res)=>{
   controller.getData(req,res,transactionSchema);
});
router.get("/summary",(req,res)=>{
   controller.getTransactionSummary(req,res,transactionSchema);
});

router.get("/account/:accountNo", async (req, res) => {
  try {
    const { accountNo } = req.params;

    const transactions = await transactionSchema.find({ accountNo });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this account number" });
    }

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
});

router.post("/",(req,res)=>{
   controller.createData(req,res,transactionSchema);
});
router.put("/:id",(req,res)=>{
   controller.updateData(req,res,transactionSchema);
});
router.delete("/:id",(req,res)=>{
   controller.deleteData(req,res,transactionSchema);
});


module.exports=router;