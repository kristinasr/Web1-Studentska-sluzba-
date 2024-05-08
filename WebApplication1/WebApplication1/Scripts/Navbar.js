$(document).ready(function () {
    var roles = ["Student", "Professor", "Administrator", "Undefined"];
    var username = sessionStorage.getItem("user_username");
    var role = sessionStorage.getItem("user_role");
    
    if (username == null) {
        $.ajax({
            url: '/api/Login',
            method: 'GET',
            success: function (data) {
                sessionStorage.setItem("user_username", data.Username);
                sessionStorage.setItem("user_role", roles[data.Role]);
                if (data.Type == 0) {
                    Student();
                }
                else if (data.Type == 1) {
                    Professor();
                }
                else if (data.Type == 2) {
                    Administrator();
                }
                else {
                    Undefined();
                }
            }
        });
    } else {
        if (role == roles[0]) {
            Student();
        }
        else if (role == roles[1]) {
            Professor();
        }
        else if (role == roles[2]) {
            Administrator();
        }
        else if (role == roles[3]) {
            Undefined();
        }
    }

    $('#nav-logout').click(function () {
        $.ajax({
            url: '/api/Login/SignOut',
            method: 'GET',
            success: function () {
                Undefined();
                sessionStorage.setItem("user_username", -1);
                sessionStorage.setItem("user_role", roles[3]);
                window.location.href = "Index.html";
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
});

function Student() {
    $('#nav-students').hide();
    $('#nav-ispiti-prof').hide();
    $('#nav-ispiti-stud').show();
    $('#nav-login').hide();
    $('#nav-logout').show();
}

function Professor() {
    $('#nav-students').hide();
    $('#nav-ispiti-prof').show();
    $('#nav-ispiti-stud').hide();
    $('#nav-login').hide();
    $('#nav-logout').show();
}

function Administrator() {
    $('#nav-students').show();
    $('#nav-ispiti-prof').hide();
    $('#nav-ispiti-stud').hide();
    $('#nav-login').hide();
    $('#nav-logout').show();
}

function Undefined() {
    $('#nav-students').hide();
    $('#nav-ispiti-prof').hide();
    $('#nav-ispiti-stud').hide();
    $('#nav-login').show();
    $('#nav-logout').hide();
}