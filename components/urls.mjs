const protocall = "http";
const domain = "127.0.0.1:8000";

// const protocall = "https";
// const domain = "useappconnect.com:8005";

export const login_url = `${protocall}://${domain}/chrome-extension/login/godaddy`;

export const final_receiver_url = `${protocall}://${domain}/scrap-data/receiver`;

export const WebhookUrl = (action) => {
  let stored_selected_workflow_id = JSON.parse(
    localStorage.getItem("selected_workflow")
  );

  let stored_platform_id = JSON.parse(localStorage.getItem("platform"));

  let webhook_url = `${protocall}://${domain}/webhook/${stored_selected_workflow_id}/${action}/${stored_platform_id}`;
  return webhook_url
};

