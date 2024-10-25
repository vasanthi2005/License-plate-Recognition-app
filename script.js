// This script handles the main functionality of the License Plate Recognition app

// Simulated database for license plates and user credentials
const users = {
    "police": { username: "police", password: "police123" },
    "owner": { username: "owner", password: "owner123" }
};

const vehicleData = {
    "ABC1234": { owner: "John Doe", rc: true, license: true },
    "XYZ5678": { owner: "Jane Smith", rc: false, license: false },
};

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userType = document.getElementById('userType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate credentials
    if (users[userType] && users[userType].username === username && users[userType].password === password) {
        document.getElementById('welcomeMessage').style.display = 'none'; // Hide welcome message
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'block';
        document.getElementById('about').style.display = 'none'; // Hide About section
        document.getElementById('contact').style.display = 'none'; // Hide Contact section
        document.getElementById('scanButton').style.display = userType === 'police' ? 'block' : 'none';
        document.getElementById('uploadOptions').style.display = userType === 'owner' ? 'block' : 'none';
        document.getElementById('loginMessage').innerText = '';
    } else {
        document.getElementById('loginMessage').innerText = 'Invalid credentials. Please try again.';
    }
});

// Start scanner for police
document.getElementById('scanButton').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.style.display = 'block';
            video.play();
            document.getElementById('captureButton').style.display = 'block';
        })
        .catch(err => {
            console.error("Error accessing the camera: ", err);
            alert("Could not access the camera.");
        });
});

// Capture image from video stream
document.getElementById('captureButton').addEventListener('click', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // Stop video stream
    video.srcObject.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    document.getElementById('captureButton').style.display = 'none';
    
    // Simulate license plate recognition
    const recognizedPlate = "ABC1234"; // Simulated result
    document.getElementById('result').innerHTML = `<p>Recognized License Plate: ${recognizedPlate}</p>`;
    checkLicenseStatus(recognizedPlate);
});

// Check license status
function checkLicenseStatus(licensePlate) {
    const ownerInfo = vehicleData[licensePlate];
    
    if (ownerInfo) {
        const rcStatus = ownerInfo.rc ? "valid" : "invalid";
        const licenseStatus = ownerInfo.license ? "valid" : "invalid";
        const resultMessage = `Owner: ${ownerInfo.owner}, RC Status: ${rcStatus}, License Status: ${licenseStatus}`;
        document.getElementById('result').innerHTML += `<p>${resultMessage}</p>`;
        
        // If either is invalid, suggest a penalty
        if (!ownerInfo.rc || !ownerInfo.license) {
            document.getElementById('result').innerHTML += "<p style='color: red;'>Penalty: $100</p>";
        }
    } else {
        document.getElementById('result').innerHTML += "<p>No information found for this license plate.</p>";
    }
}

// Handle document upload for vehicle owner
function handleDocumentUpload(buttonId, label) {
    document.getElementById(buttonId).addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg, .jpeg, .png';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('result').innerHTML += `<p>${label} Uploaded:</p><img src="${e.target.result}" alt="${label}" style="width: 300px; height: auto;">`;
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    });
}

// Initialize document upload handlers
handleDocumentUpload('uploadLicenseButton', 'License');
handleDocumentUpload('uploadRCButton', 'RC Book');
handleDocumentUpload('uploadInsuranceButton', 'Insurance');
handleDocumentUpload('uploadPictureButton', 'Your Picture');
handleDocumentUpload('uploadPlateButton', 'Number Plate');

// Handle logout
document.getElementById('logoutButton').addEventListener('click', function() {
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('appSection').style.display = 'none';
    document.getElementById('about').style.display = 'none'; // Hide About section
    document.getElementById('contact').style.display = 'none'; // Hide Contact section
    document.getElementById('result').innerHTML = '';
});

// Show About Us section
document.getElementById('aboutButton').addEventListener('click', function() {
    document.getElementById('about').style.display = 'block';
    document.getElementById('contact').style.display = 'none'; // Hide Contact section
});

// Close About Us section
document.getElementById('closeAboutButton').addEventListener('click', function() {
    document.getElementById('about').style.display = 'none';
});

// Show Contact Us section
document.getElementById('contactButton').addEventListener('click', function() {
    document.getElementById('contact').style.display = 'block';
    document.getElementById('about').style.display = 'none'; // Hide About section
});

// Close Contact Us section
document.getElementById('closeContactButton').addEventListener('click', function() {
    document.getElementById('contact').style.display = 'none';
});
