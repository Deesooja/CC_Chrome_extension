import {
  UserLogin,
  UserLogout,
  CheckUserLogin,
  CheckLocalStoregeData,
  StartScraping,
} from "./background.mjs";

// All Required Elements
let scrape_button = document.getElementById("scrapeButton");

let login_div = document.getElementById("login_div");

let login_btn = document.getElementById("submitbtn");

let workflow_dropdown_div = document.getElementById("workflow_dropdown");

let workflow_dropdown_lable = document.getElementById("wf_lable");

let workflow_dropdown = document.getElementById("workflow");

let after_loging_div = document.getElementById("after_loging_section");

let appcon_logo_in_wf = document.getElementById("logo_for_wf");

let appcon_logo_in_login = document.getElementById("logo_for_login");

let workflow = document.getElementById("workflow");

let logout_btn = document.getElementById("logout_btn");

let progress_bar_div = document.getElementById("progress_bar_div");

let progress_bar = document.getElementById("progress_bar");

let show_pergentage = document.getElementById("show_pergentage");

let username = document.getElementById("uname");

let password = document.getElementById("password");

let dom = {
  scrape_button: scrape_button,
  login_div: login_div,
  login_btn: login_btn,
  logout_btn: logout_btn,
  workflow_dropdown_div: workflow_dropdown_div,
  workflow_dropdown_lable: workflow_dropdown_lable,
  workflow_dropdown: workflow_dropdown,
  after_loging_div: after_loging_div,
  appcon_logo_in_wf: appcon_logo_in_wf,
  appcon_logo_in_login: appcon_logo_in_login,
  workflow: workflow,
  progress_bar_div: progress_bar_div,
  progress_bar: progress_bar,
  show_pergentage: show_pergentage,
  username: username,
  password: password,
};

// When The Window Is loaded
window.addEventListener("load", async () => {
  try {
    await CheckLocalStoregeData();
  } catch (error) {
    console.error(error.massage);
  }

  try {
    await CheckUserLogin(dom);
  } catch (error) {
    console.error(error.massage);
  }
});

// OnClick UserLogout Function Call
logout_btn.addEventListener("click", async () => {
  login_btn.innerHTML = "Login"
  await UserLogout(dom);
});

// OnClick UserLogin Function Call
login_btn.addEventListener("click", async () => {

  login_btn.innerHTML = "Please Wait";
  await UserLogin(dom);
});

// OnClick StartScraping Function Call
scrape_button.addEventListener("click", async () => {
  StartScraping(dom);
});
