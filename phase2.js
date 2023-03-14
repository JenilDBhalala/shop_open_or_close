const shop_schedule = require("./data.json");

//helper function which finds when shop will be open in hours
const helperFunc = (input_time, weekdays, input_day_index, next_open_day_schedule) => {
    //finding next shop open day index in weekdays array : to find difference between two weekdays later
    const next_open_day_index = weekdays.indexOf(next_open_day_schedule.day, input_day_index);

    //finding milliseconds till input time
    const input_day_time = new Date(`01/01/2000 ${input_time}`).getTime();

    //forming next shop open day date from milliseconds
    let next_day_time = input_day_time + (next_open_day_index - input_day_index) * 24 * 60 * 60 * 1000;
    let next_day_date = new Date(next_day_time);

    //finding milliseconds till next shop open day time
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    next_day_time = new Date(`${next_day_date.toLocaleDateString('en-US', options)} ${next_open_day_schedule.open}`).getTime();

    //finding total hours between shop close day and next shop open day
    const time_diff = next_day_time - input_day_time
    const total_hours = time_diff / (1000 * 60 * 60);

    return `Closed. The shop will be open after ${total_hours} Hrs`
}


//finding if shop is open then after how much time it will be closed or
//if shop is closed then after how much time it will be open in hours
const findNextOpenTimeInHours = (input_time, input_weekday, weekdays) => {
  //finding shop is open or closed on input weekday 
  const day = shop_schedule.find((schedule) => schedule.day === input_weekday);

  //if shop is closed then finding when it will be open in total hours
  if (!day) {
    //finding index of input_weekday in weekdays array
    const input_day_index = weekdays.indexOf(input_weekday);

    //finding next shop open day
    let next_open_day_schedule;
    for (let i = input_day_index + 1; i < weekdays.length; i++) {
      const schedule = shop_schedule.find(schedule => schedule.day === weekdays[i])
      if (schedule) {
        next_open_day_schedule = schedule;
        break // stop looping once the next open day is found
      }
    }
    return helperFunc(input_time, weekdays, input_day_index, next_open_day_schedule);
  }
  else {
    let open_time_milliseconds = new Date(`01/01/2000 ${day.open}`).getTime();
    let close_time_milliseconds = new Date(`01/01/2000 ${day.close}`).getTime();

    const input_time_milliseconds = new Date(`01/01/2000 ${input_time}`).getTime();

    if (input_time_milliseconds >= open_time_milliseconds && input_time_milliseconds < close_time_milliseconds) {
      const close_time_hours = (close_time_milliseconds - input_time_milliseconds) / (1000 * 60 * 60);
      return `Open, The shop will be closed within ${close_time_hours} Hrs`;
    }
    else if (input_time_milliseconds < open_time_milliseconds) {
      const open_time_hours = (open_time_milliseconds - input_time_milliseconds) / (1000 * 60 * 60);
      return `Closed, The shop will be open after ${open_time_hours} Hrs`;
    }
    else if (input_time_milliseconds > close_time_milliseconds) {
      //shop is closed before sometime means it is open for input weekday, 
      //so we have index of input_weekday in shop_schedule array
      //so directly find index of next shop open day from shop_schedule array
      const next_day_schedule_index = (shop_schedule.findIndex((schedule) => schedule.day === input_weekday) + 1) % shop_schedule.length;

      //finding index of input_weekday in weekdays array
      const input_day_index = weekdays.indexOf(input_weekday);

      return helperFunc(input_time, weekdays, input_day_index, shop_schedule[next_day_schedule_index])
    }
  }
};

module.exports = findNextOpenTimeInHours;
