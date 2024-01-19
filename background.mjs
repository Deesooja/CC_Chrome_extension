import { PostRequest } from "./components/RestRequest.mjs";
import * as urls from "./components/urls.mjs";
import { Login, Logout } from "./components/Auth.mjs";
import * as Utility from "./components/utility.mjs";
import { GetCurrentTab } from "./components/utility.mjs";
import { GetOrderDetailPageUrlList } from "./components/OrderDetailPageUrls.mjs";
import { OrderDetailScraper } from "./components/Scraper.mjs";
import { WebhookExcuter } from "./components/WebHook.mjs";

// UserLogIn Section
export const UserLogin = async (dom) => {
  let username = dom.username;
  let password = dom.password;

  if (username.value == "" && password.value == "") {
    if (username.value == "") {
      document.getElementById("user_error").innerHTML = "username is required";
      // console.log("username is required");
    }

    if (password.value == "") {
      document.getElementById("password_error").innerHTML =
        "password is required";
      // console.log("password is required");
    }
  } else {
    // console.log("username", username.value);
    // console.log("password", password.value);

    let user_credencials = {
      username: username.value,
      password: password.value,
    };
    let login_url = urls.login_url;

    let response = await Login(login_url, user_credencials, PostRequest);
    await Utility.LoginResponseHandler(response, dom);
    return response;
  }
};


export const UserLogout = async (dom) => {
  await Logout(dom);
  
};

export const CheckLocalStoregeData = async () => {
  progress_bar.hidden = true;
  show_pergentage.hidden = true;
  if (!JSON.parse(localStorage.getItem("Islogin"))) {
    localStorage.setItem("Islogin", false);
  }
};

export const CheckUserLogin = async (dom) => {
  let is_login = JSON.parse(localStorage.getItem("Islogin"));
  await Utility.LoginCheck(is_login, dom);
};

export const StartScraping = async (dom) => {
  let btn_text = dom.scrape_button.innerHTML;

  let platform_value = await Utility.GetSelectedPlatform(dom);
  let workflow_value = await Utility.GetSelectedWorkflow(dom);
  let tab = await Utility.GetCurrentTab();

  if (workflow_value != "null") {
    localStorage.setItem("selected_workflow", JSON.stringify(workflow_value));

    localStorage.setItem("platform", JSON.stringify(platform_value));

    if (await Utility.IsThisRightPage(tab)) {
      // console.log("Yessssssssssss");
      dom.scrape_button.className = "Importing";
      dom.scrape_button.innerHTML = "Importing......";
      dom.scrape_button.disabled = true;
      dom.progress_bar.hidden = false;
      dom.show_pergentage.hidden = false;

      let order_detail_page_urls_result = await Utility.ScriptExcuter(
        tab,
        GetOrderDetailPageUrlList
      );

      let order_detail_page_urls = order_detail_page_urls_result[0].result;

      let isExcuted = [];

      if (order_detail_page_urls) {
        // Progress Bar Max VAlue
        let max_value = order_detail_page_urls.length;
        dom.progress_bar.max = max_value.toString();
        
        // Loop all Order Detale page links
        let order_list = Promise.all(
          order_detail_page_urls.map(async (link) => {
            // Update The Page Url GOTO Order Detail Page
            await Utility.UpdateTabUrl(tab, link);

            // Wait Until Page Properly Loaded
            await Utility.WaitForPageLoading(
              order_detail_page_urls,
              isExcuted,
              max_value,
              dom,
              tab
            );

            

            let scraperResult = await Utility.OrderDetailScraperCalling(
              OrderDetailScraper
            );

            try {
              scraperResult = scraperResult[0].result;
            } catch (error) {
              scraperResult = null;
              console.error(error.message)
            }
            
            if (scraperResult) {
              await WebhookExcuter(
                urls.WebhookUrl("IMPORT_ORDERS"),
                scraperResult,
                PostRequest
              );
            }
            return scraperResult;
          })
        );

        console.log("order_list", order_list);
        order_list.then(async (result) => {
          // console.log("result", result);

          try {
            dom.scrape_button.className = "Completed";
            dom.scrape_button.innerHTML = "Completed";
            let hasObject = result.some((obj) => Object.keys(obj).length != 0);

            // Send Order list On Backend Function Called
            if (hasObject) {
              //   await SendDataToBackend(result);
              alert("Job Done");
              dom.progress_bar.hidden = true;
              dom.show_pergentage.innerHTML = "0";
              dom.show_pergentage.hidden = true;
            } else {
              alert("Please Try Again");
            }
            dom.scrape_button.disabled = false;
            dom.scrape_button.className = "Import_order";
            dom.scrape_button.innerHTML = btn_text;
          } catch {
            dom.scrape_button.disabled = false;
            dom.scrape_button.className = "Import_unsuccessful";
            dom.scrape_button.innerHTML = "UnSuccessFull Try Agin";
          }
        });

        order_list.catch(() => {
          console.error("order_list->catch");
        });

        // console.log("--2");
      }
    } else {
      // console.log("Nooooooooooooooooooooo");
      dom.scrape_button.className = "Import_unsuccessful txt";
      dom.scrape_button.innerHTML = "You Are in Wrong Page";
      dom.scrape_button.disabled = true;
    }
  } else {
    alert("Please Select WorkFlow");
  }
};
