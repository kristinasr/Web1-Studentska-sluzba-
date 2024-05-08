$(document).ready(function () {
    $('#btn-Login').click(function () {
        event.preventDefault();
        var roles = ["Student", "Professor", "Administrator"]

        var user = {
            "Username": $('#username').val(),
            "Password": $('#password').val()
        };

        $.ajax({
            type: "POST",
            url: '/api/Login/SignIn',
            data: user,
            success: function (data) {
                sessionStorage.setItem("user_username", data.Username);
                sessionStorage.setItem("user_role", roles[data.Role]);
                if (data.Role == 0) {
                    window.location.href = 'ExamStudent.html';
                }
                else if (data.Role == 1) {
                    window.location.href = 'ExamProfessor.html';
                }
                else if (data.Role == 2) {
                    window.location.href = 'Students.html';
                }

            },
            error: function (data) {
                alert(data.responseJSON.Message);
            }
        });
    });

});