<?php
include "connect.php";
header("Content-Type: application/json");

$set = new stdClass();
$response;


if (isset($_POST["setNum"])) {
    $set->setNum = $_POST["setNum"];
}
if (isset($_POST["name"])) {
    $set->name = $_POST["name"];
}
if (isset($_POST["numParts"])) {
    $set->numParts = $_POST["numParts"];
}
if (isset($_POST["imgUrl"])) {
    $set->imgUrl = $_POST["imgUrl"];
}
if (isset($_POST["year"])) {
    $set->year = $_POST["year"];
}
if (isset($_POST["themeID"])) {
    $set->themeID = $_POST["themeID"];
}

$cmd = 'INSERT INTO sets VALUES (?, ?, ?, ?, ?, ?)';
$stmt = $dbo->prepare($cmd);
try {
    $userParams = [$set->setNum, $set->name, $set->numParts, $set->imgUrl, $set->year, $set->themeID];
    if (!$stmt->execute($userParams)) {
        throw new Exception("Set number {$set->setNum} already exists!");
    } else {
        $response->message = "<p class='text-success'>Set {$set->setNum} successfully added</p>";
        $response->success = true;
    }
} catch (Exception $ex) {
    $response->message = "<p class='text-danger'>Error: {$ex->getMessage()}</p>";
    $response->success = false;
}

echo json_encode($response);



