<?php
include "connect.php";
//header("Content-Type: application/json");

$part = new stdClass();

if (isset($_POST["partNum"])) {
    $part->partNum = $_POST["partNum"];
}
if (isset($_POST["name"])) {
    $part->name = $_POST["name"];
}
if (isset($_POST["colorID"])) {
    $part->colorID = $_POST["colorID"];
}
if (isset($_POST["partUrl"])) {
    $part->partUrl = $_POST["partUrl"];
}
if (isset($_POST["partImgUrl"])) {
    $part->partImgUrl = $_POST["partImgUrl"];
}


$cmd = 'INSERT INTO parts VALUES (?, ?, ?, ?, ?)';
$stmt = $dbo->prepare($cmd);
try {
    $userParams = [$part->partNum, $part->name, $part->colorID, $part->partUrl, $part->partImgUrl];
    if (!$stmt->execute($userParams)) {
        throw new Exception("Part $part->partNum already exists!");
    } else {
        echo "Part $part->partNum & colorID $part->colorID added successfully";
    }
} catch (Exception $ex) {
    echo "{$ex->getMessage()}";
}