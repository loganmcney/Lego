<?php
include "connect.php";
//header("Content-Type: application/json");

$part = new stdClass();

if (isset($_POST["setNum"])) {
    $part->setNum = $_POST["setNum"];
}
if (isset($_POST["elementID"])) {
    $part->elementID = $_POST["elementID"];
}
if (isset($_POST["qty"])) {
    $part->qty = $_POST["qty"];
}



//echo print_r($part);

$cmd = 'INSERT INTO set_parts VALUES (?, ?, ?)';
$stmt = $dbo->prepare($cmd);
try {
    $userParams = [$part->setNum, $part->elementID, $part->qty];
    if (!$stmt->execute($userParams)) {
        try {
            $cmd = 'UPDATE set_parts SET qty = qty + ? WHERE set_num = ? AND element_id = ?';
            $stmt = $dbo->prepare($cmd);
            $userParams = [$part->qty, $part->setNum, $part->elementID];
            if (!$stmt->execute($userParams)) {
                throw new Exception("idk lol wat do");
            } else {
                echo "Part $part->elementID quantity updated successfully";
            }
        } catch (Exception $ex) {
            echo "WHAT";
        }
        //throw new Exception("$part->elementID: Part number already exists!");
    } else {
        echo "Added $part->elementID successfully";
    }
} catch (Exception $ex) {
    echo "Error: {$ex->getMessage()}";
}


//$setNum = filter_input(INPUT_POST, "setNum", FILTER_SANITIZE_NUMBER_INT);

//$return = new stdClass();


//echo json_encode($return);


