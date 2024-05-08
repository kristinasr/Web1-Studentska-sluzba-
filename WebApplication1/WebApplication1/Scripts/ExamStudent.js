$(document).ready(function () {
    fetchExamResultsAndPopulateTable();

    function fetchExamResultsAndPopulateTable() {
        $.ajax({
            type: "GET",
            url: "/api/ExamResult/GetResultsForStudent",
            success: function (results) {
                var examResultTable = $("#examResultTable tbody");
                examResultTable.empty();

                results.forEach(function (result) {
                    var row = $("<tr></tr>");

                    row.append('<td>' + result.Id + '</td>');
                    row.append('<td>' + result.ExamName + '</td>');
                    row.append('<td>' + result.ExamSessionName + '</td>');
                    row.append('<td>' + result.Grade + '</td>');
                    row.append('<td>' + (result.Reviewed ? "Da" : "Ne") + '</td>');

                    examResultTable.append(row);
                });
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }
    fetchUpcomingExamsAndPopulateTable();

    function fetchUpcomingExamsAndPopulateTable() {
        $.ajax({
            type: "GET",
            url: "/api/Exam/GetUpcomingExams",
            success: function (exams) {
                var examTable = $("#examTable tbody");
                examTable.empty();

                exams.forEach(function (exam) {
                    var row = $("<tr></tr>");

                    row.append('<td>' + exam.Id + '</td>');
                    row.append('<td>' + exam.Professor + '</td>');
                    row.append('<td>' + exam.Subject + '</td>');
                    row.append('<td>' + exam.ExamDateTime + '</td>');
                    row.append('<td>' + exam.ClassroomName + '</td>');
                    row.append('<td>' + exam.ExamSessionName + '</td>');
                    var signUpButton = $('<button>Prijavi se</button>');
                    signUpButton.attr("data-exam-id", exam.Id);
                    signUpButton.click(function () {
                        var examId = $(this).data("exam-id");
                        signUpForExam(examId);
                    });
                    if (exam.SignedUp) {
                        signUpButton.attr("disabled", true);
                    }
                    row.append($('<td></td>').append(signUpButton));
                    examTable.append(row);
                });
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }

    function signUpForExam(examId) {
        $.ajax({
            type: "GET",
            url: "/api/Exam/SignUp/" + examId,
            success: function (response) {
                alert("Uspesna prijava ispita!");
                fetchUpcomingExamsAndPopulateTable();
                fetchExamResultsAndPopulateTable();
            },
            error: function (error) {
                alert("Greska u prijavi ispita!");
            }
        });
    }

    var table = $('#examTable');

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
    $("#search-button").click(function () {
        var grade = $('#search-grade').val().toLocaleLowerCase();
        var session = $('#search-session').val().toLocaleLowerCase();
        var subject = $('#search-subject').val().toLocaleLowerCase();

        $('#examResultTable tr:not(:first)').filter(function () {
            $(this).toggle(
                ($(this.children[1]).text().toLowerCase().indexOf(subject) > -1) &&
                ($(this.children[2]).text().toLowerCase().indexOf(session) > -1) &&
                ($(this.children[3]).text().toLowerCase().indexOf(grade) > -1)
            )
        });
    });
});