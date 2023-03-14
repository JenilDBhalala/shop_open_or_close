const shop_schedule = require("./data.json");

//finding shop status whether shop is open or closed
const findShopStatus = (input_time, input_weekday) => {
  const day = shop_schedule.find((days) => days.day === input_weekday);

  if (!day) {
    return "Closed";
  }

  //converting time to milliseconds
  const open_time = new Date(`01/02/2000 ${day.open}`).getTime();
  const close_time = new Date(`01/02/2000 ${day.close}`).getTime();
  input_time = new Date(`01/02/2000 ${input_time}`).getTime();

  if (input_time >= open_time && input_time < close_time) {
    return "Open";
  }
  else {
    return "Closed";
  }
};

module.exports = findShopStatus;


