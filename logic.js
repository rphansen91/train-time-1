/* global firebase moment */

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDijnYyDgHg3Z7dPdQAaxqxrusthM8bNzU",
    authDomain: "train-time-ea86e.firebaseapp.com",
    databaseURL: "https://train-time-ea86e.firebaseio.com",
    projectId: "train-time-ea86e",
    storageBucket: "train-time-ea86e.appspot.com",
    messagingSenderId: "882269153290"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainTime = moment($("#time-input").val().trim(), "hh:mm a").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
  // Store everything into a variable.
  var train = childSnapshot.val()
  var times = calculate(train)
  // Add each train's data into the table
  var row = $('<tr>')
  row.append($('<td></td>').text(train.name))
  row.append($('<td></td>').text(train.destination))
  row.append($('<td></td>').text(train.frequency))

  var next$ = $('<td></td>').text(times.next)
  var away$ = $('<td></td>').text(times.away)
  row.append(next$)
  row.append(away$)

  setInterval(function () {
    times = calculate(train)
    next$.text(times.next)
    away$.text(times.away)
  }, 1000)

  $("#train-table > tbody").append(row);
});

function calculate (train) {
  var trainTimePretty = moment.unix(train.time).format("hh:mm a");
  var diffTime = moment().diff(moment([trainTimePretty]), "minutes");
  var tRemainder = diffTime % train.frequency;
  var minutesAway = train.frequency - tRemainder;
  return {
    away: minutesAway,
    next: moment().add(minutesAway, 'm').format("hh:mm a")
  }
}
