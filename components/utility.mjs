export const logs = async (log) => {
  console.log(log);
};

export const LoginCheck = async (is_login, dom) => {
  if (is_login) {
    // console.log("is_login-if", is_login);
    dom.login_div.hidden = true;
    dom.logout_btn.hidden = false;

    // WorkFlow DowpDown Recreation
    try {
      let stored_workflow_info_array = JSON.parse(
        localStorage.getItem("workflow_info_array")
      );
      // console.log("stored_workflow_info_array", stored_workflow_info_array);

      stored_workflow_info_array.map((workflow_info) => {
        try {
          // console.log("workflow_info", workflow_info);
          let option_tag = document.createElement("option");
          option_tag.value = workflow_info.id;
          option_tag.innerHTML = workflow_info.workflow;
          option_tag.setAttribute("data-platform", workflow_info.platform_id);
          option_tag.className = "dw_value";
          dom.workflow.append(option_tag);
        } catch (error) {
          console.error(error.massage);
        }
      });
    } catch (error) {
      console.error(error.massage);
    }
  } else {
    // console.log("is_login-else", is_login);
    dom.scrape_button.hidden = true;
    dom.workflow_dropdown_div.hidden = true;
    dom.workflow_dropdown_lable.hidden = true;
    dom.workflow_dropdown.hidden = true;
    dom.appcon_logo_in_wf.hidden = true;
    dom.after_loging_div.hidden = true;
    dom.logout_btn.hidden = true;
  }
};

export const GetSelectedWorkflow = async (dom) => {
  let selected_option = dom.workflow.selectedOptions[0];
  let value = selected_option.value;
  return value;
};

export const GetSelectedPlatform = async (dom) => {
  let selected_option = dom.workflow.selectedOptions[0];
  let platform = selected_option.getAttribute("data-platform");
  return platform;
};

export const GetCurrentTab = async () => {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  // console.log("GetCurrentTab-called");
  let tab = tabs[0];
  return tab;
};

export const ScriptExcuter = async (tab, YourFunc) => {
  let result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: YourFunc,
  });
  //   let return_result = result[0].result;
  return result;
};

export const ScriptExcuterWithArgument = async (
  tab,
  YourFunc,
  yourArgument
) => {
  let result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: YourFunc,
    args: [yourArgument],
  });
  //   let return_result = result[0].result;
  return result;
};

export const UpdateTabUrl = async (tab, url) => {
  await chrome.tabs.update(tab.id, {
    url: url,
  });
};

export const IsPageLoaded = async (tab, url) => {
  let orderInfoElement = document.querySelector(".no-border.total span");
  // console.log(
  //   "Inside The Function >--setInterval---try->checking->orderInfoElement",
  //   orderInfoElement
  // );
  let title = document.title;
  // console.log("setInterval-title", title);
  return orderInfoElement;
};

export const IsThisRightPage = async (tab) => {
  let is_this_right_page;
  if (
    tab.url.includes("/admin/orders?ua_placement=shared_header") ||
    (tab.url.includes("/admin/orders") && !tab.url.includes("/edit"))
  ) {
    is_this_right_page = true;
  } else {
    is_this_right_page = false;
  }
  return is_this_right_page;
};

export const GetNonExcutedLinks = async (OrderDetailPageUrlList, isExcuted) => {
  let non_excuted_links = [];

  for (let avai_link of OrderDetailPageUrlList) {
    if (isExcuted.includes(avai_link)) {
      // console.log("Already Exists", avai_link);
    } else {
      non_excuted_links.push(avai_link);
    }
  }
  return non_excuted_links;
};

export const CreteProgressBarValue = async (isExcuted, max_value, dom) => {
  try {
    let progress_bar_value = isExcuted.length;
    dom.progress_bar.value = progress_bar_value.toString();

    let persentage_value =
      Math.round((progress_bar_value / max_value) * 100).toString() + "%";

    dom.show_pergentage.innerHTML = persentage_value;
  } catch (err) {
    console.error(err.massage);
  }
};

export const WaitForPageLoading = async (
  order_detail_page_urls,
  isExcuted,
  max_value,
  dom,
  tab
) => {
  await new Promise((resolve, reject) => {
    let checkInterval = setInterval(async () => {
      try {
        tab = await GetCurrentTab();
        // console.log("--setInterval---try");
        let orderInfoElement = await ScriptExcuter(tab, IsPageLoaded);

        // console.log(
        //   "--setInterval---try->checking->orderInfoElement",
        //   orderInfoElement
        // // );
        // console.log("--setInterval---try->checking");
        // console.log("--setInterval---try->checking->url", tab.url);

        if (orderInfoElement && orderInfoElement[0].result) {
          // console.log("isExcuted", isExcuted);

          // console.log("link-Inside -InterVal", link);
          // console.log("***Current PAge Url", tab.url);
          if (!isExcuted.includes(tab.url)) {
            clearInterval(checkInterval);
            // console.log("Page Loaded--setInterval");
            if (!isExcuted.includes(tab.url)) {
              isExcuted.push(tab.url);
              // console.log("isExcuted-background-inside-if", isExcuted);
            }

            // let is_process_done
            // try {
            //   is_process_done = await fulfilment_proccess_1(tab);

            // } catch (error) {
            //   console.error(error.message);
            // }
            // console.log("is_process_done---MAin", is_process_done)
            // if(is_process_done){
            //   resolve();
            // }

            // // Changing Fulfilment Status ->
            // let is_process_done
            // try {
            //   is_process_done = await fulfilment_proccess_1(tab);

            // } catch (error) {
            //   console.error(error.message);
            // }
            // console.log("is_process_done---MAin", is_process_done)

            // await new Promise((resolve, reject)=>{
            //   const interval_id = setInterval(async ()=>{
            //     if(is_process_done){
            //       await logs("Inside WaitForPageLoadingFunction - resolve")
            //       clearInterval(interval_id)
            //       resolve()
            //     }else{
            //       logs("Inside WaitForPageLoadingFunction  - wait for resolve")
            //     }

            //   },2000)

            // })

            logs("WaitForPageLoading--->> Page is loaded");
            resolve();
          } else {
            logs("WaitForPageLoading--->> Page not loaded yet");
            // console.log(
            // "!isExcuted.includes(tab.url)---Else ----- Part-$$$$$-"
            // );
            // console.log("order_detail_page_urls", order_detail_page_urls);

            let non_excuted_links = await GetNonExcutedLinks(
              order_detail_page_urls,
              isExcuted
            );

            // console.log("$$$$$$$$$-non_excuted_links", non_excuted_links);

            if (non_excuted_links) {
              await CreteProgressBarValue(isExcuted, max_value, dom);

              // Updating URl here
              UpdateTabUrl(tab, non_excuted_links[0]);
            }
          }
        }
      } catch (error) {
        // console.log("Page not loaded yet--setInterval");
        reject(error);
      }
    }, 5000);
  });

  // await new Promise((resolve, reject) => {
  //   let checkInterval = setInterval(async () => {
  //     try {
  //       // let tab = await GetCurrentTab();
  //       let orderInfoElement = await ScriptExcuter(tab, IsPageLoaded);

  //       if (orderInfoElement && orderInfoElement[0].result) {
  //         console.log(
  //           "isExcuted!@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  //           isExcuted
  //         );
  //         if (!isExcuted.includes(tab.url)) {
  //           clearInterval(checkInterval);
  //           console.log("Page Loaded--setInterval");
  //           resolve();
  //         } else {
  //           console.log(
  //             "!isExcuted.includes(tab.url)---Else ----- Part-$$$$$-"
  //           );
  //           console.log("order_detail_page_urls", order_detail_page_urls);

  //           let non_excuted_links = await GetNonExcutedLinks(
  //             order_detail_page_urls,
  //             isExcuted
  //           );

  //           console.log("$$$$$$$$$-non_excuted_links", non_excuted_links);

  //           if (non_excuted_links) {
  //             await CreteProgressBarValue(isExcuted, max_value, dom);
  //             let tab = await GetCurrentTab();
  //             // Update\ing URl here
  //             console.log(
  //               "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&@@@@@@ non_excuted_links[0]",
  //               non_excuted_links[0]
  //             );

  //             console.log(
  //               "Befor Update &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&@@@@@@ tab.url",
  //               tab.url
  //             );
  //             await UpdateTabUrl(tab, non_excuted_links[0]);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log("Page not loaded yet--setInterval");
  //       reject(error);
  //     }
  //   }, 5000);
  // });
};

export const LoginResponseHandler = async (data, dom) => {
  if (data.status_code == 200) {
    try {
      let user_id = data.data.user_id;
      let workflow_info_array = data.data.workflowIds;

      try {
        localStorage.setItem(
          "workflow_info_array",
          JSON.stringify(workflow_info_array)
        );
        // console.log("user_id", user_id);
        localStorage.setItem("user_id", JSON.stringify(user_id));
      } catch (err) {
        console.error(err.massage);
      }
      workflow_info_array.map((workflow_info) => {
        try {
          // console.log("workflow_info", workflow_info);
          let option_tag = document.createElement("option");
          option_tag.value = workflow_info.id;
          option_tag.innerHTML = workflow_info.workflow;
          option_tag.setAttribute("data-platform", workflow_info.platform_id);
          option_tag.className = "dw_value";
          dom.workflow.append(option_tag);
        } catch (err) {
          console.error(err.massage);
        }
      });
    } catch (err) {
      console.error(err.massage);
    }
    dom.login_btn = "Login";
    localStorage.setItem("Islogin", true);
    dom.login_div.hidden = true;
    dom.scrape_button.hidden = false;
    dom.after_loging_div.hidden = false;
    dom.workflow_dropdown_div.hidden = false;
    dom.workflow_dropdown_lable.hidden = false;
    dom.workflow_dropdown.hidden = false;
    dom.appcon_logo_in_wf.hidden = false;
    dom.logout_btn.hidden = false;
    // console.log("data.status_code == 200", data.status_code);
  } else {
    let res_msg = data.massage;
    alert(res_msg);
  }
};

export const PushInisExcuted = async (isExcuted) => {
  let tab = await GetCurrentTab();
  // console.log(
  //   "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! PushInisExcuted ",
  //   tab.url
  // );
  isExcuted.push(tab.url);
  //   if (!isExcuted.includes(tab.url)) {
  //     isExcuted.push(tab.url);
  //   }
};

export const OrderDetailScraperCalling = async (OrderDetailScraper) => {
  let tab = await GetCurrentTab();
  let scraperResult = await ScriptExcuter(tab, OrderDetailScraper);
  return scraperResult;
};

export const fulfilmet_button_clicked = async () => {
  let result = false;

  let fulfiled_btn = document.querySelector(
    ".ux-button.ux-text.ux-text-size0.ux-text-action.ux-button-primary"
  );

  // console.log("fulfiled_btn", fulfiled_btn);

  if (fulfiled_btn) {
    let clicked = fulfiled_btn.click();
    // console.log("clicked", clicked);
    result = true;
  }
  return result;
};

export const submit_button_clicked = async () => {
  let popup_div = document.querySelector(".ux-dialog-details");
  // console.log("popup_div", popup_div);

  let submit_btn = popup_div.querySelector(
    ".ux-button.ux-text.ux-text-size0.ux-text-action.ux-button-primary"
  );
  // console.log("submit_btn", submit_btn);

  submit_btn.click();
};

export const wait_for_submit_button = async (tab) => {
  let got_it;
  await new Promise((resolve, reject) => {
    let max_try = 0;
    let interval_id = setInterval(async () => {
      tab = await GetCurrentTab();
      let result;
      try {
        result = await ScriptExcuter(tab, async () => {
          let popup_div = document.querySelector(".ux-dialog-details");

          // console.log("popup_div", popup_div);

          // console.log("Waiting for popup @@@");
          return popup_div;
        });
      } catch (error) {
        console.error(error.massage);
      }
      // console.log("result!!!!!!!!!!!!!!!!", result);

      if (result && result[0].result) {
        console.log("Time To ClearInterval");
        clearInterval(interval_id);
        got_it = true;
        resolve();
        // return got_it;
      } else {
        logs("wait_for_submit_button---->>else---result " + result);
        if (max_try == 4) {
          got_it = true;
          logs("Resolve After completed max_try");
          resolve();
        }
        // console.log("wait_for_submit_button---->>else---result", result);
        max_try += 1;
      }
    }, 2000);
  });

  // console.log("wait_for_submit_button---> got_it", got_it);

  return got_it;
};

export const wait_for_fulfilment_conformation = async (tab) => {
  await new Promise((resolve, reject) => {
    let interval_id = setInterval(async () => {
      tab = await GetCurrentTab();
      let result;

      try {
        result = await ScriptExcuter(tab, async () => {
          let fulfilment_status_p = document.querySelector(
            ".status-fulfilled.flex-header-title.mr-5.inline-block.mb-0"
          );

          // console.log("fulfilment_status_p", fulfilment_status_p);
          if (
            fulfilment_status_p &&
            fulfilment_status_p.innerHTML == "Fulfilled"
          ) {
            let fulfilment_status = fulfilment_status_p.innerHTML;
            // console.log("fulfilment_status", fulfilment_status);

            return fulfilment_status;
          }
        });
      } catch (error) {
        console.error(error.massage);
      }
      // console.log("result!!!!!!!!!!!!!!!!", result);

      if (result && result[0].result) {
        // console.log("Time To ClearInterval");
        clearInterval(interval_id);
        resolve();
      } else {
        // console.log(
        //   "wait_for_fulfilment_conformation-->>else---result",
        //   result
        // );
      }
    }, 1000);
  });
};

// export const fulfilment_proccess_old = async (tab) => {
//   tab = await GetCurrentTab();

//   let result = await ScriptExcuter(tab, fulfilmet_button_clicked);

//   await wait_for_submit_button(tab);

//   await ScriptExcuter(tab, submit_button_clicked);

//   await wait_for_fulfilment_conformation(tab);

//   console.log(
//     "Completed--------------------------------------------------------------------Done"
//   );
// };

export const fulfilment_checker = async (tab) => {
  tab = await GetCurrentTab();
  let result;

  try {
    result = await ScriptExcuter(tab, async () => {
      let fulfilment_status_p = document.querySelector(
        ".status-fulfilled.flex-header-title.mr-5.inline-block.mb-0"
      );

      if (!fulfilment_status_p) {
        fulfilment_status_p = document.querySelector(
          ".status-unfulfilled.flex-header-title.mr-5.inline-block.mb-0"
        );
      }

      // console.log("fulfilment_status_p", fulfilment_status_p);
      // console.log(
      //   "fulfilment_status_p.innerHTML == Fulfilled",
      //   fulfilment_status_p.innerHTML == "Fulfilled"
      // );

      if (fulfilment_status_p && fulfilment_status_p.innerHTML == "Fulfilled") {
        let fulfilment_status = fulfilment_status_p.innerHTML;
        // console.log("inside the if ----> fulfilment_status", fulfilment_status);
        result = false;
        return result;
      } else {
        result = true;
        return result;
      }
    });
    if (result && result[0].result) {
      result = result[0].result;
    }
  } catch (error) {
    console.error(error.massage);
  }
  return result;
};

export const fulfilment_proccess_1 = async (tab) => {
  tab = await GetCurrentTab();
  let is_process_done;
  await new Promise(async (resolve, reject) => {
    let is_fulfiled = await fulfilment_checker(tab);

    // console.log("is_fulfiled", is_fulfiled);

    if (is_fulfiled && is_fulfiled[0]) {
      is_fulfiled = is_fulfiled[0].result;
      // console.log("inside if ---> is_fulfiled", is_fulfiled);
    }
    // console.log("is_fulfiled", is_fulfiled);

    if (is_fulfiled) {
      tab = await GetCurrentTab();
      let result = await ScriptExcuter(tab, fulfilmet_button_clicked);

      if (result && result[0]) {
        if (result[0].result) {
          // Double check
          let got_it;

          got_it = await wait_for_submit_button(tab);

          // console.log("got_it", got_it);

          if (got_it) {
            resolve();
            is_process_done = true;
            console.log(
              "Resolve--------------------------------------------------------------------Resolve"
            );
          }
        }
      }
    } else {
      resolve();
      is_process_done = true;
      console.log(
        "Already Fulfiled--------------------------------------------------------------------"
      );
    }
  });
  // console.log("fulfilment_proccess_1---->> is_process_done", is_process_done)
  return is_process_done;
};

// export const fulfilment_proccess = async (tab) => {
//   let is_done = false
//   await new Promise(async (resolve, reject) => {
//     tab = await GetCurrentTab();
//     let is_fulfiled = await fulfilment_checker(tab);
//     if (is_fulfiled) {
//       await ScriptExcuter(tab, fulfilmet_button_clicked);
//       await wait_for_submit_button(tab);
//       await ScriptExcuter(tab, submit_button_clicked);
//       let result =await wait_for_fulfilment_conformation(tab);
//       if (result && result[0].result) {
//         console.log(
//           "Completed--------------------------------------------------------------------Done"
//         );
//         is_done = true
//         resolve();
//         return true
//       }
//     } else {
//       console.log(
//         "Already Fulfiled--------------------------------------------------------------------"
//       );
//       resolve();
//     }
//   });
//   return is_done
// };
