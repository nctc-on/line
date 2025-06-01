// Receipt Generator
function generateReceiptNumber() {
    const now = new Date();
    
    // Get date components
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    // Get time in 24-hour format
    let hours = now.getHours();
    // Convert from 12-hour to 24-hour format
    if (hours === 0) {
        // 12:XX AM becomes 00:XX
        hours = 0;
    } else if (hours === 12) {
        // 12:XX PM stays as 12:XX
        hours = 12;
    } else if (hours > 12) {
        // 1:XX PM becomes 13:XX, etc.
        hours = hours;
    }
    
    const hoursStr = hours.toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Format: NCTC/YYYYMMDDHHMMSSN
    // Example for 12:38:22 AM -> NCTC/20250531003822N
    // Example for 12:38:22 PM -> NCTC/20250531123822N
    return `NCTC/${year}${month}${day}${hoursStr}${minutes}${seconds}N`;
}

function generateReceipt(formData) {
    const receiptNumber = generateReceiptNumber();
    // Format date in Indian format
    const date = new Date().toLocaleDateString('en-IN');
    // Format time in 24-hour format
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });

    return {
        number: receiptNumber,
        html: `
<!DOCTYPE html>
<html>
<head>
    <title>NCTC Admission Receipt - ${receiptNumber}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@700;800;900&family=Roboto+Slab:wght@600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #475569;
            --accent: #f59e0b;
            --success: #22c55e;
            --danger: #ef4444;
            --light: #f8fafc;
            --dark: #1e293b;
        }

        @page {
            size: A5 landscape;
            margin: 0;
        }

        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f6f8fc 0%, #e9eef8 100%);
            color: var(--dark);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .receipt-container {
            width: 210mm;
            height: 148mm;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
            display: grid;
            grid-template-rows: auto 1fr auto;
            page-break-after: always;
        }

        .receipt-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 15px;
            text-align: center;
            position: relative;
        }

        .receipt-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            opacity: 0.3;
        }

        .receipt-header h1 {
            margin: 0;
            font-size: 2.2em;
            font-weight: 800;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            background: linear-gradient(120deg, #ffffff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .receipt-number {
            background: rgba(255,255,255,0.15);
            padding: 5px 15px;
            border-radius: 50px;
            font-size: 1em;
            margin: 8px auto;
            display: inline-block;
            backdrop-filter: blur(5px);
            font-family: 'Roboto Slab', serif;
            letter-spacing: 1px;
        }

        .receipt-body {
            padding: 15px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            align-content: start;
        }

        .section {
            background: var(--light);
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
            height: fit-content;
        }

        .section:hover {
            transform: translateY(-3px);
        }

        .section h3 {
            color: var(--primary);
            margin: 0 0 10px 0;
            font-size: 1.1em;
            font-family: 'Montserrat', sans-serif;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section h3 i {
            font-size: 1.1em;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 5px 0;
            border-bottom: 1px dashed #e2e8f0;
        }

        .detail-label {
            font-weight: 600;
            color: var(--secondary);
            font-size: 0.9em;
            font-family: 'Roboto Slab', serif;
        }

        .detail-value {
            color: var(--dark);
            font-size: 0.9em;
            font-weight: 500;
            text-align: right;
        }

        .receipt-footer {
            text-align: center;
            padding: 12px;
            background: var(--light);
            border-top: 2px dashed #e2e8f0;
        }

        .receipt-footer p {
            margin: 3px 0;
            color: var(--secondary);
            font-size: 0.9em;
        }

        .verification-badge {
            background: var(--success);
            color: white;
            padding: 6px 15px;
            border-radius: 50px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin: 8px 0;
            font-weight: 600;
            font-size: 0.9em;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .contact-info {
            margin-top: 8px;
            padding: 8px;
            background: rgba(37, 99, 235, 0.1);
            border-radius: 8px;
            color: var(--primary);
            font-size: 0.9em;
            font-family: 'Roboto Slab', serif;
        }

        .timestamp {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 8px 0;
            color: rgba(255,255,255,0.9);
            font-size: 0.9em;
            font-family: 'Roboto Slab', serif;
        }

        .timestamp div {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .print-button {
            background: var(--accent);
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            margin-top: 8px;
        }

        .print-button:hover {
            background: #e67e00;
            transform: translateY(-2px);
        }

        @media print {
            @page {
                size: A4 landscape;
                margin: 0;
            }

            body {
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
            }

            .receipt-container {
                transform: scale(1.4);
                transform-origin: center;
                box-shadow: none;
            }

            .print-button {
                display: none;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <h1>🏫 NCTC Admission Receipt</h1>
            <div class="receipt-number">
                <i class="fas fa-hashtag"></i> ${receiptNumber}
            </div>
            <div class="timestamp">
                <div><i class="far fa-calendar"></i> ${date}</div>
                <div><i class="far fa-clock"></i> ${time} (24-hour format)</div>
            </div>
        </div>

        <div class="receipt-body">
            <div class="section">
                <h3><i class="fas fa-user-graduate"></i> Application Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${formData.fullName || formData.name || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Course:</span>
                    <span class="detail-value">${formData.course || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Batch:</span>
                    <span class="detail-value">${formData.batch || 'N/A'}</span>
                </div>
            </div>

            <div class="section">
                <h3><i class="fas fa-address-card"></i> Contact Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${formData.phone || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${formData.email || 'N/A'}</span>
                </div>
            </div>

            <div class="section">
                <h3><i class="fas fa-map-marker-alt"></i> Location Details</h3>
                <div class="detail-row">
                    <span class="detail-label">State:</span>
                    <span class="detail-value">${formData.state || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">District:</span>
                    <span class="detail-value">${formData.district || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Block:</span>
                    <span class="detail-value">${formData.block || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Police Station:</span>
                    <span class="detail-value">${formData.policeStation || 'N/A'}</span>
                </div>
            </div>
        </div>

        <div class="receipt-footer">
            <div class="verification-badge">
                <i class="fas fa-check-circle"></i>
                Computer Generated Receipt
            </div>
            <p><strong>Thank you for choosing NCTC!</strong></p>
            <div class="contact-info">
                <p><i class="fas fa-phone"></i> For any queries, contact: 9775765498 / 9775862051</p>
            </div>
            <button onclick="window.print()" class="print-button">
                <i class="fas fa-print"></i> Print Receipt
            </button>
        </div>
    </div>
</body>
</html>`,
        text: `🧾 *NCTC Admission Receipt*
---------------------------
Receipt No: ${receiptNumber}
Date: ${date}
Time: ${time} (24-hour format)

*Application Details*
---------------------------
Name: ${formData.fullName || formData.name || 'N/A'}
Course: ${formData.course || 'N/A'}
Batch: ${formData.batch || 'N/A'}

*Contact Details*
---------------------------
Phone: ${formData.phone || 'N/A'}
Email: ${formData.email || 'N/A'}

*Location Details*
---------------------------
State: ${formData.state || 'N/A'}
District: ${formData.district || 'N/A'}
Block: ${formData.block || 'N/A'}
Police Station: ${formData.policeStation || 'N/A'}

This receipt is computer generated and serves as proof of your application submission.

Thank you for choosing NCTC!
For any queries, contact: 9775765498 / 9775862051
---------------------------`
    };
}

function openReceiptInNewTab(receipt) {
    // Create a new window/tab
    const receiptWindow = window.open('', '_blank');
    
    // Write the receipt HTML to the new window
    receiptWindow.document.write(receipt.html);
    
    // Add print button functionality
    receiptWindow.document.write(`
        <script>
            function printReceipt() {
                window.print();
            }

            // Auto-print after a short delay to ensure styles are loaded
            setTimeout(() => {
                printReceipt();
            }, 1000);
        </script>
    `);
    
    // Close the document write
    receiptWindow.document.close();
}

// Function to download receipt as PDF
function downloadReceiptAsPDF(receipt) {
    const element = document.createElement('div');
    element.innerHTML = receipt.html;
    
    html2pdf()
        .set({
            margin: 1,
            filename: `NCTC_Receipt_${receipt.number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'landscape' }
        })
        .from(element)
        .save();
}

// Function to retrieve a specific receipt by number
function getReceiptByNumber(receiptNumber) {
    const savedReceipts = JSON.parse(localStorage.getItem('admissionReceipts') || '[]');
    return savedReceipts.find(r => r.receipt.number === receiptNumber);
}

// Function to list all saved receipts
function listAllReceipts() {
    return JSON.parse(localStorage.getItem('admissionReceipts') || '[]');
}

// Add event listener for the print button if it exists
document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.querySelector('.print-receipt-btn');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
}); 