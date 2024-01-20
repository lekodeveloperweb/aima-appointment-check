const express = require("express"),
  Scrapper = require("../core/scrapper"),
  router = express.Router(),
  log = require("debug")("aima-appointment-irn-check:api")

/* GET users listing. */
router.get("/categories", async (req, res, next) => {
  try {
    log("Getting categories...")
    const categories = await Scrapper.getCategories()
    res.json(categories)
  } catch (error) {
    log("Error getting categories: %s", error.message)
    res.status(500).json({ error: error.message })
  } finally {
    await Scrapper.closeBrowser()
  }
})

router.get("/categories/:id/sub-categories", async (req, res, next) => {
  try {
    log("Getting sub categories...")
    if (!req.params.id) {
      res.status(400).json({ error: "Missing category ID" })
      return
    }
    const subCategories = await Scrapper.getSubCategories(req.params.id)
    res.json(subCategories)
  } catch (error) {
    log("Error getting sub categories: %s", error.message)
    res.status(500).json({ error: error.message })
  } finally {
    await Scrapper.closeBrowser()
  }
})

router.get(
  "/categories/:id/sub-categories/:subId/motives",
  async (req, res, next) => {
    try {
      log("Getting motives...")
      if (!req.params.id) {
        res.status(400).json({ error: "Missing category ID" })
        return
      }
      if (!req.params.subId) {
        res.status(400).json({ error: "Missing sub category ID" })
        return
      }
      const motives = await Scrapper.getMotives(req.params.id, req.params.subId)
      res.json(motives)
    } catch (error) {
      log("Error getting motives: %s", error.message)
      res.status(500).json({ error: error.message })
    } finally {
      await Scrapper.closeBrowser()
    }
  }
)

module.exports = router
