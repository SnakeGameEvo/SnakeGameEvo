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

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    
    <!-- font awesome begin -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <!-- font awesome end  -->

    <link rel="stylesheet" href="src/components/login_page/style.css">
    <title>Document</title>
</head>
<body>

    <div class="login-box">
        <h1>Login</h1>

        <form action="">
            <div class="input1">
                <label for="username">
                    <input type="text" id="username"  placeholder="Username" required>
                </label>
                <i class="fa-solid fa-user"></i>
            </div>
            <div class="input2">
                <label for="password">
                    <input type="password" id="password"  placeholder="Password" required>
                </label>
                <i class="fa-solid fa-lock"></i>
            </div>

            <div class="input3_forgotpwd">
                <div class="input3">
                    <input type="checkbox" id="remember_me">
                    <label for="remember_me" class="rem">Remember me</label>
                </div>
                <a href="#" class="forgot_password">Forgot Password</a>
                    

            </div>

            <input type="submit" class="submitbtn"><br>
            <span>Don't have an account yet?</span><a href="#" class="signup">Sign up</a>

        </form>


    </div>
    
</body>
</html>
