export const GetOrderDetailPageUrlList = () => {
  // console.log("--4");
  let title = document.title;
  // console.log("GetOrderDetailPageUrlList-title", title);

  let orders_listing_container = document.querySelector(
    "#orders-listing-container"
  );
  // console.log("orders_listing_container", orders_listing_container);

  let flex_table_rows_container = orders_listing_container.querySelector(
    ".flex-table-rows-container"
  );
  // console.log("flex_table_rows_container", flex_table_rows_container);

  let flex_table_rows = flex_table_rows_container.querySelectorAll(
    ".flex-table-row.cursor-pointer.hoverable"
  );

  let order_detail_page_links = Array.from(flex_table_rows).map(
    (flex_table_row) => {
      // console.log("flex_table_row", flex_table_row);

      // let order_anchor_tag = flex_table_row.querySelector(
      //   ".slim-flex-table-cell.flex-1 a"
      // );
      let order_anchor_tag = flex_table_row.querySelector(".no-decoration");
      // console.log("order_anchor_tag", order_anchor_tag);
      if (order_anchor_tag) {
        let order_detail_page_link = order_anchor_tag.href;
        return order_detail_page_link;
      }
    }
  );
  // console.log("order_detail_page_links", order_detail_page_links);

  return order_detail_page_links;
};
