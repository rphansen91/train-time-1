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
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);


  var trainTimePretty = moment.unix(trainTime).format("hh:mm a");
  console.log(trainTimePretty);
  var diffTime = moment().diff(moment([trainTimePretty]), "minutes");
  console.log(diffTime);
  var tRemainder = diffTime % trainFrequency;
  var minutesAway = trainFrequency - tRemainder;
  var minutes = moment();
  var nextTrain = moment().add(minutes).format("hh:mm a");


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
   + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");
});
