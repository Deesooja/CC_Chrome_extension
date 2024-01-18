export const PostRequest = async (url, body) => {
  // console.log("PostRequest Function IS called");
  // console.log("PostRequest url", url);
  // console.log("PostRequest body", body);
  let return_respponse;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("data", data);
      return_respponse = data;
    });
  return return_respponse;
};
