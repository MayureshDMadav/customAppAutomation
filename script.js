import identifiers from "./assets/identiFier.json" assert { type: "json" };
import puppeteer from "puppeteer";
import fs from "fs";
const userDataDir = "./my-profile";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir,
    args: ["--start-maximized"],
  });

  try {
    // Create a new page
    const page = await browser.newPage();

    // Enable DevTools for the current page
    await page.evaluateOnNewDocument(() => {
      // Function to open DevTools when the page loads
      window.addEventListener("DOMContentLoaded", () => {
        window.open(
          "chrome-devtools://devtools/bundled/inspector.html",
          "_blank"
        );
      });
    });

    const url = "https://partners.shopify.com/2063535/stores";
    const domainName = "mayureshtestingstore.myshopify.com";
    const merchantName = "mandymartin";

    await page.goto(url, { waitUntil: "domcontentloaded" });
    //Fetching the List of Identifiers required to be used
    for (let ids in identifiers) {
      // STEP 1: Filtering the Shop name from the List
      try {
        await page.waitForSelector(identifiers[ids].filter_Store);
        const inputField = await page.$(identifiers[ids].filter_Store);
        let currentText = await page.evaluate(
          (element) => element.value,
          inputField
        );
        if (currentText.length > 0) {
          await page.focus(identifiers[ids].filter_Store);
          await page.keyboard.down("Control");
          await page.keyboard.press("A");
          await page.keyboard.up("Control");
          await page.keyboard.press("Backspace");
        }
        await page.waitForTimeout(3000);
        await page.type(identifiers[ids].filter_Store, domainName);
        await page.waitForTimeout(2000);
        await page.click(identifiers[ids].login_Button);
      } catch (e) {
        console.log("FirstStep Failed !!!");
      }
      // STEP 2: Redirecting to another Page !!!
      try {
        let newPagePromise = new Promise((x) =>
          browser.on("targetcreated", (target) => x(target.page()))
        );
        const newPage = await newPagePromise;
        await page.waitForTimeout(2000);
        await page.close();

        // STEP 3: Select the required Options !!!
        await newPage.waitForTimeout(2000);
        try {
          console.log("Selecting  Settings !!!");
          await newPage.evaluate(() => {
            let aTag = document.querySelectorAll("a[href]");
            let arryOfaTag = [...aTag];
            for (let a in arryOfaTag) {
              if (arryOfaTag[a].textContent === "Settings") {
                arryOfaTag[a].click();
              }
            }
          });
          await newPage.waitForTimeout(2000);
          console.log("Selecting  Apps and Sales Channels !!!");
          await newPage.evaluate(() => {
            let aTag = document.querySelectorAll("a[href]");
            let arryOfaTag = [...aTag];
            for (let a in arryOfaTag) {
              if (arryOfaTag[a].textContent === "Apps and sales channels") {
                arryOfaTag[a].click();
              }
            }
          });
          await newPage.waitForTimeout(2800);
          console.log("Click on Develop App !!!");
          await newPage.evaluate(() => {
            let aTag = document.querySelectorAll("a[href]");
            let arryOfaTag = [...aTag];
            for (let a in arryOfaTag) {
              if (arryOfaTag[a].textContent === "Develop apps") {
                arryOfaTag[a].click();
              }
            }
          });
          await newPage.waitForTimeout(2800);
          console.log("Clicking on Create an APP !!!");
          await newPage.evaluate(() => {
            let aTag = document.querySelectorAll("button[type='button']");
            let arryOfaTag = [...aTag];
            for (let a in arryOfaTag) {
              if (arryOfaTag[a].textContent === "Create an app") {
                arryOfaTag[a].click();
              }
            }
          });
          await newPage.waitForTimeout(2800);
          console.log("Enter App Name !!!");
          try {
            await newPage.waitForSelector(identifiers[ids].app_name_Input);
            // await newPage.waitForTimeout(2000);
            await newPage.type(
              identifiers[ids].app_name_Input,
              merchantName + "-simpl-checkout"
            );
          } catch (e) {
            console.log("Error While Adding Name !!!");
          }
          await newPage.waitForTimeout(3000);
          console.log("Clicking on Create App");
          await newPage.evaluate(() => {
            let aTag = document.querySelectorAll("button[type='button']");
            let arryOfaTag = [...aTag];
            for (let a in arryOfaTag) {
              if (arryOfaTag[a].textContent === "Create app") {
                arryOfaTag[a].click();
              }
            }
          });
          await newPage.waitForTimeout(2800);
          try {
            await newPage.waitForSelector(identifiers[ids].create_customapp, {
              timeout: 2000,
            });
            console.log("clicking on App creation Button");
            await newPage.click(identifiers[ids].create_customapp);
          } catch (error) {
            try {
              await newPage.waitForSelector(identifiers[ids].allow_custom_app, {
                timeout: 2000,
              });
              console.log("clicking on App creation Button");
              await newPage.click(identifiers[ids].allow_custom_app);
            } catch (error) {
              console.log(
                "skipping process Extra verficiation button is missing !!!"
              );
            }
          }
          await newPage.waitForTimeout(2800);
          console.log("Starting Admin API Scopes !!!");
          try {
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("a[href]");
              let arryOfaTag = [...aTag];
              for (let a in arryOfaTag) {
                if (
                  arryOfaTag[a].textContent === "Configure Admin API scopes"
                ) {
                  arryOfaTag[a].click();
                }
              }
            });
            await newPage.waitForTimeout(3800);
            console.log("Checkbox Selection !!!");
            await newPage.waitForFunction(() => {
              const checkboxes = document.querySelectorAll(
                "input[type='checkbox']"
              );
              const checkArry = Array.from(checkboxes);
              checkArry.forEach((element, index) => {
                if (
                  [
                    0, 1, 3, 4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 23, 25, 27,
                    29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57,
                    59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 82, 83, 84,
                    85, 87, 89, 91, 93, 94, 96, 98, 100, 102, 104,
                  ].includes(index)
                )
                  element.click();
              });
              return checkboxes.length >= 97;
            });
            await newPage.waitForTimeout(2000);
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("button[type='button']");
              let arryOfaTag = [...aTag];
              for (let a in arryOfaTag) {
                if (arryOfaTag[a].textContent === "Save") {
                  arryOfaTag[a].click();
                }
              }
            });
            await newPage.waitForTimeout(2800);
            console.log("Going Back to configuration !!!");
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("a[href]");
              let arryOfaTag = [...aTag];
              for (let a in arryOfaTag) {
                if (arryOfaTag[a].textContent === "Configuration") {
                  arryOfaTag[a].click();
                }
              }
            });
          } catch (e) {
            console.log("Error while Selecting Admin API Scopes !!!");
          }
          await newPage.waitForTimeout(4000);
          console.log("Starting Store Front API !!!");
          try {
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("a[href]");
              let arryOfaTag = [...aTag];
              if (
                arryOfaTag[arryOfaTag.length - 1].textContent === "Configure"
              ) {
                arryOfaTag[arryOfaTag.length - 1].click();
              }
            });
            await newPage.waitForTimeout(4000);
            await newPage.waitForFunction(() => {
              const checkboxes = document.querySelectorAll(
                "input[type='checkbox']"
              );
              const checkArry = [...checkboxes];

              checkArry.forEach((element, index) => {
                if ([0, 2, 3, 6, 7, 11, 12, 14].includes(index)) {
                  element.click();
                }
              });

              return checkboxes.length >= 10;
            });

            await newPage.waitForTimeout(2000);

            try {
              await newPage.evaluate(() => {
                const checkboxes = document.querySelectorAll(
                  "input[type='checkbox']"
                );
                const checkArry = [...checkboxes];

                checkArry.forEach((element, index) => {
                  if ([5, 8, 9, 10].includes(index)) {
                    element.click();
                  }
                });
              });
            } catch (e) {
              console.log("Error while Clicking on Store Front API !!!");
            }
            await newPage.waitForTimeout(2800);
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("button[type='button']");
              let arryOfaTag = [...aTag];
              for (let a in arryOfaTag) {
                if (arryOfaTag[a].textContent === "Save") {
                  arryOfaTag[a].click();
                }
              }
            });
          } catch (e) {
            console.log("Error while Handling store front API !!!");
          }
          await newPage.waitForTimeout(3800);
          console.log("Installing the APP !!!");
          try {
            console.log("First Install Button !!!");
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("button[type='button']");
              let arryOfaTag = [...aTag];
              for (let a in arryOfaTag) {
                if (arryOfaTag[a].textContent === "Install app") {
                  arryOfaTag[a].click();
                }
              }
            });
            await newPage.waitForTimeout(2000);
            console.log("Second Install Button !!!");
            await newPage.evaluate(() => {
              let aTag = document.querySelectorAll("button[type='button']");
              let arryOfaTag = [...aTag];
              console.log(arryOfaTag);
              if (arryOfaTag[arryOfaTag.length - 1].textContent === "Install") {
                arryOfaTag[arryOfaTag.length - 1].click();
              }
            });
            console.log("App Installed Successfully");
            await newPage.waitForTimeout(5000);
            console.log("Reveling the token !!!");
            try {
              await newPage.waitForFunction(() => {
                let aTag = document.querySelectorAll("button[type='button']");
                let arryOfaTag = [...aTag];
                for (let a in arryOfaTag) {
                  if (arryOfaTag[a].textContent === "Reveal token once") {
                    arryOfaTag[a].click();
                  }
                }
              });
            } catch (e) {
              console.log("Token reveled Failed !!!");
            }
          } catch (e) {
            console.log(
              "Installation Failed !! Button not working or not found !!"
            );
          }
        } catch (e) {
          console.log("Error while opening options on New Page !!!");
        }
        console.log("Token revealed !!!");
        console.log(
          "============== Below are the Details of the APP ==============="
        );

        let jsonResponse = await newPage.evaluate(() => {
          let inputTag = document.querySelectorAll("input[type]");
          let inputArr = [...inputTag];
          let credentials = [];
          for (let a in inputArr) {
            credentials.push(inputArr[a].value);
          }
          let jsonResponse = {
            access_token: credentials[0],
            storefront_apiKey: credentials[1],
            app_key: credentials[2],
            app_secret: credentials[3],
          };

          let jsonData = JSON.stringify(jsonResponse);
          return jsonData;
        });

        console.log(jsonResponse);
      } catch (e) {
        console.log("Redirecting to page Failed or Login Required !!!");
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
    console.log("Login Required !!!!!!!");
  }
})();
