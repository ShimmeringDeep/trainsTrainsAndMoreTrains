$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDpgKdw8by8b4CvsvVnpYlD3Up_S74Q07o",
        authDomain: "trainapp-68f44.firebaseapp.com",
        databaseURL: "https://trainapp-68f44.firebaseio.com",
        projectId: "trainapp-68f44",
        storageBucket: "trainapp-68f44.appspot.com",
        messagingSenderId: "821662992748"
    };
    firebase.initializeApp(config);

    var database = firebase.database();



    $("#addTrain").on("click", function (event) {
        event.preventDefault();


        var name = $("#name").val().trim();
        var city = $("#city").val().trim();
        var trainTime = $("#time").val().trim();
        var freq = $("#freq").val().trim();
        $("#name").val("");
        $("#city").val("");
        $("#time").val("");
        $("#freq").val("");

        database.ref("trains").push({
            name: name,
            city: city,
            trainTime: trainTime,
            freq: freq

        });

    });

    function updateDOM() {
        database.ref("trains").on("child_added", function (snapshot) {

            var freqInt = parseInt(snapshot.val().freq);
            var arrivalTime = moment(snapshot.val().trainTime, "HH:mm").subtract(1, "years");
            var diffTime = moment().diff(moment(arrivalTime), "minutes");
            var tRemainder = diffTime % freqInt;
            var tMinutesTillTrain = freqInt - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");

            // var trainKey = firebase.database().ref().push().key;

            // var edit = $("<button>").text("✎").attr("data-key", trainKey).addClass("edit");;
            // var deletebtn = $("<button>").text("x").attr("data-key", trainKey).addClass("delete");


            var newRow = $("<tr>");
            var name = $("<td>").text(snapshot.val().name);
            var city = $("<td>").text(snapshot.val().city);
            var freq = $("<td>").text(snapshot.val().freq);
            var next = $("<td>").text(moment(nextTrain).format("hh:mm"));
            var until = $("<td>").text(tMinutesTillTrain)
            newRow.append(name, city, freq, next, until, /*edit, deletebtn*/);
            $("#trainTable").append(newRow);


        })
    };
    updateDOM();

    setInterval(function () {
        $("#trainTable").empty();
        updateDOM();

    }, 60000);

    // $('body').on("click", ".delete", function () {
    //     var key = $(this).attr("data-key");
    //     console.log(key)
    //     database.ref("trains").update({key : null});
        
       
    // })
});