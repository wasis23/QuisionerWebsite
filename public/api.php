<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
// Coba cari di folder parent (jika api.php ada di dalam dist/)
$dbFile = __DIR__ . '/../db.json';
if (!file_exists($dbFile)) {
    // Coba cari di folder yang sama (jika api.php dipindah ke root)
    $dbFile = __DIR__ . '/db.json';
}

// GET: Read data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    if (file_exists($dbFile)) {
        echo file_get_contents($dbFile);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Database not found']);
    }
    exit();
}

// POST: Write data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    if ($input) {
        $decoded = json_decode($input, true);
        if ($decoded !== null) {
            $written = file_put_contents($dbFile, json_encode($decoded, JSON_PRETTY_PRINT));
            if ($written !== false) {
                echo json_encode(['success' => true, 'written' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to write to db.json. Check file permissions.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Empty request body']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);
?>
