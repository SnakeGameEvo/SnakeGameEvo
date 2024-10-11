<?php

include '../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handling incoming requests
    $data = json_decode(file_get_contents('php://input'), true);  // Get data from the request
    $name = $data['name'];
    $score = $data['score'];

    // Inserting data into the MySQL database
    $sql = $conn->prepare("INSERT INTO users (name, score) VALUES (?, ?)");
    $sql->bind_param("si", $name, $score);

    if ($sql->execute()) {
        echo json_encode(array("status" => "success", "message" => "New record created successfully"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Error: " . $sql . "<br>" . $conn->error));
    }
}
$conn->close();
