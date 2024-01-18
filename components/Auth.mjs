export const Login = async (url, user_credencials, PostRequest) => {
  console.log("Login Functio Called")
  let response = await PostRequest(url, user_credencials);
  return response;
};

export const Logout = async (dom) => {
  localStorage.clear();
  dom.login_div.hidden = false;
  dom.scrape_button.hidden = true;
  dom.logout_btn.hidden = true;
  dom.workflow_dropdown_div.hidden = true;
  dom.workflow_dropdown_lable.hidden = true;
  dom.workflow_dropdown.hidden = true;
  dom.after_loging_div.hidden = true;
  dom.appcon_logo_in_wf.hidden = true;
  dom.progress_bar_div.hidden = true;
};
