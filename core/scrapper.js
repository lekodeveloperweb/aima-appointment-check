const puppeteer = require("puppeteer")
const {
  envs,
  page1,
  commonCssClasses,
  page2,
  cacheKeys,
} = require("./constants")
const log = require("debug")("aima-appointment-irn-check:scrapper")
const CacheService = require("./cache")

class Scrapper {
  constructor() {
    log("Initializing scrapper...")
    this.#init()
  }

  async getCategories() {
    try {
      if (CacheService.get(cacheKeys.CATEGORIES)) {
        log("Categories found in cache.")
        return CacheService.get(cacheKeys.CATEGORIES)
      }
      await this.#goToINRPage()
      const categories = await this.#getSelectOptions(
        page2.htmlElements.category
      )
      log("Adding categories to cache.")
      CacheService.set(cacheKeys.CATEGORIES, categories)
      log("Categories added to cache.")
      return categories
    } catch (error) {
      log("Error getting categories: %s", error.message)
      throw error
    }
  }

  async getSubCategories(category) {
    try {
      if (CacheService.get(cacheKeys.getSubCategoryKey(category))) {
        log("Sub-categories found in cache.")
        return CacheService.get(cacheKeys.getSubCategoryKey(category))
      }
      let categories = CacheService.get(cacheKeys.CATEGORIES)
      if (!categories) {
        categories = await this.getCategories()
      } else {
        log("Categories found in cache.")
        await this.#goToINRPage()
      }
      const categoryValue = categories.find((c) => c.value === category).value
      if (!categoryValue) {
        throw new Error("Category not found.")
      }
      await this.#sleep(500)
      await this.page.select(page2.htmlElements.category, categoryValue)
      await this.#sleep(500)
      const subCategories = await this.#getSelectOptions(
        page2.htmlElements.subCategory
      )
      CacheService.set(cacheKeys.getSubCategoryKey(category), subCategories)
      return subCategories
    } catch (error) {
      log("Error getting sub-categories: %s", error.message)
      throw error
    }
  }

  async getMotives(category, subCategory) {
    try {
      let motives = CacheService.get(
        cacheKeys.getMotiveKey(category, subCategory)
      )
      if (motives) {
        log("Motives found in cache.")
        return motives
      }
      let subCategories = CacheService.get(
        cacheKeys.getSubCategoryKey(category)
      )
      if (!subCategories) {
        log("Sub-categories not found in cache.")
        subCategories = await this.getSubCategories(category)
      } else {
        log("Sub-categories found in cache.")
        log("Going to INR page...")
        await this.#goToINRPage()
      }
      const subCategoryValue = subCategories.find(
        (c) => c.value === subCategory
      ).value
      if (!subCategoryValue) {
        throw new Error("Sub-category not found.")
      }
      await this.#sleep(500)
      await this.page.select(page2.htmlElements.category, category)
      await this.#sleep(500)
      await this.page.select(page2.htmlElements.subCategory, subCategoryValue)
      await this.#sleep(500)
      motives = await this.#getSelectOptions(page2.htmlElements.motive)
      log("Adding motives to cache.")
      CacheService.set(cacheKeys.getMotiveKey(category, subCategory), motives)
      log("Motives added to cache.")
      return motives
    } catch (error) {
      log("Error getting motives: %s", error.message)
      throw error
    }
  }

  closeBrowser = async () => {
    try {
      if (!this.browser.connected) {
        log("Browser already closed.")
        return
      }
      log("Closing browser...")
      await this.browser.close()
      this.page = null
      log("Browser closed.")
    } catch (error) {
      log("Error closing browser: %s", error.message)
      throw error
    }
  }

  async #goToINRPage() {
    try {
      await this.#createPageContext()
      log("Going to INR page...")
      this.#sleep(500)
      const registerButton = await this.page.waitForSelector(
        page1.htmlElements.IRNButton
      )
      await registerButton.click()
      const textSelector = await this.page.waitForSelector(
        commonCssClasses.scheduleDetails
      )
      const fullTitle = await textSelector?.evaluate((el) => el.textContent)
      log("Page title: %s", fullTitle.trim())
      if (page1.title !== fullTitle.trim()) {
        throw new Error('The title of this page is "%s".', fullTitle.trim())
      }
    } catch (error) {
      log("Error going to INR page: %s", error.message)
      throw error
    }
  }

  async #createPageContext() {
    try {
      if (!this.browser.connected) {
        log("Browser not connected.")
        await this.#init()
      }
      if (this.page) {
        log("Page already created.")
        return this.page
      }
      log("Creating new page...")
      this.page = await this.browser.newPage()
      await this.page.goto(envs.SITE_URL)
      log("Setting viewport...")
      await this.page.setViewport({ width: 1440, height: 1276 })
      log("Page created.")
    } catch (error) {
      log("Error creating page: %s", error.message)
      throw error
    }
  }

  #init = async () => {
    try {
      this.browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-sandbox",
        ],
        executablePath: envs.CHROME_PATH,
      })
      log("Scrapper initialized.")
    } catch (error) {
      log("Error initializing scrapper: %s", error.message)
      throw error
    }
  }

  /**
   *
   *
   * @param {string} selector
   * @return {Promise<{value: string, text: string}[]>}
   */
  #getSelectOptions = async (selector) => {
    try {
      const selectValues = await this.page.$$eval(`${selector} option`, (els) =>
        els
          .filter((el) => el.value)
          .map((el) => ({ value: el.value, text: el.textContent }))
      )
      return selectValues
    } catch (error) {
      log("Error getting select options: %s", error.message)
      throw error
    }
  }

  #sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

module.exports = new Scrapper()
