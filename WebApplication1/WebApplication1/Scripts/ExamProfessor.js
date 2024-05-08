$(document).ready(function () {
    fetchExamResultsAndPopulateTable();
    var createExamModal = $("#createExamModal");
    var createExamBtn = $("#createExamButton");
    var createExamSpan = $(".closeExamModal");

    createExamBtn.click(function () {
        fetchSubjectsAndPopulateDropdown();
        createExamModal.css("display", "block");
    });

    createExamSpan.click(function () {
        createExamModal.css("display", "none");
    });

    $(window).click(function (event) {
        if (event.target == createExamModal[0]) {
            createExamModal.css("display", "none");
        }
    });

    $("#examForm").submit(function (event) {
        event.preventDefault();
        var formData = {
            Subject: $("#subject").val(),
            ExamDateTime: $("#examDateTime").val(),
            ClassroomName: $("#classroomName").val(),
            ExamSessionName: $("#examSessionName").val()
        };

        $.ajax({
            type: "PUT",
            url: "/api/Exam/CreateExam",
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function (response) {
                alert("Uspesno kreiran ispit!");
                createExamModal.css("display", "none");
            },
            error: function (error) {
                alert(error);
            }
        });
    });
    function fetchSubjectsAndPopulateDropdown() {
        $.ajax({
            type: "GET",
            url: "/api/Professor/GetSubjects",
            success: function (subjects) {
                var subjectDropdown = $("#subject");
                subjectDropdown.empty();
                subjectDropdown.append('<option value="">Izaberi predmet</option>');
                subjects.forEach(function (subject) {
                    subjectDropdown.append('<option value="' + subject + '">' + subject + '</option>');
                });
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }


    function fetchExamResultsAndPopulateTable() {
        $.ajax({
            type: "GET",
            url: "/api/ExamResult/GetResultsForProfessor",
            success: function (results) {
                var examResultTable = $("#examResultTable");
                examResultTable.empty();

                results.forEach(function (result) {
                    var row = $("<tr></tr>");

                    row.append('<td>' + result.Id + '</td>');
                    row.append('<td>' + result.Student + '</td>');
                    row.append('<td>' + result.Index + '</td>');
                    row.append('<td>' + result.ExamName + '</td>');
                    row.append('<td>' + result.ExamSessionName + '</td>');
                    row.append('<td>' + result.Grade + '</td>');
                    row.append('<td>' + result.Reviewed + '</td>');

                    var reviewButton = $('<button>Oceni</button>');
                    if (!result.Reviewed) {
                        reviewButton.attr("data-exam-result-id", result.Id);
                        reviewButton.click(function () {
                            var examResultId = $(this).data("exam-result-id");
                            openReviewModal(examResultId);
                        });
                    } else {
                        reviewButton.attr("disabled", true);
                    }
                    row.append($('<td></td>').append(reviewButton));

                    examResultTable.append(row);
                });
            },
            error: function (error) {
                alert("Greska!");
            }
        });
    }
    $("#search-button").click(function () {
        var firstname = $('#search-firstname').val().toLocaleLowerCase();
        var lastname = $('#search-lastname').val().toLocaleLowerCase();
        var index = $('#search-index').val().toLocaleLowerCase();
        var session = $('#search-session').val().toLocaleLowerCase();
        var subject = $('#search-subject').val().toLocaleLowerCase();

        $('#examResultTable tr:not(:first)').filter(function () {
            $(this).toggle(
                ($(this.children[1]).text().toLowerCase().indexOf(firstname) > -1) &&
                ($(this.children[1]).text().toLowerCase().indexOf(lastname) > -1) &&
                ($(this.children[2]).text().toLowerCase().indexOf(index) > -1) &&
                ($(this.children[3]).text().toLowerCase().indexOf(subject) > -1) &&
                ($(this.children[4]).text().toLowerCase().indexOf(session) > -1)
            )
        });
    });

    var reviewModal = $("#reviewModal");
    var reviewSpan = $(".close");

    reviewSpan.click(function () {
        reviewModal.css("display", "none");
    });

    $(window).click(function (event) {
        if (event.target == reviewModal[0]) {
            reviewModal.css("display", "none");
        }
    });

    $("#reviewForm").submit(function (event) {
        event.preventDefault();
        var examResultId = reviewModal.data("exam-result-id");
        var grade = $("#grade").val();

        $.ajax({
            type: "POST",
            url: "/api/ExamResult/ReviewExam",
            data: JSON.stringify({ Id: examResultId, Grade: grade }),
            contentType: "application/json",
            success: function (response) {
                alert("Uspesno ocenjen ispit!");
                reviewModal.css("display", "none");
                fetchExamResultsAndPopulateTable();
            },
            error: function (error) {
                alert("Greska pri ocenjivanju ispita!");
            }
        });
    });

    function openReviewModal(examResultId) {
        reviewModal.data("exam-result-id", examResultId);
        reviewModal.css("display", "block");
    }

    var table = $('#examResultTable');

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
});