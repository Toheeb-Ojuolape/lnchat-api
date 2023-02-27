const { Router } = require("express")
const controller = require("../controllers/controller")
const router = Router()

router.post("/connect",controller.connect_post)
router.post("/invoice",controller.generateInvoice_post)
router.post("/balance",controller.balance_post)
router.post("/send-payment",controller.makePayment_post)
router.post("/transactions",controller.fetchtransactions_post)



module.exports = router;