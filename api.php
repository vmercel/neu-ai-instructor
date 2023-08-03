<?php
// api.php

// Perform database query to create a new user
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "neuaietutor";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to handle the signup request
function signup($conn, $name, $email, $phone, $stdNumber, $address, $department, $password, $photo)
{
    // Validate the signup data
    // ...
    // Generate UID and set default status
    $uid = 'U' . rand(100, 999); // Random UID between 100 and 999
    $status = 'Inactive';

    // Upload the photo file
    $targetDir = "uploads/"; // Directory to store uploaded files
    $targetFile = $targetDir . basename($photo["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if image file is a valid image
    if (isset($_POST["submit"])) {
        $check = getimagesize($photo["tmp_name"]);
        if ($check === false) {
            echo "File is not an image.";
            $uploadOk = 0;
        }
    }

    // Check if file already exists
    // if (file_exists($targetFile)) {
    //     echo "File already exists.";
    //     $uploadOk = 0;
    // }

    // Check file size
    if ($photo["size"] > 500000) {
        echo "File is too large.";
        $uploadOk = 0;
    }

    // Allow certain file formats
    if ($imageFileType !== "jpg" && $imageFileType !== "png" && $imageFileType !== "jpeg" && $imageFileType !== "gif") {
        echo "Only JPG, JPEG, PNG, and GIF files are allowed.";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        // If everything is ok, move the uploaded file to the target directory
        if (move_uploaded_file($photo["tmp_name"], $targetFile)) {
            // Insert user data into the database
            $sql = "INSERT INTO users (`uid`, `name`, `email`, `password`, `phone`, `stdnumber`, `address`, `department`, `status`, `photo`) 
                    VALUES ('$uid', '$name', '$email', '$password', '$phone', '$stdNumber', '$address', '$department', '$status', '$targetFile')";

            if ($conn->query($sql) === TRUE) {
                $user = array(
                    //'id' => $conn->insert_id,
                    'uid' => $uid,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'stdnumber' => $stdNumber,
                    'address' => $address,
                    'department' => $department,
                    'status' => $status,
                    'photo' => $targetFile
                );

                // If signup is successful, store user information in session
                //$_SESSION['user'] = $user;
                echo json_encode($user);
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }

    $conn->close();
}

function login($conn, $email, $password)
{
    // Validate the login credentials
    // ...
    // Perform database query to authenticate user
    // ...
    // If authentication is successful, store user information in session

    $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $user = array(
            //'id' => $row['id'],
            'uid' => $row['uid'],
            'name' => $row['name'],
            //'email' => $row['email'],
            //'phone' => $row['phone'],
            'stdnumber' => $row['stdnumber'],
            //'address' => $row['address'],
            //'department' => $row['department'],
            'photo' => $row['photo'],
            //'status' => $row['status']
        );

        // If authentication is successful, store user information in session
        $_SESSION['user'] = $user;
        mysqli_query($conn, "UPDATE users SET status = 'Active' WHERE email = '$email'");
        $resp = array('data' => $user, 'message' => 'Successful');
        echo json_encode($user);
    } else {
        echo "Invalid email or password.";
    }

    $conn->close();
}

// Handle the API requests
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'login') {
        $email = $_POST['email'];
        $password = $_POST['password'];
        login($conn, $email, $password);
    }elseif($action ==='logout'){
        $email = $_POST['email'];
        mysqli_query($conn, "UPDATE users SET status = 'Inactive' WHERE email = '$email' ");
    } elseif ($action === 'signup') {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $stdNumber = $_POST['stdnumber'];
        $address = $_POST['address'];
        $department = $_POST['department'];
        $password = $_POST['password'];
        $photo = $_FILES['photo'];
        signup($conn, $name, $email, $phone, $stdNumber, $address, $department, $password, $photo);
    } elseif ($action === 'fetchGrades') {
        $studentId = $_POST['studentId'];
        $courseId = $_POST['courseId'];
        fetchGrades($conn, $studentId, $courseId);
    } elseif ($action === 'saveSection') {
        $courseId = $_POST['courseId'];
        $sectionName = $_POST['sectionName'];
        $topicId = $_POST['topicId'];
        $instructions = $_POST['instructions'];
        $duration = $_POST['duration'];
        $image = $_FILES['image'];
        saveSectionInstructions($conn, $courseId, $topicId, $sectionName, $instructions, $duration, $image);
    } elseif ($action === 'updateSection') {
        $sectionId = $_POST['sectionId'];
        $courseId = $_POST['courseId'];
        $sectionName = $_POST['sectionName'];
        $topicId = $_POST['topicId'];
        $instructions = $_POST['instructions'];
        $duration = $_POST['duration'];
        $image = $_FILES['image'];
        updateSectionInstructions($conn, $sectionId, $courseId, $topicId, $sectionName, $instructions, $duration, $image);
    } elseif($action === 'saveGrades'){
        $studentId=$_POST['studentId'];
        $courseId= $_POST['courseId'];
        $topic =$_POST['topic'] ;
        $score =$_POST['score'] ;
        $ac = $_POST["ac"];
        $te = $_POST['te'];
        $pe = $_POST["pe"];
        $total = $_POST['total'];

        insertOrUpdateGrade($conn, $studentId, $courseId, $topic, $score, $ac, $pe, $te,$total);
    } elseif($action ==='fetchIds'){
        $courseId = $_POST['courseId'];
        fetchIdsFromSections($conn, $courseId=null);
    } elseif($action==='fetchInstructions'){
        $topicId = $_POST['topicId'];
        $courseId = $_POST['courseId'];
        getInstructionsByTopicID($topicId, $courseId, $conn);
    } elseif($action ==='subscribeToCourse'){
        $studentId = $_POST['studentId'];
        $courseId = $_POST['courseId'];
        subscribeToCourse($conn, $studentId, $courseId);
    }  elseif($action ==='unsubscribeFromCourse'){
        $studentId = $_POST['studentId'];
        $courseId = $_POST['courseId'];
        unsubscribeFromCourse($conn, $studentId, $courseId);
    } elseif($action ==='fetchCourses'){
        $studentId = $_POST['studentId'];
        fetchCourses($conn, $studentId);
    } elseif($action ==='fetchCoursesForUser'){
        $studentId = $_POST['studentId'];
        fetchCoursesForUser($studentId, $conn);
    } elseif($action ==='fetchTopicsForCourse'){
        $courseId = $_POST['courseId'];
        fetchTopicsForCourse($courseId,$conn);
    } elseif($action === 'getCourses'){
        getCourses($conn);
    } elseif($action === 'getPhaseById'){
        $courseId = $_POST['courseId'];
        $topicId = $_POST['topicId'];
        getPhaseById($conn,$courseId, $topicId);
    } elseif($action === 'getPhaseInfo'){
        $sectionId = $_POST['sectionId'];
        getPhaseInfo($conn, $sectionId);
    } elseif($action === 'fixSchedules'){
        $courseId = $_POST['courseId'];
        $schedules = $_POST['schedules'];
        insertOrUpdateSchedules($conn, $courseId, $schedules);
    } elseif($action === 'getScheduleByCourse'){
        $courseId = $_POST['courseId'];
        getScheduleByCourse($conn, $courseId);
    }elseif($action === 'sendMessage'){
        $userId = $_POST['userId'];
        $message = $_POST['message'];
        $courseId = $_POST['courseId'];
        saveOrRetrieveMessages($conn, $userId, $message, $courseId); 
    }elseif($action ==='saveAPIKey'){
        $userId = $_POST['userId'];
        $apiKey = $_POST['apiKey'];
        saveAPIKey($conn, $userId, $apiKey);
    }elseif($action ==='getAPIKey'){
        $userId = $_POST['userId'];
        getAPIKey($conn, $userId);
    } else {
        echo 'Invalid action';
    }
}


// Function to insert or update grade data
function insertOrUpdateGrade($conn, $studentId, $courseId, $topic, $score, $accuracy, $promptEfficiency, $timeEfficiency, $total)
{
    // Retrieve existing data for the student and course
    $sql = "SELECT topics, scores FROM grades WHERE studentId = '$studentId' AND courseId = '$courseId'";
    $result = $conn->query($sql);

    if ($result->num_rows === 1) {
        // Data already exists, update the arrays
        $row = $result->fetch_assoc();
        $topics = unserialize($row['topics']);
        $scores = unserialize($row['scores']);
        $accuracy = unserialize($row['accuracy']);
        $promptEfficiency = unserialize($row['promptEfficiency']);
        $timeEfficiency = unserialize($row['timeEfficiency']);
        $total = unserialize($row['total']);
        // Check if the topic exists in the array
        $topicIndex = array_search($topic, $topics);

        if ($topicIndex !== false) {
            // Topic already exists, update the score at the corresponding index
            $scores[$topicIndex] = $score;
            $accuracy[$topicIndex] = $accuracy;
            $promptEfficiency[$topicIndex] = $promptEfficiency;
            $timeEfficiency[$topicIndex] = $timeEfficiency;
            $total[$topicIndex] = $total;
        } else {
            // Topic does not exist, add it to the arrays
            $topics[] = $topic;
            $scores[] = $score;
            $accuracy[] = $accuracy;
            $promptEfficiency[] = $promptEfficiency;
            $timeEfficiency[] = $timeEfficiency;
            $total[] = $total;
        }

        // Update the dateModified field with the current datetime
        $dateModified = date('Y-m-d H:i:s');

        // Update the data in the grades table
        $topicsSerialized = serialize($topics);
        $scoresSerialized = serialize($scores);
        $accuracySerialized = serialize($accuracy);
        $promptEfficiencySerialized = serialize($promptEfficiency);
        $timeEfficiencySerialized = serialize($timeEfficiency);
        $totalSerialized = serialize($total);

        $sql = "UPDATE grades SET topics = '$topicsSerialized', scores = '$scoresSerialized', dateModified = '$dateModified', accuracy='$accuracySerialized', promptEfficiency='$promptEfficiencySerialized', timeEfficiency='$timeEfficiencySerialized', total='$totalSerialized' 
                WHERE studentId = '$studentId' AND courseId = '$courseId'";

        if ($conn->query($sql) === TRUE) {
            // Calculate the average score
            $averageScore = array_sum($scores) / count($scores);

            // Update the total field with the average score
            //$sql = "UPDATE grades SET promptEfficiency = '$averageScore' WHERE studentId = '$studentId' AND courseId = '$courseId'";
            //$conn->query($sql);

            echo "Grade data updated successfully.";
        } else {
            echo "Error updating grade data: " . $conn->error;
        }
    } else {
        // Data does not exist, insert a new record
        $topics = array($topic);
        $scores = array($score);
        $accuracy = array($accuracy);
        $promptEfficiency = array($promptEfficiency);
        $timeEfficiency = array($timeEfficiency);
        $total = array($total);
        $topicsSerialized = serialize($topics);
        $scoresSerialized = serialize($scores);
        $accuracySerialized = serialize($accuracy);
        $promptEfficiencySerialized = serialize($promptEfficiency);
        $timeEfficiencySerialized = serialize($timeEfficiency);
        $totalSerialized = serialize($total);
        $dateModified = date('Y-m-d H:i:s');
        $sql = "INSERT INTO grades (studentId, courseId, topics, scores, dateModified, accuracy, promptEfficiency, timeEfficiency, total) 
                VALUES ('$studentId', '$courseId', '$topicsSerialized', '$scoresSerialized', '$dateModified', '$accuracySerialized', '$promptEfficiencySerialized', '$timeEfficiencySerialized', '$totalSerialized')";

        if ($conn->query($sql) === TRUE) {
            echo "Grade data inserted successfully.";
        } else {
            echo "Error inserting grade data: " . $conn->error;
        }
    }

    $conn->close();
}




function fetchGrades($conn, $studentId, $courseId)
{
    $sql = "SELECT topics, scores, dateModified, accuracy, promptEfficiency, timeEfficiency, total FROM grades WHERE studentId = '$studentId' AND courseId = '$courseId'";
    $result = $conn->query($sql);

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $topics = unserialize($row['topics']);
        $scores = unserialize($row['scores']);
        $dateModified = $row['dateModified'];
        $ac = unserialize($row['accuracy']);
        $pe = unserialize($row['promptEfficiency']);
        $te = unserialize($row['timeEfficiency']);
        $total = unserialize($row['total']);

        $data = array(
            'topics' => $topics,
            'scores' => $scores,
            'dateModified' => $dateModified,
            'accuracy' => $ac,
            'promptEfficiency' => $pe,
            'timeEfficiency' => $te,
            'total' => $total
        );

        echo json_encode($data);
    } else {
        echo json_encode(null);
    }

    $conn->close();
}

//SAVE INSTRUCTIONS
function saveSectionInstructions($conn, $courseId, $topicId, $sectionName, $instructions, $duration, $image)
{
    $targetDir = 'coursefiles/'; // Directory where the images will be stored
    $targetFile = $targetDir . basename($image['name']);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if the uploaded file is an image
    $check = getimagesize($image['tmp_name']);
    if ($check === false) {
        echo json_encode(['success' => false, 'message' => 'Invalid image file.']);
        return;
    }

    // Check if the file already exists
    // if (file_exists($targetFile)) {
    //     echo json_encode(['success' => false, 'message' => 'File already exists.']);
    //     return;
    // }

    // Check the file size (limit it to 5MB in this example)
    if ($image['size'] > 5242880) {
        echo json_encode(['success' => false, 'message' => 'File size exceeds the limit.']);
        return;
    }

    // Allow only specific file formats (you can modify this as needed)
    if ($imageFileType !== 'gif' && $imageFileType !== 'jpg' && $imageFileType !== 'jpeg' && $imageFileType !== 'png' && $imageFileType !== 'mp4') {
        echo json_encode(['success' => false, 'message' => 'Only JPG, JPEG, and PNG files are allowed.']);
        return;
    }

    // Move the uploaded file to the target directory
    if (move_uploaded_file($image['tmp_name'], $targetFile)) {
        // Save the instructions and other details in the database
        // Get the next section ID
        $sql = "SELECT COUNT(*) + 1 AS next_section_id FROM sections";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        $next_section_id = $row['next_section_id'];

        // Store the next section ID in the $sectionId variable
        $sectionId = 'SEC' . $next_section_id;


        $instructionsJSON = json_encode($instructions);

        // Prepare the SQL statement to insert the instructions into the sections table
        $sql = "INSERT INTO sections (sectionId, courseId, topicId, sectionName, instructions, duration, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssis", $sectionId, $courseId, $topicId, $sectionName, $instructionsJSON, $duration, $targetFile);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Instructions saved successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save instructions in the database.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload the image.']);
    }

    $conn->close();
}


//UPDATE SECTION INSTRUCTION
function updateSectionInstructions($conn, $sectionId, $courseId, $topicId, $sectionName, $instructions, $duration, $image)
{
    $targetDir = 'coursefiles/'; // Directory where the images will be stored
    $targetFile = $targetDir . basename($image['name']);
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if the uploaded file is an image
    $check = getimagesize($image['tmp_name']);
    if ($check === false) {
        echo json_encode(['success' => false, 'message' => 'Invalid image file.']);
        return;
    }

    // Check the file size (limit it to 5MB in this example)
    if ($image['size'] > 5242880) {
        echo json_encode(['success' => false, 'message' => 'File size exceeds the limit.']);
        return;
    }

    // Allow only specific file formats (you can modify this as needed)
    if ($imageFileType !== 'gif' && $imageFileType !== 'jpg' && $imageFileType !== 'jpeg' && $imageFileType !== 'png' && $imageFileType !== 'mp4') {
        echo json_encode(['success' => false, 'message' => 'Only JPG, JPEG, and PNG files are allowed.']);
        return;
    }

    // Move the uploaded file to the target directory
    if (move_uploaded_file($image['tmp_name'], $targetFile)) {
        // Save the instructions and other details in the database

        $instructionsJSON = json_encode($instructions);

        // Prepare the SQL statement to update the instructions in the sections table
        $sql = "UPDATE sections SET courseId=?, topicId=?, sectionName=?, instructions=?, duration=?, image=? WHERE sectionId=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiss", $courseId, $topicId, $sectionName, $instructionsJSON, $duration, $targetFile, $sectionId);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Instructions saved successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save instructions in the database.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload the image.']);
    }

    $conn->close();
}

  

// FETCH INSTRUCTIONS
function getInstructionsByTopicID($topicId, $courseId, $conn) {
    $query = "SELECT * FROM sections WHERE topicId = '$topicId' AND courseId = '$courseId'";
    $result = mysqli_query($conn, $query);

    // Create an array to store the fetched instructions
    $instructions = array();

    // Iterate over the result set and populate the $instructions array
    while ($row = mysqli_fetch_assoc($result)) {
        // Decode the instructions array from JSON format
        $instructionMessages = json_decode($row['instructions']);

        $instruction = array(
            'message1' => $row['sectionName'],
            'image' => $row['image'],
            'duration' => $row['duration']
        );

        // Dynamically populate the instruction messages
        for ($i = 0; $i < count($instructionMessages); $i++) {
            $messageKey = 'message' . ($i + 2); // Increment the message key dynamically
            $instruction[$messageKey] = $instructionMessages[$i];
        }

        // Add the instruction to the $instructions array
        $instructions[] = $instruction;
    }

    // Sort the instructions array so that any of its elements whose 'message1' key is 'Quiz' should be the last element in the instructions array
    $quizInstructions = array();
    $otherInstructions = array();
    foreach ($instructions as $instruction) {
        if ($instruction['message1'] === 'Quiz') {
            $quizInstructions[] = $instruction;
        } else {
            $otherInstructions[] = $instruction;
        }
    }
    $instructions = array_merge($otherInstructions, $quizInstructions);

    // Convert the $instructions array to JSON format
    $instructionsJson = json_encode($instructions);

    // Close the database connection
    mysqli_close($conn);

    // Return the instructions as JSON response
    header('Content-Type: application/json');
    echo $instructionsJson;
    exit; // Terminate the script after echoing the JSON response
}


// FETCH INSTRUCTIONS

    function getPhaseInfo($conn, $sectionId) {
        // Query to fetch a single row from the sections table where sectionId is $sectionId
        $query = "SELECT * FROM sections WHERE sectionId='$sectionId'";
    
        // Execute the query and fetch the result
        $result = mysqli_query($conn, $query);
    
        // Fetch the single row
        $row = mysqli_fetch_assoc($result);
    
        // Echo the JSON encoded array of field names and field data
        echo json_encode($row);
    }


//SUBSCRIBE OR UNSUBSCRIBE FROM COURSE
// Function to subscribe to a course
function subscribeToCourse($conn, $studentId, $courseId) {
    $query = "INSERT INTO subscriptions (`studentId`, `courseId`, `status`) VALUES ('$studentId', '$courseId', 'Subscribed')";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $response = array('success' => true, 'message' => 'Subscribed to the course successfully');
    } else {
        $response = array('success' => false, 'message' => 'Failed to subscribe to the course');
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

// Function to unsubscribe from a course
function unsubscribeFromCourse($conn, $studentId, $courseId) {
    $query = "DELETE FROM `subscriptions` WHERE `studentId`= '$studentId' AND `courseId` = '$courseId'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $response = array('success' => true, 'message' => 'Unsubscribed from the course successfully');
    } else {
        $response = array('success' => false, 'message' => 'Failed to unsubscribe from the course');
    }

    header('Content-Type: application/json');
    echo json_encode($response);
}

// Function to fetch the list of courses
// function fetchCourses($conn) {
//     $query = "SELECT * FROM courses";
//     $result = mysqli_query($conn, $query);

//     // Create an array to store the fetched courses
//     $courses = array();

//     // Iterate over the result set and populate the $courses array
//     while ($row = mysqli_fetch_assoc($result)) {
//         $course = array(
//             'id' => $row['courseId'],
//             'name' => $row['courseName']
//         );

//         // Add the course to the $courses array
//         $courses[] = $course;
//     }

//     // Convert the $courses array to JSON format
//     $coursesJson = json_encode($courses);

//     // Close the database connection
//     mysqli_close($conn);

//     // Return the courses as JSON response
//     header('Content-Type: application/json');
//     echo $coursesJson;
// }
function fetchCourses($conn, $studentId) {
    $query = "SELECT courses.courseId, courses.courseName, subscriptions.studentId
              FROM courses
              LEFT JOIN subscriptions ON courses.courseId = subscriptions.courseId
                                        AND subscriptions.studentId = '$studentId'";
    $result = mysqli_query($conn, $query);

    // Create an array to store the fetched courses
    $courses = array();

    // Iterate over the result set and populate the $courses array
    while ($row = mysqli_fetch_assoc($result)) {
        $status = ($row['studentId'] == $studentId) ? "Subscribed" : "Not Subscribed";
        $course = array(
            'id' => $row['courseId'],
            'name' => $row['courseName'],
            'status' => $status
        );

        // Add the course to the $courses array
        $courses[] = $course;
    }

    // Convert the $courses array to JSON format
    $coursesJson = json_encode($courses);

    // Close the database connection
    mysqli_close($conn);

    // Return the courses as JSON response
    header('Content-Type: application/json');
    echo $coursesJson;
}

function fetchCoursesForUser($studentId, $conn) {
    $query = "SELECT subscriptions.courseId, courses.courseName FROM subscriptions
    INNER JOIN courses ON subscriptions.courseId = courses.courseId
    WHERE subscriptions.studentId = '$studentId'";
    $result = mysqli_query($conn, $query);
    $courses = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $course = array(
            'id' => $row['courseId'],
            'name' => $row['courseName']
        );
    
        $courses[] = $course;
    }
    
    $response = array(
        'success' => true,
        'courses' => $courses
    );
    
    mysqli_close($conn);
    
    header('Content-Type: application/json');
    echo json_encode($response);
}    


// fetching courses generally for the admin's dropdown:
    function getCourses($conn) {
        // Query to fetch unique courseId from sections table
        $query = "SELECT DISTINCT courseId FROM sections";
    
        // Execute the query and fetch the result
        $result = mysqli_query($conn, $query);
    
        // Initialize an empty array to store the course data
        $courses = array();
    
        // Loop through the result and get the corresponding courseName from courses table
        while ($row = mysqli_fetch_assoc($result)) {
            $courseId = $row['courseId'];
            $query2 = "SELECT courseName FROM courses WHERE courseId='$courseId'";
            $result2 = mysqli_query($conn, $query2);
            $row2 = mysqli_fetch_assoc($result2);
            $courseName = $row2['courseName'];
            $course = array("courseId" => $courseId, "courseName" => $courseName);
            array_push($courses, $course);
        }
    
        // Echo the JSON encoded array of courseId and courseName
        echo json_encode($courses);
    }


function fetchTopicsForCourse($courseId, $conn) {
    // $query = "SELECT topicId, MAX(sectionName) AS sectionName, id
    // FROM sections
    // WHERE courseId = '$courseId'
    // GROUP BY topicId
    // ORDER BY id";

    $query = "SELECT lectureId, lectureTitle FROM lectures WHERE courseId='$courseId' ";

    $result = mysqli_query($conn, $query);

    $topics = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $topic = array(
            'id' => $row['lectureId'],
            'name' => $row['lectureTitle']
        );

        $topics[] = $topic;
    }

    $response = array(
        'success' => true,
        'topics' => $topics
    );

    mysqli_close($conn);

    header('Content-Type: application/json');
    echo json_encode($response);
}


function getPhaseById($conn,$courseId, $topicId) {
    // Query to fetch unique sectionId and corresponding sectionName for the given topicId
    $query = "SELECT DISTINCT sectionId, sectionName FROM sections WHERE topicId='$topicId' AND courseId = '$courseId'";

    // Execute the query and fetch the result
    $result = mysqli_query($conn, $query);

    // Initialize an empty array to store the section data
    $sections = array();

    // Loop through the result and add the section data to the array
    while ($row = mysqli_fetch_assoc($result)) {
        $sectionId = $row['sectionId'];
        $sectionName = $row['sectionName'];
        $section = array("sectionId" => $sectionId, "sectionName" => $sectionName);
        array_push($sections, $section);
    }

    // Echo the JSON encoded array of sectionIds and sectionNames
    echo json_encode($sections);
}


// Function to insert or update schedules
function insertOrUpdateSchedules($conn, $courseId, $schedules)
{
    foreach ($schedules as $schedule) {
        $topicId = $schedule['topicId'];
        $date = $schedule['date'];

        // Check if the row with the given scheduleId and topicId already exists in the schedules table
        $query = "SELECT * FROM schedules WHERE  topicId = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $topicId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row) {
            // If the row exists, update the date
            $updateQuery = "UPDATE schedules SET date = ? WHERE topicId = ?";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bind_param("ss", $date, $topicId);
            $stmt->execute();
        } else {
            $scheduleId = generateUniqueScheduleId($conn);
            // If the row does not exist, insert a new row
            $insertQuery = "INSERT INTO schedules (scheduleId, courseId, topicId, date) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            $stmt->bind_param("ssss", $scheduleId, $courseId, $topicId, $date);
            $stmt->execute();
        }
    }
}

// Function to generate unique scheduleId
function generateUniqueScheduleId($conn)
{
    // Get the row count from the schedules table
    $query = "SELECT COUNT(*) as count FROM schedules";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $rowCount = $row['count'];

    // Generate the unique scheduleId
    $scheduleId = 'SCH' . ($rowCount + 1);

    return $scheduleId;
}



function getScheduleByCourse($conn, $courseId)
{
    // Fetch schedule data for the selected courseId (replace with your actual query)
    $query = "SELECT topicId, date FROM schedules WHERE courseId = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    $scheduleData = $result->fetch_all(MYSQLI_ASSOC);

    // Return the schedule data as JSON response
    echo json_encode($scheduleData);
}


function saveUserMessage($conn, $userId, $message, $courseId) {
    // Prepare the SQL statement to insert the user's message into the classroomchat table
    $sql = "INSERT INTO classroomchat (courseId, userId, message, datetime) 
            VALUES (?, ?, ?, NOW())";
    
    // Prepare the SQL statement using prepared statements to prevent SQL injection
    $stmt = $conn->prepare($sql);
    
    // Bind the values to the prepared statement
    $stmt->bind_param("sss", $courseId, $userId, $message);
    
    // Execute the prepared statement
    $stmt->execute();
    
    // Check if the execution was successful
    if ($stmt->affected_rows > 0) {
      // Get the inserted message ID
      $messageId = $stmt->insert_id;
      
      // Prepare the SQL statement to retrieve the entire message history for the specific courseId
      $sql = "SELECT c.*, u.name, u.photo 
              FROM classroomchat AS c
              INNER JOIN users AS u ON c.userId = u.uid
              WHERE c.courseId = ?
              ORDER BY c.datetime ASC";
      
      // Prepare the SQL statement using prepared statements
      $stmt = $conn->prepare($sql);
      
      // Bind the courseId to the prepared statement
      $stmt->bind_param("s", $courseId);
      
      // Execute the prepared statement
      $stmt->execute();
      
      // Get the result set
      $result = $stmt->get_result();
      
      // Fetch the message history
      $messageHistory = array();
      while ($row = $result->fetch_assoc()) {
        $messageHistory[] = array(
          'id' => $row['id'],
          'message' => $row['message'],
          'datetime' => $row['datetime'],
          'user' => array(
            'id' => $row['userId'],
            'name' => $row['name'],
            'photo' => $row['photo']
          )
        );
      }
      
      // Prepare the response array
      $response = array(
        'success' => true,
        'messageHistory' => $messageHistory
      );
      
      // Retrieve the set of active logged-in users
      $sql = "SELECT id, name, photo 
              FROM users 
              WHERE status = 'Active'";
      
      // Execute the SQL statement
      $result = $conn->query($sql);
      
      if ($result) {
        // Fetch the logged-in user objects
        $loggedInUsers = array();
        while ($row = $result->fetch_assoc()) {
          $loggedInUsers[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'photo' => $row['photo']
          );
        }
        
        // Add the logged-in users to the response
        $response['loggedInUsers'] = $loggedInUsers;
      }
    } else {
      // Prepare the response in case of an error
      $response = array(
        'success' => false,
        'message' => 'Failed to save message.'
      );
    }
    
    // Convert the response to JSON format
    $jsonResponse = json_encode($response);
    
    // Set the response header to indicate JSON content
    header('Content-Type: application/json');
    
    // Echo the JSON response
    echo $jsonResponse;
  }


  function saveOrRetrieveMessages($conn, $userId, $message, $courseId) {
    // Check if $message exists
    if ($message !== 'init') {
      // Prepare the SQL statement to insert the user's message into the classroomchat table
      $sql = "INSERT INTO classroomchat (courseId, userId, message, datetime) 
              VALUES (?, ?, ?, NOW())";
  
      // Prepare the SQL statement using prepared statements to prevent SQL injection
      $stmt = $conn->prepare($sql);
  
      // Bind the values to the prepared statement
      $stmt->bind_param("sss", $courseId, $userId, $message);
  
      // Execute the prepared statement
      $stmt->execute();
  
      // Check if the execution was successful
      if ($stmt->affected_rows > 0) {
        // Get the inserted message ID
        $messageId = $stmt->insert_id;
      } else {
        // Prepare the response in case of an error
        $response = array(
          'success' => false,
          'message' => 'Failed to save message.'
        );
  
        // Convert the response to JSON format
        $jsonResponse = json_encode($response);
  
        // Set the response header to indicate JSON content
        header('Content-Type: application/json');
  
        // Echo the JSON response
        echo $jsonResponse;
  
        return;
      }
    }
  
    // Prepare the SQL statement to retrieve the entire message history for the specific courseId
    $sql = "SELECT c.*, u.name, u.photo 
            FROM classroomchat AS c
            INNER JOIN users AS u ON c.userId = u.uid
            WHERE c.courseId = ?
            ORDER BY c.datetime ASC";
  
    // Prepare the SQL statement using prepared statements
    $stmt = $conn->prepare($sql);
  
    // Bind the courseId to the prepared statement
    $stmt->bind_param("s", $courseId);
  
    // Execute the prepared statement
    $stmt->execute();
  
    // Get the result set
    $result = $stmt->get_result();
  
    // Fetch the message history
    $messageHistory = array();
    while ($row = $result->fetch_assoc()) {
      $messageHistory[] = array(
        'id' => $row['id'],
        'message' => $row['message'],
        'datetime' => $row['datetime'],
        'user' => array(
          'id' => $row['userId'],
          'name' => $row['name'],
          'photo' => $row['photo']
        )
      );
    }
  
    // Prepare the response array
    $response = array(
      'success' => true,
      'messageHistory' => $messageHistory
    );
  
    // Retrieve the set of active logged-in users
    $sql = "SELECT id, name, photo 
            FROM users 
            WHERE status = 'Active'";
  
    // Execute the SQL statement
    $result = $conn->query($sql);
  
    if ($result) {
      // Fetch the logged-in user objects
      $loggedInUsers = array();
      while ($row = $result->fetch_assoc()) {
        $loggedInUsers[] = array(
          'id' => $row['id'],
          'name' => $row['name'],
          'photo' => $row['photo']
        );
      }
  
      // Add the logged-in users to the response
      $response['loggedInUsers'] = $loggedInUsers;
    }
  
    // Convert the response to JSON format
    $jsonResponse = json_encode($response);
  
    // Set the response header to indicate JSON content
    header('Content-Type: application/json');
  
    // Echo the JSON response
    echo $jsonResponse;
  }




  function saveAPIKey($conn, $userId, $apiKey) {
      // Prepare the SQL statement to update the 'apiKey' field in the 'users' table
      $sql = "UPDATE users SET apiKey = ? WHERE uid = ?";
  
      // Prepare and execute the SQL statement
      $stmt = $conn->prepare($sql);
      $stmt->bind_param("ss", $apiKey, $userId);
      $result = $stmt->execute();
  
      // Check if the update was successful
      if ($result) {
          echo json_encode(array('success' => true));
      } else {
          echo json_encode(array('success' => false));
      }
  }
  
  function getAPIKey($conn, $userId) {
      // Prepare the SQL statement to retrieve the 'apiKey' field from the 'users' table
      $sql = "SELECT apiKey FROM users WHERE uid = ?";
  
      // Prepare and execute the SQL statement
      $stmt = $conn->prepare($sql);
      $stmt->bind_param("s", $userId);
      $stmt->execute();
      $stmt->bind_result($apiKey);
      $stmt->fetch();
  
      // Return the retrieved API key as a JSON response
      echo json_encode(array('apiKey' => $apiKey));
  }
  




?>
