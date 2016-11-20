var mail = "fime.social@gmail.com";
var password = "123";

$(document).ready(function () {
    $("#alertPassword").hide();
    $("#alertMail").hide();

    $('#formLogIn').submit(function () {
        logIn();
        return false;
    });
});

function logIn() {
    var userMail = $("#userMail").val();
    var userPassword = $("#userPass").val();

    if (validateEmail(userMail)) {
        if (userMail == mail && userPassword == password)
            window.location.href = "main.html";
        else
        if (userMail == mail)
            $("#alertPassword").show();
        else
            $("#myModal").modal('show');
    } else
        $("#alertMail").show();
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}