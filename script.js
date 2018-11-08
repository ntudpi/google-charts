google.charts.load('current', {'packages':['gantt']});    
google.charts.setOnLoadCallback(drawChart);

let chart;

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

function drawChart() {
  console.log("drawChart is invoked.");

  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  let rows = Array.prototype.slice.call(document.getElementById('table').rows);

  for (let i = 1; i < rows.length; i++) {
    let c = Array.prototype.slice.call(rows[i].cells);
    let fetched = c.map(td => td.innerHTML);
    fetched.shift();
    data.addRows([processFetched(fetched)]);
  }

  const options = {
    height: 275
  };

  chart = new google.visualization.Gantt(document.getElementById('chart'));

  chart.draw(data, options);
}

function processFetched(fetched) {
  // console.log("processFetched is invoked.");

  // Reformat fetched to something like
  // ['Research',  'Find sources',         new Date(2018, 9, 1), new Date(2018, 9, 5),   null,                   100,  null]
  // Read sample.txt for more info on data.addRows().
}

function addToTable(row) {
  // console.log(row);

  if (row['startDate'] !== null) {
    let startDate = row['startDate'].split("-");
    startDate[1] = parseInt(startDate[1], 10) - 1;
    row['startDate'] = startDate[0] + "-" + startDate[1].toString() + "-" + startDate[2];
  }

  let endDate = row['endDate'].split("-");
  endDate[1] = parseInt(endDate[1], 10) - 1;
  row['endDate'] = endDate[0] + "-" + endDate[1].toString() + "-" + endDate[2];

  row['duration'] = row['duration'].toString();

  row['percentComplete'] = parseInt(row['percentComplete'], 10);

  let table = document.getElementById("table");
  let tableBody = table.getElementsByTagName('tbody')[0];

  let toInsertRow = tableBody.insertRow(tableBody.rows.length);

  let cell0 = toInsertRow.insertCell(0);
  let cell1 = toInsertRow.insertCell(1);
  let cell2 = toInsertRow.insertCell(2);
  let cell3 = toInsertRow.insertCell(3);
  let cell4 = toInsertRow.insertCell(4);
  let cell5 = toInsertRow.insertCell(5);
  let cell6 = toInsertRow.insertCell(6);
  let cell7 = toInsertRow.insertCell(7);

  cell0.innerHTML = tableBody.rows.length;
  cell1.innerHTML = row['taskID'];
  cell2.innerHTML = row['taskName'];
  cell3.innerHTML = row['startDate'];
  cell4.innerHTML = row['endDate'];
  cell5.innerHTML = row['duration'];
  cell6.innerHTML = row['percentComplete'];
  cell7.innerHTML = row['dependencies'];

  if (table.classList.contains("d-none")) {
    table.classList.remove("d-none");
  }
}

function validateTaskID(taskID) {
  // console.log("validateTaskID is invoked.");

  if (taskID === "") {
    showAlertMessage("Oops!", "You must provide a task ID!");
    return false;
  } else {
    hideAlertMessage();
  }

  removeCircularDependency(taskID);

  return true;
}

function removeCircularDependency(taskID) {
  // console.log("removeCircularDependency is invoked.");

  let dependencies = document.getElementById("dependencies");

  let curCheckbox;
  for (let i = 4; i <= 12; i += 2) {
    curCheckbox = dependencies.childNodes[i].firstElementChild;
    if (curCheckbox.disabled) {
      curCheckbox.disabled = false;
    }
  }

  if (document.getElementById(taskID).checked) {
    document.getElementById(taskID).checked = false;
  }

  document.getElementById(taskID).disabled = true;
}

function validateTaskName(taskName) {
  // console.log("validateTaskName is invoked.");

  if (taskName === "") {
    showAlertMessage("Oops!", "You must provide a task name!");
    return false;
  } else {
    hideAlertMessage();
  }

  return true;
}

function validateDateAndDuration() {
  // console.log("validateDateAndDuration is invoked.");

  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const duration = document.getElementById('duration').value;

  let returnValue;

  if (endDate === "") {
    showAlertMessage("Oops!", "You must enter end date!");
    returnValue = false;

  } else if ((startDate === "" && duration === "") || (startDate !== "" && duration !== "")) {
    showAlertMessage("Oops!", "You must provide either one of start date or duration!");
    returnValue = false;

  } else {
    hideAlertMessage();
    returnValue = startDateLessThanEndDate(startDate, endDate);
  }

  return returnValue;
}

function startDateLessThanEndDate(startDate, endDate) {
  // console.log("validateDateAndDuration is invoked.");

  if (startDate !== "") {
    if ((new Date(startDate)).getTime() > (new Date(endDate)).getTime()) {
      showAlertMessage("Duh!", "Start date must be earlier than end date sia!");
      return false;
    } else if ((new Date(startDate)).getTime() === (new Date(endDate)).getTime()) {
      showAlertMessage("Oops!", "Duration of tasks must be at least 1 day!");
    }
  }

  return true;
}

function validateDuration(duration) {
  // console.log("validateDuration is invoked.");

  const parsed = parseInt(duration, 10);

  let returnValue;

  if (parsed < 1 || parsed > 30) {
    showAlertMessage("Oops!", "Duration must be between 1 and 30 days, inclusive!");
    returnValue = false;
  } else {
    hideAlertMessage();
    returnValue = validateDateAndDuration();
  }

  return returnValue;
}

function validatePercentComplete(percentComplete) {
  // console.log("validatePercentComplete is invoked.");

  if (percentComplete === "") {
    showAlertMessage("Oops!", "You must provide a percentage value of completion!");
    return false;
  } else {
    hideAlertMessage();
  }

  return true;
}

function showAlertMessage(lead, message) {
  // console.log("showAlertMessage is invoked.");

  const alertMessage = document.getElementById('alert-message');

  if (!alertMessage.hasChildNodes()) {
    alertMessage.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show");
    alertMessage.setAttribute("role", "alert");

    const textNode = document.createTextNode(message);
    const strong = document.createElement('strong');
    strong.innerHTML = lead + " ";

    alertMessage.appendChild(strong);
    alertMessage.appendChild(textNode);
  
  } else if (alertMessage.childNodes[0].innerHTML !== (lead + " ") ||
      alertMessage.childNodes[1].nodeValue !== message) {
    
    const textNode = document.createTextNode(message);
    const strong = document.createElement('strong');
    strong.innerHTML = lead + " ";

    while (alertMessage.firstChild) {
      alertMessage.removeChild(alertMessage.firstChild);
    }

    alertMessage.appendChild(strong);
    alertMessage.appendChild(textNode);

    alertMessage.classList.remove("d-none");

  } else {
    alertMessage.classList.remove("d-none");
  }
}

function hideAlertMessage() {
  // console.log("hideAlertMessage is invoked.");

  const alertMessage = document.getElementById('alert-message');

  if (alertMessage.hasChildNodes()) {
    alertMessage.classList.add("d-none");
  }
}

function validateForm() {
  const taskID = document.getElementById('taskID').value;
  const taskName = document.getElementById('taskName').value;
  const duration = document.getElementById('duration').value;
  const percentComplete = document.getElementById('percentComplete').value;

  if (validateTaskID(taskID) && validateTaskName(taskName) && validateDateAndDuration() &&
    validateDuration(duration) && validatePercentComplete(percentComplete)) {
    // console.log("Submitting form...");
    return true;
  }

  return false;
}

document.getElementById("btn-submit").addEventListener("click", function(e){
  e.preventDefault();

  if (validateForm()) {
    let row = new Object();

    row['taskID'] = document.getElementById('taskID').value;
    row['taskName'] = document.getElementById('taskName').value;

    const startDate = document.getElementById('startDate').value;
    row['startDate'] = (startDate === "") ? null : startDate;

    row['endDate'] = document.getElementById('endDate').value;

    let duration = document.getElementById('duration').value;

    if (duration !== "") {
      duration = parseInt(duration, 10);
    }
    
    row['duration'] = duration;

    row['percentComplete'] = parseInt(document.getElementById('percentComplete').value);
    
    let dependencies = document.getElementById("dependencies");

    // console.log(dependencies.childNodes);

    let noChecked = true;
    let depToReturn = "";
    let currentCheckbox;

    for (let i = 4; i <= 12; i += 2) {
      currentCheckbox = dependencies.childNodes[i];
      
      if (currentCheckbox.firstElementChild.checked) {
        depToReturn += currentCheckbox.textContent.replace(/\s/g,'') + ",";
        noChecked = false;
      }
    }

    row['dependencies'] = noChecked ? null : depToReturn.slice(0, depToReturn.length - 1);

    addToTable(row);
  }
});

document.getElementById("btn-draw").addEventListener("click", (e) => {
  e.preventDefault();
  drawChart();
});