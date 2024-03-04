export const OrderDetailScraper = async () => {
  try {
    // console.log("--3");
    let title = document.title;
    // console.log("scraper-title", title);

    let Order;
    try {
      Order = document.querySelector(
        ".ux-text.nav-heading.ux-text-heading span"
      );
    } catch (error) {
      console.error(error.message);
    }

    if (Order) {
      // console.log("Page is Loaded");
    }

    let order_id;
    try {
      let order_text = Order.innerHTML;
      // console.log(
      //   "Control Ceck ----------------------------------------> ok -1"
      // );

      let result;
      try {
        result = order_text.split(" ");
      } catch (error) {
        result = ["", "", ""];
        console.error(error.message);
      }

      order_id = result[2];
      // console.log(
      //   "Control Ceck ----------------------------------------> ok -2"
      // );
    } catch (error) {
      console.error(error.message);
    }

    let fulfilment_status;
    try {
      let fulfilemt_tag = document.querySelector(
        ".status-unfulfilled.flex-header-title.mr-5.inline-block.mb-0"
      );
      fulfilment_status = fulfilemt_tag.innerHTML;
    } catch (error) {
      let fulfilemt_tag = document.querySelector(
        ".status-fulfilled.flex-header-title.mr-5.inline-block.mb-0"
      );
      fulfilment_status = fulfilemt_tag.innerHTML;
    }

    // console.log("Control Ceck ----------------------------------------> ok -3");

    let stock_items;
    try {
      stock_items = document.querySelectorAll(".stock-item");
      // console.log("stock_items", stock_items);
    } catch (error) {
      stock_items = [];
      console.error(error.message);
    }

    // console.log("stock_items", stock_items);
    let stock_item_objects;

    try {
      stock_item_objects = Array.from(stock_items).map(function (stock_item) {
        let return_object;
        try {
          let img_tag = stock_item.querySelector(".img-thumbnail");
          // console.log("insid_map_img_tag", img_tag);

          let src;
          try {
            src = img_tag.src;
          } catch (error) {
            console.error(error.message);
          }

          let item_total_td = stock_item.querySelector(".item-total");

          let item_total_amount;
          try {
            let item_total_with_currency = item_total_td.innerHTML;
            item_total_amount = item_total_with_currency.slice(1);
            // console.log("item_total_with_currency", item_total_with_currency);
            // console.log("item_total", item_total_amount);
            if (item_total_amount.indexOf(",") !== -1) {
              let new_string = "";
              let split_array = item_total_amount.split(",");
              for (let i in split_array) {
                new_string += split_array[i];
              }
              item_total_amount = new_string;
            }
          } catch (error) {
            console.error(error.message);
          }

          let item_name_tag = stock_item.querySelector(
            ".item-name.no-decoration"
          );

          let item_name;
          try {
            item_name = item_name_tag.innerHTML;
            // console.log("item_name_tag", item_name_tag);
            // console.log("item_name", item_name);
          } catch (error) {
            console.error(error.message);
          }

          let sku_tag = stock_item.querySelector(
            ".item-option-value.text-small"
          );

          let sku;
          try {
            sku = sku_tag.innerHTML;
            // console.log("sku_tag", sku_tag);
            // console.log("sku", sku);
          } catch (error) {
            console.error(error.message);
          }

          let quantity;
          try {
            let quntity_tag = stock_item.querySelector(
              ".item-quantity.text-muted"
            );
            if (quntity_tag) {
              quantity = quntity_tag.textContent.slice(9);
            } else {
              quantity = 1;
            }
          } catch (err) {
            quantity = 1;
            console.error(err.message);
          }

          return_object = {
            image: src,
            item_total: item_total_amount,
            item_name: item_name,
            sku: sku,
            quantity: quantity,
          };
          return return_object;
        } catch (error) {
          return_object = {};
          console.error(error.message);
        }
      });
    } catch (error) {
      stock_item_objects = [];
      console.error(error.message);
    }

    let sub_total_span = document.querySelector(".no-border.subtotal span");
    let sub_total;
    try {
      let sub_total_with_currency = sub_total_span.innerHTML;
      sub_total = sub_total_with_currency.slice(1);
      // console.log("sub_total_span", sub_total_span);
      // console.log("sub_total_with_currency", sub_total_with_currency);
      // console.log("sub_total", sub_total);
      if (sub_total.indexOf(",") !== -1) {
        let new_string = "";
        let split_array = sub_total.split(",");
        for (let i in split_array) {
          new_string += split_array[i];
        }
        sub_total = new_string;
      }
    } catch (error) {
      console.error(error.message);
    }

    // console.log("stock_item_objects", stock_item_objects);

    // console.log("fulfilment_status", fulfilment_status);
    // console.log("order_id", order_id);

    let shipping_total_span = document.querySelector(
      ".no-border.shipping span"
    );

    let shipping_total;
    try {
      let shipping_total_with_currency = shipping_total_span.innerHTML;
      shipping_total = shipping_total_with_currency.slice(1);
      // console.log("shipping_total_span", shipping_total_span);
      // console.log("shipping_total_with_currency", shipping_total_with_currency);
      // console.log("shipping_total", shipping_total);
      if (shipping_total.indexOf(",") !== -1) {
        let new_string = "";
        let split_array = shipping_total.split(",");
        for (let i in split_array) {
          new_string += split_array[i];
        }
        shipping_total = new_string;
      }
    } catch (error) {
      console.error(error.message);
    }

    let total_span = document.querySelector(".no-border.total span");
    let total;
    let currency_symbol;
    try {
      let total_with_currency = total_span.innerHTML;
      total = total_with_currency.slice(1);
      currency_symbol = total_with_currency.slice(0, 1);
      // console.log("total_span", total_span);
      // console.log("total_with_currency", total_with_currency);
      // console.log("total", total);
      if (total.indexOf(",") !== -1) {
        let new_string = "";
        let split_array = total.split(",");
        for (let i in split_array) {
          new_string += split_array[i];
        }
        total = new_string;
      }
    } catch (error) {
      console.error(error.message);
    }

    // ADDRESS SECTION
    let name;
    let address;
    let street;
    let city;
    let country;
    let zip_code;
    let delevery_method;
    let phone_number;
    let email;

    let shipping_address_div = document.querySelector("#order-shipping-info");

    // VALID FOR UK---------------------------------------------------------------------------------

    let name_stronge_tag = shipping_address_div.querySelector(
      ".mb-5.clearfix.recipient-name strong"
    );
    try {
      name = name_stronge_tag.innerHTML;
    } catch (error) {
      console.log(error.message);
    }

    let address_div = shipping_address_div.querySelector(".mb-20.user-address");
    try {
      let all_address_p_tags = address_div.querySelectorAll("p");
      let all_address_p_tags_array = Array.from(all_address_p_tags);
      let length = all_address_p_tags_array.length;
      // UK CONDITION
      if (length == 3) {
        let address_1_p_tage = all_address_p_tags_array[0];
        let address_2_p_tage = all_address_p_tags_array[1];
        let city_and_pincode_p_tag = all_address_p_tags_array[length - 1];
        street = address_2_p_tage.innerHTML;
        address = address_1_p_tage.innerHTML;
        let city_and_pincode = city_and_pincode_p_tag.innerHTML;
        try {
          let city_pincode_array = city_and_pincode.split(" ");
          city = city_pincode_array[0];
          zip_code = city_pincode_array[1];
        } catch (error) {
          console.log(error.message);
        }
        // country = "UK";
      }

      // OTHER COUNTRY
      if (length == 4) {
        let address_1_p_tage = all_address_p_tags_array[0];
        let address_2_p_tage = all_address_p_tags_array[1];
        street = address_2_p_tage.innerHTML;
        address = address_1_p_tage.innerHTML;
        let city_and_pincode_p_tag = all_address_p_tags_array[length - 2];
        let city_and_pincode = city_and_pincode_p_tag.innerHTML;
        try {
          let city_pincode_array = city_and_pincode.split(" ");
          city = city_pincode_array[0];
          zip_code = city_pincode_array[1];
        } catch (error) {
          console.log(error.message);
        }
        let country_p_tag = all_address_p_tags_array[length - 1];
        country = country_p_tag.innerHTML;
      }
    } catch (error) {
      console.log(error.message);
    }

    // PHONE NUMBER SECTION
    let phone_number_p_tag = shipping_address_div.querySelector(".mb-0");
    if (phone_number_p_tag) {
      phone_number = phone_number_p_tag.textContent.trim();
    }

    let email_p_tag = shipping_address_div.querySelector(
      ".mb-10.user-email-address"
    );
    try {
      email = email_p_tag.textContent.trim();
    } catch (error) {
      console.log(error.message);
    }

    let shipping_method_p_tags =
      shipping_address_div.querySelectorAll("p.clearfix");

    let shipping_method_p_tags_array = Array.from(shipping_method_p_tags);

    try {
      let shipping_method_p_tag =
        shipping_method_p_tags_array[shipping_method_p_tags_array.length - 1];
      delevery_method = shipping_method_p_tag.querySelector("p").innerHTML;
    } catch (error) {
      console.log(error.message);
    }

    // VALID FOR INDAI---------------------------------------------------------------------------------

    // let shipping_address_p_list;
    // try {
    //   let name_strong_tag = shipping_address_div.querySelector(
    //     ".mb-5.clearfix.recipient-name strong"
    //   );
    //   name = name_strong_tag.innerHTML;

    //   shipping_address_p_list = shipping_address_div.querySelectorAll(
    //     ".mb-20.user-address p"
    //   );
    //
    // } catch (error) {
    //   shipping_address_p_list = [];
    //   console.error(error.message);
    // }

    // let shipping_address_p_array = Array.from(shipping_address_p_list);

    // for (let i = 0; i < shipping_address_p_array.length; i++) {
    //   try {
    //     if (i == 0) {
    //       address = shipping_address_p_array[0].innerHTML;
    //     }
    //     if (i == 1) {
    //       street = shipping_address_p_array[1].innerHTML;
    //     }
    //     if (i == 2) {
    //       city = shipping_address_p_array[2].innerHTML;
    //     }
    //     if (i == 3) {
    //       contory = shipping_address_p_array[3].innerHTML;
    //     }
    //     if (i == 4) {
    //       zip_code = shipping_address_p_array[4].innerHTML;
    //     }
    //   } catch (error) {
    //     console.error(error.message);
    //   }
    // }
    // let email_span = shipping_address_div.querySelector(
    //   ".mb-10.user-email-address"
    // );

    // let phone_span = document.querySelector("#order-shipping-info .mb-0");
    // try {
    //   phone_number = phone_span.textContent;
    // } catch (err) {
    //   phone_number = null;
    //   console.error(err.message + err.stack);
    // }

    // try {
    //   email = email_span.textContent;
    // } catch (error) {
    //   console.error(error.message);
    // }

    // let delevery_method_p_tag =
    //   shipping_address_div.querySelector(".clearfix p");

    // try {
    //   delevery_method = delevery_method_p_tag.innerHTML;
    // } catch (error) {
    //   console.error(error.message);
    // }

    let shipping_address = {
      name: name,
      address: address,
      street: street,
      city: city,
      country: country,
      zip_code: zip_code,
      email: email,
      phone_number: phone_number,
      delevery_method: delevery_method,
    };

    let payment;
    try {
      let paid_on;
      let is_paid_p = document.querySelector(".status-paid.mb-0");

      let paid_on_div = document.querySelector("#order-history-list div");

      if (is_paid_p) {
        let is_paid = is_paid_p.innerHTML;

        paid_on = paid_on_div.textContent;

        console.log("paid_on", paid_on);

        if (is_paid == "Paid") {
          payment = {
            amount: total,
            payment_mode: "Offline",
            currency_symbol: currency_symbol,
            payment_date: paid_on,
          };
        }
      } else {
        payment = {};
      }
    } catch (error) {
      payment = {};
    }

    let created_date_div = document.querySelector(
      ".order-history-date.no-wrap div"
    );
    let created_date = created_date_div.innerHTML;
    
    let order_object = {
      order_id: order_id,
      created_date: created_date,
      fulfilment_status: fulfilment_status,
      shipping_address: shipping_address,
      line_items: stock_item_objects,
      currency_symbol: currency_symbol,
      sub_total: sub_total,
      shipping_total: shipping_total,
      total: total,
      payment: payment,
    };

    // console.log("order_object", order_object);
    if (order_object) {
      // console.log("Data-Send Called");

      return order_object;
    }
  } catch (error) {
    console.error(error.message);
  }
};
