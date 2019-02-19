<?php
include "connect.php";
header("Content-Type: application/json");

$part = new stdClass();
$response;

if (isset($_POST["setNum"])) {
    $part->setNum = filter_input(INPUT_POST, "setNum", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["partNum"])) {
    $part->partNum = filter_input(INPUT_POST, "partNum", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["colorID"])) {
    $part->colorID = filter_input(INPUT_POST, "colorID", FILTER_SANITIZE_SPECIAL_CHARS);
}
if (isset($_POST["qty"])) {
    $part->qty = filter_input(INPUT_POST, "qty", FILTER_SANITIZE_NUMBER_INT);
}



$cmd = 'INSERT INTO set_parts (id, set_num, part_num, color_id, qty) VALUES (null, ?, ?, ?, ?)';
$stmt = $dbo->prepare($cmd);
try {
    $userParams = [$part->setNum, $part->partNum, $part->colorID, $part->qty];
    if (!$stmt->execute($userParams)) {
        throw new Exception("$part->elementID: Part number already exists in set!");
        //throw new Exception($stmt->error);
    } else {
        $response->message = "Added part: {$part->partNum} & color: {$part->colorID} successfully";
    }
} catch (Exception $ex) {
    $response->message = "Error: {$ex->getMessage()}";
}

echo json_encode($response);


