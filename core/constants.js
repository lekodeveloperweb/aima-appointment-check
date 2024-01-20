const { platform } = require("os")

const PAGE_TITLE = "1. ENTITY: IRN Registo"
const PAGE_2_TITLE =
  "2. SUBJECT: Citizen / Residence permit / Renewal of residence permit / Number of cases 1"
const PAGE_3_TITLE = "3."

const commonCssClasses = {
  scheduleDetails: ".schedule-details",
}

module.exports = {
  commonCssClasses,
  cacheKeys: {
    // Cache keys
    CATEGORIES: "categories",
    getSubCategoryKey: (category) => `${category}-subcategories`,
    getMotiveKey: (category, subCategory) =>
      `${category}-${subCategory}-motive`,
  },
  page1: {
    title: PAGE_TITLE,
    htmlElements: {
      IRNButton: "button[title='IRN Registo']",
    },
    htmlClasses: {
      // CSS classes
    },
  },
  page2: {
    title: PAGE_2_TITLE,
    htmlElements: {
      category: "#IdCategoria",
      subCategory: "#IdSubcategoria",
      motive: "#IdMotivo",
      numberOfCases: "#NumCasos",
    },
    htmlClasses: {
      // CSS classes
    },
  },
  page3: {
    title: PAGE_3_TITLE,
    htmlElements: {
      // HTML element IDs
    },
    htmlClasses: {
      // CSS classes
    },
  },
  envs: {
    CHROME_PATH:
      process.env.CHROME_PATH || platform() === "linux"
        ? "/usr/bin/chromium-browser"
        : platform() === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    SITE_URL: "https://siga.marcacaodeatendimento.pt/Marcacao/Entidades",
  },
}
