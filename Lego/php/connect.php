<?php

try {
    $dbo = new PDO("mysql:host=localhost;dbname=Lego", "admin", "014afbabd72456e05479d2cfb24b641ecfacaa1e896f4eb8");
} catch (Exception $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}

