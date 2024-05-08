$(document).ready(function () {
    var table = $('#student-table-div table');

    var getCellValue = (tr, idx) => $(tr).children().eq(idx).text();
    var comparer = function (idx, asc) {
        return function (a, b) {
            return function (v1, v2) {
                return (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2))
                    ? v1 - v2
                    : v1.toString().localeCompare(v2);
            }(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
        };
    };

    table.on('click', 'th', function () {
        var rows = table.find('tbody tr');
        const th = $(this)[0];
        var headerIndex = $(th).index();

        rows.sort(comparer(headerIndex, this.asc = !this.asc))
            .appendTo(table.find('tbody'));
    });


    var createStudentButton = $("#createStudentButton");
    var createStudentModal = $("#createStudent");
    var createStudentForm = $("#createStudentForm")

    createStudentButton.click(function () {
        createStudentModal.css("display", "block");
    });

    $("#search-button").click(function () {
        var firstname = $('#search-firstname').val().toLocaleLowerCase();
        var lastname = $('#search-lastname').val().toLocaleLowerCase();
        var index = $('#search-index').val().toLocaleLowerCase();

        $('#studentTable tr:not(:first)').filter(function () {
            $(this).toggle(
                ($(this.children[2]).text().toLowerCase().indexOf(firstname) > -1) &&
                ($(this.children[3]).text().toLowerCase().indexOf(lastname) > -1) &&
                ($(this.children[1]).text().toLowerCase().indexOf(index) > -1)
            )
        });
    });

    $(window).click(function (event) {
        if (event.target == createStudentModal[0]) {
            createStudentModal.css("display", "none");
        }
    });

    createStudentForm.submit(function (event) {
        event.preventDefault();
        //za kreiranje studenta
        var formData = {
            Username: $("#username").val(),
            Email: $("#email").val(),
            Index: $("#index").val(),
            FirstName: $("#firstName").val(),
            LastName: $("#lastName").val(),
            DateOfBirth: $("#dateOfBirth").val(),
            Password: $("#password").val(),
            Role: $("#role").val()
        };

        $.ajax({
            type: "PUT",
            url: "/api/Registration/CreateStudent", // Replace with the actual API endpoint
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (response) {
                alert("Student uspesno kreiran!");
                createStudentModal.css("display", "none");
            },
            error: function (error) {
                alert("Greska u kreiranju studenta!");
            }
        });
    });
    var studentTable = $("#studentTable tbody");
    var editStudentModal = $("#editStudentModal");
    var editStudentForm = $("#editStudentForm");

    fetchStudentsAndPopulateTable();

    function fetchStudentsAndPopulateTable() {
        $.ajax({
            type: "GET",
            url: "/api/Registration/GetAllStudents",
            success: function (students) {
                studentTable.empty();

                students.forEach(function (student) {
                    var row = $("<tr></tr>");

                    row.append('<td>' + student.Username + '</td>');
                    row.append('<td>' + student.Index + '</td>');
                    row.append('<td>' + student.FirstName + '</td>');
                    row.append('<td>' + student.LastName + '</td>');
                    row.append('<td>' + student.DateOfBirth + '</td>');
                    row.append('<td>' + student.Email + '</td>');

                    var actionButtons = $('<td></td>');
                    var editButton = $('<button>Edit</button>');
                    var deleteButton = $('<button>Delete</button>');

                    editButton.attr("data-username", student.Username);
                    editButton.click(function () {
                        var username = $(this).data("username");
                        openEditStudentModal(username);
                    });

                    deleteButton.attr("data-username", student.Username);
                    deleteButton.click(function () {
                        var username = $(this).data("username");
                        deleteStudent(username);
                    });

                    if (student.Deleted) {
                        editButton.prop("disabled", true);
                        deleteButton.prop("disabled", true);
                    }

                    actionButtons.append(editButton);
                    actionButtons.append(deleteButton);
                    row.append(actionButtons);

                    studentTable.append(row);
                });
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }

    function openEditStudentModal(username) {
        $.ajax({
            type: "GET",
            url: "/api/Registration/GetStudent/" + username,
            success: function (student) {
                $("#editUsername").val(student.Username);
                $("#editFirstName").val(student.FirstName);
                $("#editLastName").val(student.LastName);
                $("#editDateOfBirth").val(student.DateOfBirth);
                $("#editEmail").val(student.Email);
                editStudentModal.css("display", "block");
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }

    editStudentForm.submit(function (event) {
        event.preventDefault();
        var formData = {
            Username: $("#editUsername").val(),
            FirstName: $("#editFirstName").val(),
            LastName: $("#editLastName").val(),
            DateOfBirth: $("#editDateOfBirth").val(),
            Email: $("#editEmail").val()
        };

        $.ajax({
            type: "PUT",
            url: "/api/Registration/UpdateStudent",
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (response) {
                alert("Student uspesno izmenjen!");
                editStudentModal.css("display", "none");
                fetchStudentsAndPopulateTable();
            },
            error: function (error) {
                alert("Greska u izmeni studenta!");
            }
        });
    });

    function deleteStudent(username) {
        if (confirm("Da li ste sigurni da zelite da izbrisete ovog studenta?")) {
            $.ajax({
                type: "GET",
                url: "/api/Registration/DeleteStudent/" + username,
                success: function (response) {
                    alert("Student uspesno obrisan!");
                    fetchStudentsAndPopulateTable();
                },
                error: function (error) {
                    alert("Greska u brisanju studenta!");
                }
            });
        }
    }


    $(window).click(function (event) {
        if (event.target == editStudentModal[0]) {
            editStudentModal.css("display", "none");
        }
    });
});