const dbName = 'SCHOOL-DB';
const relName = 'STUDENT-REL';
const connToken = '90931730|-31949216087119339|90963209'; // Replace with your actual connection token

$(document).ready(function () {
    $("#rollNo").focus();
});

function saveRecordToDB() {
    var jsonStrObj = validateFormData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putRequest, " http://api.login2explore.com:5577 ", "/api/iml");
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollNo").focus();
}

function validateFormData() {
    var rollNo, fullName, className, birthDate, address, enrollmentDate;
    rollNo = $("#rollNo").val();
    fullName = $("#fullName").val();
    className = $("#class").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollmentDate = $("#enrollmentDate").val();

    if (rollNo === "") {
        alert("Roll No is required");
        $("#rollNo").focus();
        return "";
    }
    if (fullName === "") {
        alert("Full Name is required");
        $("#fullName").focus();
        return "";
    }
    if (className === "") {
        alert("Class is required");
        $("#class").focus();
        return "";
    }
    if (birthDate === "") {
        alert("Birth Date is required");
        $("#birthDate").focus();
        return "";
    }
    if (address === "") {
        alert("Address is required");
        $("#address").focus();
        return "";
    }
    if (enrollmentDate === "") {
        alert("Enrollment Date is required");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        class: className,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollNo").focus();
}

function getRollNoAsJsonObj() {
    var rollNo = $("#rollNo").val();
    var jsonStr = {
        rollNo: rollNo
    };
    return JSON.stringify(jsonStr);
}

function saveData() {
    var jsonStrObj = validateFormData();
    if (jsonStrObj === "") {
        return;
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    
    if (resultObj.status == 200) {
        alert("Data saved successfully");
    } else {
        alert("Error saving data");
    }
    resetForm();
    $("#rollNo").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateFormData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    console.log(resultObj);
    resetForm();
    $("#rollNo").focus();
}

function getStudent() {
    var rollNoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, rollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, "http://api.login2explore.com:5577", "/api/irl");
    jQuery.ajaxSetup({async: true});
    
    if (resultObj.status == 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resultObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#save").prop("disabled", true);
        $("#fullName").focus();
    } else {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullName").focus();
    }
}

function fillData(resultObj) {
    var data = JSON.parse(resultObj.data).record;
    $("#rollNo").val(data.rollNo);
    $("#fullName").val(data.fullName);
    $("#class").val(data.class);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollmentDate").val(data.enrollmentDate);
}

$("#rollNo").focus();

$("#rollNo").on("blur", function () {
    getStudent();
});

$("#save").on("click", function () {
    saveData();
});

$("#change").on("click", function () {
    changeData();
});

$("#reset").on("click", function () {
    resetForm();
});