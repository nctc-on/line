<?php
// Start session to store form state
session_start();

$regError = "";
$showExam = false;

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $regNumber = trim($_POST['regNumber'] ?? "");
    $fullName  = trim($_POST['fullName'] ?? "");
    $mobile    = trim($_POST['mobile'] ?? "");

    // Pattern: NCTC/(10 digits)S
    $pattern = "/^NCTC\/\d{10}S$/";

    if (!preg_match($pattern, $regNumber)) {
        $regError = "Registration number format is invalid. Example: NCTC/1234567890S";
    } else {
        // If valid, show exam section
        $showExam = true;
        $_SESSION['fullName'] = $fullName;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Online Exam - National Computer Training Centre</title>
<link rel="icon" type="image/jpg" href="logo.jpg">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
<?php include "styles.css"; ?> /* Include your existing CSS file */
.error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.3rem;
}
</style>
</head>
<body>

<div class="timer" id="examTimer">Time Remaining: <span id="timeDisplay">00:00:00</span></div>

<header>
    <nav class="navbar">
        <div class="logo">
            <a href="index.html">
                <img src="logo.jpg" alt="NCTC Logo" class="logo-img">
            </a>
        </div>
        <div class="nav-links" id="navLinks">
            <i class="fas fa-times" onclick="hideMenu()"></i>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li class="has-submenu">
                    <a href="about_us.html">About Us</a>
                    <ul class="submenu">
                        <li><a href="mission.html">Our Mission</a></li>
                        <li><a href="recognition.html">Recognition</a></li>
                        <li><a href="director.html">Director's Message</a></li>
                    </ul>
                </li>
                <li><a href="our_courses.html">Our Courses</a></li>
                <li class="has-submenu">
                    <a href="#">Admission</a>
                    <ul class="submenu">
                        <li><a href="online_admission.html">Online Admission</a></li>
                        <li><a href="offline_admission.html">Offline Admission</a></li>
                    </ul>
                </li>
                <li><a href="noticeboard.html">Notice Board</a></li>
                <li><a href="exam.php" class="active">Online Exam</a></li>
                <li><a href="contact.html">Contact Us</a></li>
            </ul>
        </div>
        <i class="fas fa-bars" onclick="showMenu()"></i>
    </nav>
</header>

<section class="exam-hero">
    <div class="hero-content">
        <h1>Online Examination</h1>
        <p>Test your knowledge and skills</p>
    </div>
</section>

<section class="exam-container">
    <div class="exam-header">
        <div class="exam-info">
            <div class="info-item"><i class="fas fa-book"></i><span>Course: DCA/ADCA</span></div>
            <div class="info-item"><i class="fas fa-question-circle"></i><span>Total Questions: 10</span></div>
            <div class="info-item"><i class="fas fa-clock"></i><span>Time: 30 Minutes</span></div>
        </div>
        <div class="timer" id="timer">30:00</div>
    </div>

    <div class="progress-bar"><div class="progress" id="progress"></div></div>

    <?php if (!$showExam): ?>
    <!-- Registration Form -->
    <div class="registration-form" id="registrationForm">
        <h2>Exam Registration</h2>
        <form method="POST" action="">
            <div class="form-group">
                <label for="regNumber">Registration Number:</label>
                <input type="text" id="regNumber" name="regNumber" value="<?= htmlspecialchars($_POST['regNumber'] ?? '') ?>" required>
                <?php if ($regError): ?>
                    <div class="error-message"><?= $regError ?></div>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="fullName">Full Name:</label>
                <input type="text" id="fullName" name="fullName" value="<?= htmlspecialchars($_POST['fullName'] ?? '') ?>" required>
            </div>
            <div class="form-group">
                <label for="mobile">Mobile Number:</label>
                <input type="tel" id="mobile" name="mobile" value="<?= htmlspecialchars($_POST['mobile'] ?? '') ?>" required>
            </div>
            <button type="submit" class="submit-btn">Start Exam</button>
        </form>
    </div>
    <?php else: ?>
    <!-- Exam Section -->
    <div class="exam-section" id="examSection" style="display:block;">
        <h2>Welcome, <?= htmlspecialchars($_SESSION['fullName']) ?></h2>
        <form id="examForm">
            <!-- Your 10 exam questions go here -->
        </form>
    </div>
    <?php endif; ?>
</section>

</body>
</html>
