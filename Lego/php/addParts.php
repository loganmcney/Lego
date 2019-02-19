<?php
include "connect.php";
header("Content-Type: application/json");

$part = new stdClass();
$response;

if (isset($_POST["partNum"])) {
    $part->partNum = filter_input(INPUT_POST, "partNum", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["name"])) {
    $part->name = filter_input(INPUT_POST, "name", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["colorID"])) {
    $part->colorID = filter_input(INPUT_POST, "colorID", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["partUrl"])) {
    $part->partUrl = filter_input(INPUT_POST, "partUrl", FILTER_SANITIZE_URL);
}
if (isset($_POST["partImgUrl"])) {
    $part->partImgUrl = filter_input(INPUT_POST, "partImgUrl", FILTER_SANITIZE_URL);
}


$cmd = 'INSERT INTO parts VALUES (?, ?, ?, ?, ?)';
$stmt = $dbo->prepare($cmd);
try {
    $userParams = [$part->partNum, $part->name, $part->colorID, $part->partUrl, $part->partImgUrl];
    if (!$stmt->execute($userParams)) {
        try {
            $cmd = 'UPDATE parts SET qty = qty + ? WHERE part_num = ? AND color_id = ?';
            $stmt = $dbo->prepare($cmd);
            $userParams = [$part->qty, $part->partNum, $part->colorID];
        } catch (Exception $ex) {
            $response->messasge = "Error adding part {$part->partNum}";
        }
        //throw new Exception("Part $part->partNum already exists!");
    } else {
        $response->message ="<p class='text-success'>Part {$part->partNum} $ Color {$part->colorID} successfully added</p>";
        $response->success = true;
    }
} catch (Exception $ex) {
    $response->message = "<p class='text-danger'>Error: {$ex->getMessage()}</p>";
    $response->success = false;
}

echo json_encode($response);