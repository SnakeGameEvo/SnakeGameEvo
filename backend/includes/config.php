<?php
header('Content-Type: application/json');  // Set the response to JSON format

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "snake_game";

$conn  = new mysqli($servername, $username, $password, $dbname);

if (!$conn) {
    echo "Error: " . $conn->connect_error;
} else {
    echo '<div class="message">Successfully connected to the database!</div>';
    exit();
}
?>

<script>
    const message = document.getElementsByClassName('message')[0];
    setTimeout(() => {
        message.style.display = 'none';
    }, 200);
</script>