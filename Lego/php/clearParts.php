<?php
include "connect.php";


$cmd = 'DELETE FROM parts';
$stmt = $dbo->prepare($cmd);
try {
    if (!$stmt->execute()) {
        throw new Exception("idk what happened lol");
    }
} catch (Exception $ex) {
    echo "<p class='has-error'>Error: {$ex->getMessage()}";
}

echo $stmt->rowCount();

