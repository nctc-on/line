// Course configuration
const COURSE_CONFIG = {
    'DCA': {
        price: 2650,
        paymentLink: 'https://payments.cashfree.com/forms/NCTC'
    },
    'ADCA': {
        price: 3150,
        paymentLink: 'https://payments.cashfree.com/forms/aadca'
    },
    'BCC': {
        price: 1650,
        paymentLink: 'https://payments.cashfree.com/forms/bbcc'
    },
    'DTP': {
        price: 1750,
        paymentLink: 'https://payments.cashfree.com/forms/DTPP'
    }
};

// Initialize form handling when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeLocationDropdowns();
    initializeCoursePrice();
});

// Initialize form
function initializeForm() {
    const form = document.getElementById('admissionForm');
    if (!form) return;

    // Add form submission handler
    form.addEventListener('submit', handleFormSubmit);

    // Add file upload validation
    initializeFileValidation();

    // Add input validation
    initializeInputValidation();
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showError('Please fill in all required fields correctly');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Processing...';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Generate receipt and registration numbers
        const { receiptNo, registrationNo } = generateReceiptNumber(data.fullName, data.course);

        // Create receipt container
        const receiptContainer = document.createElement('div');
        receiptContainer.className = 'receipt-container';
        receiptContainer.innerHTML = generateReceiptHTML(data, receiptNo, registrationNo);

        // Create action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'receipt-actions';
        actionsDiv.innerHTML = `
            <button onclick="printReceipt()" class="print-btn">
                <i class="fas fa-print"></i> Print Receipt
            </button>
            <button onclick="sendToWhatsApp('${receiptNo}', '${registrationNo}')" class="whatsapp-btn">
                <i class="fab fa-whatsapp"></i> Continue to WhatsApp
            </button>
            <button onclick="redirectToPayment('${data.course}', '${receiptNo}', '${registrationNo}')" class="payment-btn">
                <i class="fas fa-credit-card"></i> Make Payment
            </button>
        `;
        receiptContainer.appendChild(actionsDiv);

        // Hide the form
        const form = document.getElementById('admissionForm');
        form.style.display = 'none';

        // Show the receipt container
        form.parentNode.insertBefore(receiptContainer, form);

        // Add necessary styles
        const style = document.createElement('style');
        style.textContent = `
            .receipt-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 1rem;
            }
            .receipt-actions {
                padding: 20px;
                display: flex;
                gap: 15px;
                justify-content: center;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }
            .print-btn, .whatsapp-btn, .payment-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .print-btn {
                background: #2563eb;
                color: white;
            }
            .whatsapp-btn {
                background: #25d366;
                color: white;
            }
            .payment-btn {
                background: #f59e0b;
                color: white;
            }
            .print-btn:hover, .whatsapp-btn:hover, .payment-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            @media print {
                body * {
                    visibility: hidden;
                }
                .receipt-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
                #receipt {
                    visibility: visible;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 20px;
                }
                .receipt-actions {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred. Please try again.');
        
        // Reset submit button
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
    }
}

// Print receipt function
function printReceipt() {
    const receipt = document.getElementById('receipt');
    if (!receipt) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>NCTC Admission Receipt</title>
            <style>
                @page {
                    size: 148mm 210mm landscape;
                    margin: 0;
                }
                body {
                    margin: 0;
                    padding: 15px;
                }
                #receipt {
                    width: 180mm;
                    height: 138mm;
                    margin: 0;
                    padding: 15px;
                }
            </style>
        </head>
        <body>
            ${receipt.outerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for images to load before printing
    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        setTimeout(function() {
            printWindow.close();
        }, 1000);
    };
}

// Generate receipt number
function generateReceiptNumber(name, course) {
    const now = new Date();
    const timestamp = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0');
    
    // Generate registration number in format: NCTC/hhmmss(millisecond)(name first letter)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const nameInitial = name.charAt(0).toUpperCase();
    
    const receiptNo = `NCTC/${timestamp}${name[0]}${course[0]}`;
    const registrationNo = `NCTC/${hours}${minutes}${seconds}${milliseconds}${nameInitial}`;
    
    return { receiptNo, registrationNo };
}

// Send to WhatsApp with files
async function sendToWhatsApp(receiptNo, registrationNo) {
    const data = getFormData();
    const whatsappMsg = generateWhatsAppMessage(data, receiptNo, registrationNo);
    
    // Get all file inputs
    const photoInput = document.getElementById('photo');
    const aadharInput = document.getElementById('aadhar');
    const marksheetInput = document.getElementById('marksheet');
    
    // Create a folder name using receipt number
    const folderName = `NCTC_Admission_${receiptNo}`;
    
    // Create Google Drive upload link
    const driveLink = `https://drive.google.com/drive/folders/create?usp=sharing&folderName=${encodeURIComponent(folderName)}`;
    
    // Add file upload instructions to the message
    const fileInstructions = `
*Please upload your documents to Google Drive:*
1. Click this link to create a folder: ${driveLink}
2. Upload these files to the folder:
   - Passport Photo
   - Aadhar Card
   - Marksheet
3. Share the folder with: sahidaktar468@gmail.com
4. Send the folder link in this chat

Thank you for your cooperation!`;

    // Send the complete message
    const completeMessage = whatsappMsg + fileInstructions;
    window.open(`https://wa.me/919775765498?text=${encodeURIComponent(completeMessage)}`, '_blank');
}

// Generate receipt HTML
function generateReceiptHTML(data, receiptNo, registrationNo) {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-IN', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-IN');

    const coursePrice = COURSE_CONFIG[data.course]?.price || 0;

    return `
        <div id="receipt" style="padding: 15px; font-family: Arial, sans-serif; background: white;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 700;">NCTC</h1>
                <p style="color: #64748b; margin: 3px 0; font-size: 14px;">National Computer Training Center</p>
            </div>

            <!-- Receipt Info -->
            <div style="text-align: center; margin-bottom: 15px;">
                <h2 style="color: #2563eb; margin: 0; font-size: 18px;">ADMISSION RECEIPT</h2>
                <p style="color: #64748b; font-size: 12px; margin: 5px 0;">
                    Receipt No: <strong>${receiptNo}</strong><br>
                    Registration No: <strong>${registrationNo}</strong><br>
                    Date: <strong>${dateTimeString}</strong>
                </p>
            </div>

            <!-- Details Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 12px;">
                <div style="background: #f8fafc; padding: 10px; border-radius: 5px;">
                    <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 14px;">Student Details</h3>
                    <p style="margin: 4px 0;"><strong>Name:</strong> ${data.fullName}</p>
                    <p style="margin: 4px 0;"><strong>Phone:</strong> ${data.phone}</p>
                    <p style="margin: 4px 0;"><strong>Email:</strong> ${data.email}</p>
                </div>
                <div style="background: #f8fafc; padding: 10px; border-radius: 5px;">
                    <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 14px;">Course Details</h3>
                    <p style="margin: 4px 0;"><strong>Course:</strong> ${data.course}</p>
                    <p style="margin: 4px 0;"><strong>Batch:</strong> ${getBatchTiming(data.batch)}</p>
                    <p style="margin: 4px 0;"><strong>Course Fee:</strong> ₹${coursePrice}</p>
                </div>
            </div>

            <!-- Contact Info -->
            <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 10px; font-size: 11px;">
                <p style="margin: 3px 0;">Contact: +91 9775765498 / +91 9775862051</p>
                <p style="margin: 3px 0;">Email: sahidaktar468@gmail.com</p>
            </div>

            <!-- Signature -->
            <div style="text-align: right; margin-top: 20px;">
                <img src="sign.png" alt="Director's Signature" style="height: 50px; object-fit: contain; margin-bottom: 1px;">
                <p style="margin: 1px 0; font-size: 12px;">Director's Signature</p>
            </div>
        </div>
    `;
}

// Generate WhatsApp message
function generateWhatsAppMessage(data, receiptNo, registrationNo) {
    const coursePrice = COURSE_CONFIG[data.course]?.price || 0;
    
    return `
*NCTC Admission Details*
Receipt No: ${receiptNo}
Registration No: ${registrationNo}

*Student Details:*
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}

*Course Details:*
Course: ${data.course}
Batch: ${getBatchTiming(data.batch)}
Course Fee: ₹${coursePrice}

*Address Details:*
State: ${data.state}
District: ${data.district}
Address: ${data.address}
PIN Code: ${data.pincode}

Thank you for choosing NCTC!
`;
}

// Initialize file validation and display
function initializeFileValidation() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size
                const maxSize = this.id === 'photo' ? 1024 * 1024 : 2 * 1024 * 1024; // 1MB for photo, 2MB for others
                if (file.size > maxSize) {
                    showError(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
                    this.value = '';
                    return;
                }

                // Display file name
                const uploadBox = this.closest('.upload-box');
                const fileNameDisplay = uploadBox.querySelector('.file-name') || document.createElement('p');
                fileNameDisplay.className = 'file-name';
                fileNameDisplay.style.color = '#2563eb';
                fileNameDisplay.style.marginTop = '8px';
                fileNameDisplay.style.fontSize = '0.9rem';
                fileNameDisplay.textContent = `Selected: ${file.name}`;
                
                if (!uploadBox.querySelector('.file-name')) {
                    uploadBox.appendChild(fileNameDisplay);
                }
            }
        });
    });
}

// Initialize input validation
function initializeInputValidation() {
    // Date of Birth validation for minimum age
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        // Create age display element
        const ageDisplay = document.createElement('span');
        ageDisplay.className = 'age-display';
        ageDisplay.style.marginLeft = '10px';
        ageDisplay.style.color = '#2563eb';
        ageDisplay.style.fontSize = '0.9rem';
        dobInput.parentNode.appendChild(ageDisplay);

        dobInput.addEventListener('change', function(e) {
            const dob = new Date(e.target.value);
            const today = new Date();
            
            // Calculate exact age
            let years = today.getFullYear() - dob.getFullYear();
            let months = today.getMonth() - dob.getMonth();
            let days = today.getDate() - dob.getDate();

            // Adjust for negative months or days
            if (days < 0) {
                months--;
                // Get the last day of the previous month
                const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += lastMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            // Calculate total months for more precise age
            const totalMonths = years * 12 + months;
            const actualAge = years;

            // Update age display with detailed information
            ageDisplay.textContent = `Age: ${years} years, ${months} months, ${days} days`;
            
            if (actualAge < 16) {
                showError('You must be at least 16 years old to apply');
                e.target.value = '';
                e.target.classList.add('error');
                ageDisplay.style.color = '#dc2626'; // Red color for invalid age
            } else {
                e.target.classList.remove('error');
                ageDisplay.style.color = '#2563eb'; // Blue color for valid age
            }
        });

        // Clear age display when DOB is cleared
        dobInput.addEventListener('input', function(e) {
            if (!e.target.value) {
                ageDisplay.textContent = '';
            }
        });
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                e.target.value = value.slice(0, 10);
            } else {
                e.target.value = value;
            }
        });
    }

    // PIN code validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) {
                e.target.value = value.slice(0, 6);
            } else {
                e.target.value = value;
            }
        });
    }

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = e.target.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                e.target.classList.add('error');
            } else {
                e.target.classList.remove('error');
            }
        });
    }
}

// Initialize location dropdowns
function initializeLocationDropdowns() {
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');

    if (!stateSelect || !districtSelect) return;

    // Handle state selection
    stateSelect.addEventListener('change', function() {
        const selectedState = this.value;
        
        // Reset district dropdown
        districtSelect.innerHTML = '<option value="">Select District</option>';
        
        if (selectedState === 'West Bengal') {
            // Add West Bengal districts
            const districts = [
                "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
                "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong",
                "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas",
                "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman",
                "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
            ];

            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });

            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('admissionForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Check required fields
    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    // Check age requirement
    const dobInput = document.getElementById('dob');
    if (dobInput && dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
            ? age - 1 
            : age;

        if (actualAge < 16) {
            showError('You must be at least 16 years old to apply');
            dobInput.classList.add('error');
            isValid = false;
        }
    }

    return isValid;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.getElementById('admissionForm');
    form.insertBefore(errorDiv, form.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const form = document.getElementById('admissionForm');
    form.insertBefore(successDiv, form.firstChild);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Helper function to get form data
function getFormData() {
    const form = document.getElementById('admissionForm');
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}

function getBatchTiming(batchValue) {
    const batchTimings = {
        'batch1': '08:00 AM - 10:00 AM',
        'batch2': '10:30 AM - 12:30 PM',
        'batch3': '01:00 PM - 03:00 PM',
        'batch4': '03:15 PM - 05:15 PM',
        'batch5': '05:30 PM - 07:30 PM'
    };
    return batchTimings[batchValue] || batchValue;
}

// Initialize course price display
function initializeCoursePrice() {
    const courseSelect = document.getElementById('course');
    const priceDisplay = document.createElement('div');
    priceDisplay.className = 'course-price-display';
    priceDisplay.style.marginTop = '10px';
    priceDisplay.style.color = '#2563eb';
    priceDisplay.style.fontWeight = 'bold';
    courseSelect.parentNode.appendChild(priceDisplay);

    courseSelect.addEventListener('change', function(e) {
        const selectedCourse = e.target.value;
        if (selectedCourse && COURSE_CONFIG[selectedCourse]) {
            priceDisplay.textContent = `Course Price: ₹${COURSE_CONFIG[selectedCourse].price}`;
        } else {
            priceDisplay.textContent = '';
        }
    });
}

// Add payment redirection function
function redirectToPayment(course, receiptNo, registrationNo) {
    if (COURSE_CONFIG[course]) {
        const paymentLink = COURSE_CONFIG[course].paymentLink;
        const studentName = document.getElementById('fullName').value;
        const studentEmail = document.getElementById('email').value;
        const studentPhone = document.getElementById('phone').value;
        const coursePrice = COURSE_CONFIG[course].price;
        
        // Create payment URL with only essential details
        const paymentUrl = new URL(paymentLink);
        
        // Add parameters with correct field names for Cashfree form auto-filling
        const params = new URLSearchParams({
            'customerName': studentName,
            'customerEmail': studentEmail,
            'customerPhone': studentPhone,
            'orderAmount': coursePrice,
            'orderId': registrationNo,
            'orderCurrency': 'INR',
            'orderNote': `Course: ${course}`,
            'source': 'website',
            'returnUrl': window.location.origin + '/payment-success.html',
            'notifyUrl': window.location.origin + '/payment-notify.html'
        });
        
        // Append parameters to URL
        paymentUrl.search = params.toString();
        
        // Redirect to payment page
        window.location.href = paymentUrl.toString();
    }
} 
