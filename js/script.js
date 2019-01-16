const quizContainer = document.querySelector("#quiz");
const resultsContainer = document.querySelector("#results");
const newButton = document.querySelector("#new");
const submitButton = document.querySelector("#submit");
const shareButton = document.querySelector("#share");
const saveButton = document.querySelector("#save");
var listOfQuestions = [];
let numCorrect = 0;

var initiateQuiz = function(){
    var jQuiz = new XMLHttpRequest();
    jQuiz.open("GET", "https://api.myjson.com/bins/i90a0");
    jQuiz.addEventListener("load", function(){
        var data = JSON.parse(jQuiz.responseText);
        
        listOfQuestions = data;
        resultsContainer.innerHTML = "";
        var output = [];
        quizContainer.innerHTML = '<img srs="images/loader.gif">';
        
        listOfQuestions.forEach((currentQuestion, questionNumber) => {
            var answers = [];
            
            for (letter in currentQuestion.answers){
                answers.push(
                    `<label>
                        <input type="checkbox" name="question${questionNumber}" class="clearMe" value="${letter}">
                        ${currentQuestion.answers[letter]}
                    </label>`
                );
            }
            
            output.push(
                `<div class="question"> ${currentQuestion.question} </div>
                 <div class="answers"> ${answers.join("")} </div>`
            );
            
        });
        
        quizContainer.innerHTML = output.join("");
    });
    jQuiz.send();
    $("html, body").animate({ scrollTop: 0}, "slow")
};

var getResults = function(){
    if (resultsContainer.innerHTML){
        return false;
    }
    
    var answerContainers = quizContainer.querySelectorAll(".answers");
    var corNum = numCorrect;
    listOfQuestions.forEach((currentQuestion, questionNumber) => {
        var answerContainer = answerContainers[questionNumber];
        var checkedQues = [];
        
        $(`input[name=question${questionNumber}]:checked`).each(function(){
            checkedQues.push($(this).val());
        });
        
        checkedQues.sort();
        if(checkedQues.toString() === currentQuestion.correctAnswer.toString()){
            numCorrect++;

            answerContainer.style.color = "lightgreen";
        }else{
            answerContainer.style.color = "red";
        }
    });
    
    resultsContainer.innerHTML = "Your result is: <strong>" +
        numCorrect + " out of " + listOfQuestions.length + "</strong";
    clearInputs();
};

var clearInputs = function(){
    $(".clearMe").prop("disabled", true);
};

var share = function() {
    if(!resultsContainer.innerHTML){
        return false;
    }
    
    var url = "https://twitter.com/intent/tweet";
    var text = $("#results").text();
    var via = "vladimirbk16";
    url=url + "?text=" + text + ";via=" + via;
    
    window.open(url, "Share your results on twitter", "width=450,height=250");
};

var save = function(){
    var person = prompt("Please enter your name");
    
    saveName = JSON.parse(localStorage.getItem('saveName')) || [];
    
    newPlayer = {
        user: person,
        result: numCorrect
    }
    
    saveName.push(newPlayer);
    
    if(person == null){
        alert("Enter your name");
    }else{
        localStorage.setItem('personName', JSON.stringify(saveName));
        document.getElementById('showTable').style.display='table';
        buildTable();
    }
}

function buildTable(){
    let table = document.getElementById("list");
    table.createTHead();
    table.innerHTML="<th>Player</th><th>Score</th>";
    let scores= JSON.parse(localStorage.getItem('personName'));
    let rowNumber = 1;
    for(let helper in scores){
        let row = table.insertRow(rowNumber);
        let cell2 = row.insertCell(0);
        let cell3 = row.insertCell(1);
        
        cell2.innerText = scores[helper].user;
        cell3.innerHTML = scores[helper].result;
        
        rowNumber++;
    }
}

buildTable();
initiateQuiz();
submitButton.addEventListener("click", getResults);
newButton.addEventListener("click", initiateQuiz);
shareButton.addEventListener("click", share);
saveButton.addEventListener("click", save);