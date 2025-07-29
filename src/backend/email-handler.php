<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: index.html");
    exit;
}

$formType = $_POST['formType'] ?? '';

if ($formType === 'contact') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = trim($_POST['email'] ?? '');
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
    
    if (empty($name) || empty($email) || empty($message)) {
        header("Location: index.html#contact?error=missing");
        exit;
    }
    
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!$email || strpos($email, "\n") !== false || strpos($email, "\r") !== false) {
        header("Location: index.html#contact?error=email");
        exit;
    }

    $to = "kontakt@restaurace-kapitan.cz";
    $subject = "Restaurace - zpráva od " . $name;
    $body = "Nová zpráva z webu:\n\n";
    $body .= "Jméno: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Zpráva: " . $message . "\n";
    $body .= "\n---\n";
    $body .= "Odesláno: " . date('d.m.Y H:i:s') . "\n";
    $body .= "IP adresa: " . ($_SERVER['REMOTE_ADDR'] ?? 'neznámá') . "\n";
    
    $headers = "From: kontakt@restaurace-kapitan.cz\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    if (mail($to, $subject, $body, $headers)) {
        header("Location: index.html#contact?success=1");
    } else {
        error_log("Mail failed for contact form. To: $to, From: $email");
        header("Location: index.html#contact?error=send");
    }
    exit;

} elseif ($formType === 'reservation') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = trim($_POST['email'] ?? '');
    $date = htmlspecialchars(trim($_POST['date'] ?? ''), ENT_QUOTES, 'UTF-8');
    $time = htmlspecialchars(trim($_POST['time'] ?? ''), ENT_QUOTES, 'UTF-8');
    $guests = (int) ($_POST['guests'] ?? 0);
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    if (empty($name) || empty($email) || empty($date) || empty($time) || $guests <= 0) {
        header("Location: index.html#reservation?error=missing");
        exit;
    }
    
    $email = filter_var($email, FILTER_VALIDATE_EMAIL);
    if (!$email || strpos($email, "\n") !== false || strpos($email, "\r") !== false) {
        header("Location: index.html#reservation?error=email");
        exit;
    }

    $to = "kontakt@restaurace-kapitan.cz";
    $subject = "Restaurace - rezervace od " . $name;
    $body = "Nová rezervace z webu:\n\n";
    $body .= "Jméno: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Datum: " . $date . "\n";
    $body .= "Čas: " . $time . "\n";
    $body .= "Počet osob: " . $guests . "\n";
    $body .= "Poznámka: " . ($message ?: 'Žádná poznámka') . "\n";
    $body .= "\n---\n";
    $body .= "Odesláno: " . date('d.m.Y H:i:s') . "\n";
    $body .= "IP adresa: " . ($_SERVER['REMOTE_ADDR'] ?? 'neznámá') . "\n";
    
    $headers = "From: kontakt@restaurace-kapitan.cz\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    if (mail($to, $subject, $body, $headers)) {
        header("Location: index.html#reservation?success=1");
    } else {
        error_log("Mail failed for reservation form. To: $to, From: $email");
        header("Location: index.html#reservation?error=send");
    }
    exit;

} else {
    header("Location: index.html");
    exit;
}
?>