<?php

try {
    //$dbo = new PDO("mysql:host=138.197.151.174:3306;dbname=Lego", "admin", "014afbabd72456e05479d2cfb24b641ecfacaa1e896f4eb8");
    $dbo = new PDO("mysql:host=localhost:3306;dbname=Lego", "lego-user", "Fmon7R8s6eVKFyHl");
} catch (Exception $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}

