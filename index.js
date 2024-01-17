const puppeteer = require("puppeteer")

console.log("Starting...")
;(async () => {
  const PAGE_TITLE = "1. ENTITY: IRN Registo"
  const PAGE_2_TITLE =
    "2. SUBJECT: Citizen / Residence permit / Renewal of residence permit / Number of cases 1"
  const PAGE_3_TITLE = "3."
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto("https://siga.marcacaodeatendimento.pt/Marcacao/Entidades")

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })
  const registerButton = await page.waitForSelector(
    "button[title='IRN Registo']"
  )
  await registerButton.click()

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(".schedule-details")
  const fullTitle = await textSelector?.evaluate((el) => el.textContent)

  if (PAGE_TITLE !== fullTitle.trim()) {
    console.log('The title of this page is "%s".', fullTitle.trim())
    await browser.close()
    return
  }

  const category = await page.waitForSelector("#IdCategoria")
  await category.select("22002")
  await sleep(500)
  const subCategory = await page.waitForSelector("#IdSubcategoria")
  await subCategory.select("30825")
  await page.waitForSelector("#dv_mensagemAlertaAssunto")
  await sleep(500)
  await goNextPage(page)
  const subTitle = await page.waitForSelector(
    ".schedule-details h5:nth-child(2)"
  )
  const fullSubTitle = await subTitle?.evaluate((el) => el.textContent)
  if (fullSubTitle !== PAGE_2_TITLE) {
    console.log("The title of this page is %s.", fullSubTitle?.trim())
    await browser.close()
    return
  }
  let district = await page.waitForSelector("#IdDistrito")
  const districtValues = await page.$$eval("#IdDistrito option", (els) =>
    els
      .filter((el) => el.value && !el.text?.startsWith("ILHA"))
      .map((el) => ({ value: el.value, text: el.textContent }))
  )
  const length = await district.evaluate((el) => el.options.length)
  console.log(
    "Total district: ",
    length,
    " Districts: \n",
    districtValues.map((x) => x.text).join(" / "),
    "\n"
  )
  for (let i = 0; i < districtValues.length; i++) {
    const locality = await page.waitForSelector("#IdLocalidade")
    district = await page.waitForSelector("#IdDistrito")
    const { value: optionValue, text: districtText } = districtValues[i]
    await district.select(optionValue)
    await sleep(1000)
    const value = await page.evaluate(() => {
      return document.querySelector("#IdLocalidade").options?.item(1)?.value
    })
    let localityText = "ALL PLACES"
    const hasAllPlace = value === "-1"
    if (hasAllPlace) {
      await locality.select(value)
    } else {
      localityText = await page.$$eval(
        "#IdLocalidade option",
        (els) =>
          els.find((el) => Number(el.value) > 0)?.textContent || "Unknown",
        optionValue
      )
    }
    console.log(`${districtText}:${localityText} `)
    await goNextPage(page)
    const subTitle3 = await page.waitForSelector(
      ".schedule-details h5:nth-child(3)"
    )
    const fullSubTitle3 = await subTitle3?.evaluate((el) => el.textContent)
    if (!fullSubTitle3?.trim()?.startsWith(PAGE_3_TITLE)) {
      console.log("The title of this page is %s.", fullSubTitle3?.trim())
      break
    }
    const error = await page.evaluate(() =>
      document.querySelector(".error-message > div > div")?.textContent?.trim()
    )
    if (error) {
      console.log("⇝", error)
      await goPreviousPage(page)
    } else {
      console.log("schedule is available in: ", districtText)
      break
    }
  }
  await browser.close()
})().finally(() => process.exit(0))

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function goNextPage(page) {
  const button = await page.waitForSelector("#liProximoButton > a")
  await Promise.all([
    button.click(),
    page.waitForNavigation({
      waitUntil: "networkidle0",
    }),
  ])
}
async function goPreviousPage(page) {
  const button = await page.waitForSelector("#liVoltarButton > a")
  await Promise.all([
    button.click(),
    page.waitForNavigation({
      waitUntil: "networkidle0",
    }),
  ])
}
