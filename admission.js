// Initialize form handling when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeLocationDropdowns();
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

        // Generate receipt number
        const receiptNo = generateReceiptNumber(data.fullName, data.course);

        // Create receipt container
        const receiptContainer = document.createElement('div');
        receiptContainer.className = 'receipt-container';
        receiptContainer.innerHTML = generateReceiptHTML(data, receiptNo);

        // Create action buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'receipt-actions';
        actionsDiv.innerHTML = `
            <button onclick="printReceipt()" class="print-btn">
                <i class="fas fa-print"></i> Print Receipt
            </button>
            <button onclick="sendToWhatsApp('${receiptNo}')" class="whatsapp-btn">
                <i class="fab fa-whatsapp"></i> Continue to WhatsApp
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
            .print-btn, .whatsapp-btn {
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
            .print-btn:hover, .whatsapp-btn:hover {
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
    
    return `NCTC/${timestamp}${name[0]}${course[0]}`;
}

// Send to WhatsApp
function sendToWhatsApp(receiptNo) {
    const data = getFormData();
    const whatsappMsg = generateWhatsAppMessage(data, receiptNo);
    window.location.replace(`https://wa.me/919775765498?text=${encodeURIComponent(whatsappMsg)}`);
}

// Generate receipt HTML
function generateReceiptHTML(data, receiptNo) {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-IN', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-IN');

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
function generateWhatsAppMessage(data, receiptNo) {
    return `
*NCTC Admission Details*
Receipt No: ${receiptNo}

*Student Details:*
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}

*Course Details:*
Course: ${data.course}
Batch: ${getBatchTiming(data.batch)}

Thank you for choosing NCTC!
`;
}

// Initialize file validation
function initializeFileValidation() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Check file size
            const maxSize = input.id === 'photo' ? 1024 * 1024 : 2 * 1024 * 1024; // 1MB for photo, 2MB for others
            if (file.size > maxSize) {
                const sizeInMB = maxSize / (1024 * 1024);
                showError(`File size should not exceed ${sizeInMB}MB`);
                input.value = '';
                return;
            }

            // Check file type
            if (input.id === 'photo') {
                if (!file.type.match('image.*')) {
                    showError('Please upload a valid image file');
                    input.value = '';
                    return;
                }
            } else {
                if (!file.type.match('image.*') && file.type !== 'application/pdf') {
                    showError('Please upload a valid image or PDF file');
                    input.value = '';
                    return;
                }
            }
        });
    });
}

// Initialize input validation
function initializeInputValidation() {
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

    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

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