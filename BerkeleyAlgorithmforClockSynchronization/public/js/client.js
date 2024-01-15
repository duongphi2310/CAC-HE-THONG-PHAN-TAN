let socket = io();

const delayTime = 1000;
let socketDate = new Date(Date.now());
let viewTime = document.getElementById("server_time");
let table = document.getElementById("clock-table");

socket.on("request_time", () => {
  //customClock là thời gian của client
  socket.emit("datetime", customClock());
});

socket.on("synchronize", (time) => {
  // lắng nghe được thời gian trả về từ server
  console.log("Hey! There is a new time:", new Date(time).toLocaleTimeString());

  clearInterval(interval);
  // tính toán thời gian chênh lệch đưa vào colum timeSeting
  displayDiff(time);
  //socketDate là thời gian mà client gởi tới
  socketDate = new Date(time);
  console.log("socketDate", socketDate);
  //intervalFun: điều chỉnh thời gian của client; rồi trả về
  interval = setInterval(intervalFun, delayTime);
  // viewTime.innerText = new Date(time).toLocaleTimeString();
});

socket.on("disconnect", () => {
  socket.close();
  console.log("Socket connection closed!");
});

function customClock() {
  let timeDiff = new Date(Date.now()).getSeconds() - socketDate.getSeconds();
  console.log("timeDiff", timeDiff);
  let customTime = socketDate;
  customTime.setSeconds(socketDate.getSeconds() + timeDiff);
  //console.log("custimeTime", customTime);
  return customTime;
}

// time setting in ui
function displayDiff(time) {
  //syncTime chính là thời gian sau khi đồng bộ
  let syncTime = new Date(time);
  console.log("syncTime", syncTime);
  let secondsDiff = syncTime.getSeconds() - socketDate.getSeconds();
  let minutesDiff = syncTime.getMinutes() - socketDate.getMinutes();
  let hoursDiff = syncTime.getHours() - socketDate.getHours();
  let difference = `Hours: ${Math.abs(hoursDiff)}, minutes: ${Math.abs(
    minutesDiff
  )}, seconds: ${Math.abs(secondsDiff)}`;
  addTableRow(
    socketDate.toLocaleTimeString(),
    difference,
    syncTime.toLocaleTimeString()
  );
}

function addTableRow(initialTime, timeDiff, newTime) {
  let row = table.insertRow(1);
  let startTime = row.insertCell(0);
  let diff = row.insertCell(1);
  let syncTime = row.insertCell(2);
  startTime.innerHTML = initialTime;
  diff.innerHTML = timeDiff;
  syncTime.innerHTML = newTime;
}

// lắng nghe tất cả  thời gian thay đổi của client ví dụ đổi từ 9:14 -> 9:30 từ cái edit time,
function intervalFun() {
  // viewTime: getid clock server
  viewTime.innerText = customClock().toLocaleTimeString();
  // console.log(
  //   "customClock().toLocaleTimeString()",
  //   customClock().toLocaleTimeString()
  // );
}

//oce fine!
function editTime() {
  let hoursEdit = document.getElementById("hoursControl");
  let minutesEdit = document.getElementById("minutesControl");
  let secondsEdit = document.getElementById("secondsControl");
  socketDate.setHours(hoursEdit.value);
  socketDate.setMinutes(minutesEdit.value);
  socketDate.setSeconds(secondsEdit.value);
}

// lắng nghe sự thay đổi và thay đổi trong 1000ms
let interval = setInterval(intervalFun, delayTime);
