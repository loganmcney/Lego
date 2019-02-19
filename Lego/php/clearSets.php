<?php
include "connect.php";


$cmd = 'DELETE FROM sets';
$stmt = $dbo->prepare($cmd);
try {
    if (!$stmt->execute()) {
        throw new Exception("I don't know what happened yet...");
    }
} catch (Exception $ex) {
    echo "<p class='has-error'>Error: {$ex->getMessage()}";
}

echo $stmt->rowCount();



