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

// const get_fulfiled_btn = async () => {
//   let fulfiled_btn = document.querySelector(
//     ".ux-button.ux-text.ux-text-size0.ux-text-action.ux-button-primary"
//   );

//   console.log("fulfiled_btn", fulfiled_btn);

//   if (fulfiled_btn) {
//     let clicked = fulfiled_btn.click();
//     console.log("clicked", clicked);
//   }

//   return fulfiled_btn;
// };

export const UserLogout = async (dom) => {
  // await Logout(dom);

  let tab = await Utility.GetCurrentTab();


  console.log(tab)
  // let is_process_done
  // try {
  //   is_process_done =  await Utility.fulfilment_proccess_1(tab);
  // } catch (error) {
  //   console.error(error.message);
  // }
  // console.log("is_process_done",  is_process_done)

  // let tab = await Utility.GetCurrentTab();
  // let is_fulfiled = await Utility.fulfilment_checker(tab)
  // console.log("is_fulfiled", is_fulfiled)

  // if(is_fulfiled){
  //   await Utility.fulfilment_proccess(tab);
  // }else{
  //   console.log("Aleady Fulfild")
  // }

  // let result = await Utility.ScriptExcuter(tab, Utility.fulfilmet_button_clicked);

  // await Utility.wait_for_submit_button(tab);

  // await Utility.ScriptExcuter(tab, Utility.submit_button_clicked);

  // await Utility.wait_for_fulfilment_conformation(tab)

  // console.log("Completed--------------------------------------------------------------------Done")

  // Utility.ScriptExcuter(tab, async () => {
  //   let fulfilment_status_p = document.querySelector(
  //     ".status-fulfilled.flex-header-title.mr-5.inline-block.mb-0"
  //   );
  //   let fulfilment_status = fulfilment_status_p.innerHTML
  //   console.log("fulfilment_status_p", fulfilment_status_p);
  //   console.log("fulfilment_status", fulfilment_status);
  // });

  // tab = await Utility.GetCurrentTab();

  // await new Promise((resolve, reject) => {
  //   let interval_id = setInterval(async () => {
  //     tab = await GetCurrentTab();
  //     try{

  //       result = await Utility.ScriptExcuter(tab, async () => {
  //         let popup_div = document.querySelector(".ux-dialog-details");

  //         console.log("popup_div", popup_div);

  //         console.log("Waiting for popup @@@");
  //         return popup_div;
  //       });
  //     }catch(error){
  //       console.error(error.massage)
  //     }

  //     // result = result[0].result;
  //     console.log("result!!!!!!!!!!!!!!!!",result);

  //     if (result && result[0].result) {
  //       console.log("Time To ClearInterval");
  //       clearInterval(interval_id);
  //       resolve();
  //     } else {
  //       console.log("else---result", result);
  //     }
  //   }, 2000);
  // });

  // let is_submitted = await Utility.ScriptExcuter(tab, async ()=>{
  //   let popup_div = document.querySelector(".ux-dialog-details");
  // console.log("popup_div", popup_div)

  // let submit_btn = popup_div.querySelector(".ux-button.ux-text.ux-text-size0.ux-text-action.ux-button-primary")
  // console.log("submit_btn", submit_btn)
  // submit_btn.click()

  // })

  // result = result[0].result;
  // console.log(result);
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

      // console.log("GetOrderDetailPageUrlListResult", order_detail_page_urls);
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

            // console.log("@@@@PAge-Chnage-link", link);

            // Wait Until Page Properly Loaded
            await Utility.WaitForPageLoading(
              order_detail_page_urls,
              isExcuted,
              max_value,
              dom,
              tab
            );

            // // Changing Fulfilment Status ->
            // let is_process_done
            // try {
            //   is_process_done = await Utility.fulfilment_proccess_1(tab);

            // } catch (error) {
            //   console.error(error.message);
            // } 
            // console.log("is_process_done---MAin", is_process_done)

            // await new Promise((resolve, reject)=>{
            //   const interval_id = setInterval(async ()=>{
            //     if(is_process_done){
            //       await Utility.logs("Inside Background.js - resolve")
            //       clearInterval(interval_id)
            //       resolve()
            //     }else{
            //       Utility.logs("Inside Background.js - wait for resolve")
            //     }

            //   },2000)
              
            // })




            // try {
            //   let is_fulfiled = await Utility.fulfilment_checker(tab);
            //   console.log("is_fulfiled", is_fulfiled);

            //   if (is_fulfiled) {
            //     await Utility.fulfilment_proccess(tab);
            //   } else {
            //     console.log("Aleady Fulfild");
            //   }
            // } catch (error) {
            //   console.error(error.massage);
            // }

            // Working------------------------------------------------------
            // await new Promise ((resolve, reject) => {
            //   let checkInterval = setInterval(async () => {
            //     try {

            //       tab = await Utility.GetCurrentTab()
            //       console.log("--setInterval---try");
            //       let orderInfoElement = await Utility.ScriptExcuter(tab, Utility.IsPageLoaded)

            //       console.log(
            //         "--setInterval---try->checking->orderInfoElement",
            //         orderInfoElement
            //       );
            //       console.log("--setInterval---try->checking");
            //       console.log("--setInterval---try->checking->url", tab.url);

            //       if (orderInfoElement && orderInfoElement[0].result) {
            //         console.log("isExcuted", isExcuted);

            //         console.log("link-Inside -InterVal", link);
            //         console.log("***Current PAge Url", tab.url);
            //         if (!isExcuted.includes(tab.url)) {
            //           clearInterval(checkInterval);
            //           console.log("Page Loaded--setInterval");
            //           resolve();
            //         } else {
            //           console.log(
            //             "!isExcuted.includes(tab.url)---Else ----- Part-$$$$$-"
            //           );
            //           console.log(
            //             "order_detail_page_urls",
            //             order_detail_page_urls
            //           );

            //           let non_excuted_links = await Utility.GetNonExcutedLinks(
            //             order_detail_page_urls,
            //             isExcuted
            //           );

            //           console.log(
            //             "$$$$$$$$$-non_excuted_links",
            //             non_excuted_links
            //           );

            //           if (non_excuted_links) {

            //             await Utility.CreteProgressBarValue(isExcuted, max_value, dom);

            //             // Update\ing URl here
            //             Utility.UpdateTabUrl(tab, non_excuted_links[0] )

            //           }
            //         }
            //       }
            //     } catch (error) {
            //       console.log("Page not loaded yet--setInterval");
            //       reject(error);
            //     }
            //   }, 5000);
            // });

            // let tab = await Utility.GetCurrentTab()
            // console.log("!!!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", tab.url);
            // await Utility.PushInisExcuted(isExcuted);

            // if (!isExcuted.includes(tab.url)) {
            //   isExcuted.push(tab.url);
            //   console.log("isExcuted-background-inside-if", isExcuted)
            // }
            // console.log("isExcuted-background", isExcuted);

            // isExcuted.push(tab.url);

            // let scraperResult = await SendCurrentTabOnScrapperFunc();
            // console.log("scraperResult---Here", scraperResult);

            // if (scraperResult) {
            //   await Webhook()
            // }

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
