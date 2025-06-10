document.addEventListener('DOMContentLoaded', () => {
    const receiptForm = document.getElementById('receiptForm');
    const receiptOutput = document.getElementById('receiptOutput');
    const printReceiptBtn = document.getElementById('printReceipt');
    const formSection = document.querySelector('.form-section');
    const inputs = document.querySelectorAll('input, select');
    const formGroups = document.querySelectorAll('.form-group');

    // Add particle background effect
    createParticleBackground();

    // Enhanced input focus effects
    inputs.forEach(input => {
        // Add ripple effect on focus
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.3s ease';
            createRippleEffect(input);
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });

        // Add typing animation effect
        input.addEventListener('input', () => {
            input.style.animation = 'none';
            input.offsetHeight; // Trigger reflow
            input.style.animation = 'pulse 0.3s ease';
            
            // Add validation feedback
            validateInput(input);
        });

        // Add hover effect
        input.addEventListener('mouseenter', () => {
            input.style.borderColor = 'var(--neon-blue)';
            input.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.3)';
        });

        input.addEventListener('mouseleave', () => {
            if (document.activeElement !== input) {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                input.style.boxShadow = 'none';
            }
        });
    });

    // Enhanced form submission animation
    receiptForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Add loading state with enhanced animation
        formSection.classList.add('loading');
        showLoadingAnimation();
        
        // Simulate processing delay with progress
        await simulateProcessing();
        
        // Get form values
        const formData = getFormData();
        
        // Calculate values with animation
        const calculations = await calculateValues(formData);
        
        // Generate receipt with enhanced animations
        await generateReceipt(formData, calculations);
        
        // Show success animation
        showSuccessAnimation();
    });

    // Enhanced print button animation
    printReceiptBtn.addEventListener('click', () => {
        printReceiptBtn.style.transform = 'scale(0.95)';
        createPrintAnimation();
        
        setTimeout(() => {
            printReceiptBtn.style.transform = 'scale(1)';
            window.print();
        }, 200);
    });

    // Enhanced form group hover effects
    formGroups.forEach(group => {
        group.addEventListener('mouseenter', () => {
            group.style.transform = 'translateY(-5px)';
            group.style.transition = 'transform 0.3s ease';
            createHoverEffect(group);
        });

        group.addEventListener('mouseleave', () => {
            group.style.transform = 'translateY(0)';
        });
    });

    // Helper functions
    function createParticleBackground() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);
        }
    }

    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        element.parentElement.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    }

    function validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        input.style.borderColor = isValid ? 'var(--neon-blue)' : 'var(--neon-pink)';
        input.style.boxShadow = isValid ? 
            '0 0 10px rgba(0, 243, 255, 0.3)' : 
            '0 0 10px rgba(255, 0, 247, 0.3)';
    }

    function showLoadingAnimation() {
        const loading = document.createElement('div');
        loading.className = 'loading-animation';
        loading.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loading);
        
        setTimeout(() => loading.remove(), 1000);
    }

    async function simulateProcessing() {
        const progress = document.createElement('div');
        progress.className = 'progress-bar';
        document.body.appendChild(progress);
        
        for (let i = 0; i <= 100; i += 10) {
            progress.style.width = i + '%';
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        progress.remove();
    }

    function getFormData() {
        return {
            centerName: document.getElementById('centerName').value,
            centerAddress: document.getElementById('centerAddress').value,
            studentName: document.getElementById('studentName').value,
            studentDOB: document.getElementById('studentDOB').value,
            fatherName: document.getElementById('fatherName').value,
            motherName: document.getElementById('motherName').value,
            studentPhone: document.getElementById('studentPhone').value,
            studentEmail: document.getElementById('studentEmail').value,
            registrationNo: document.getElementById('registrationNo').value,
            classType: document.getElementById('classType').value,
            courseName: document.getElementById('courseName').value,
            coursePrice: parseFloat(document.getElementById('coursePrice').value),
            discount: parseFloat(document.getElementById('discount').value),
            gst: parseFloat(document.getElementById('gst').value),
            paidBefore: parseFloat(document.getElementById('paidBefore').value),
            paidToday: parseFloat(document.getElementById('paidToday').value),
            batchTime: document.getElementById('batchTime').value
        };
    }

    async function calculateValues(data) {
        const priceAfterDiscount = data.coursePrice - (data.coursePrice * (data.discount / 100));
        const totalPrice = priceAfterDiscount * (1 + (data.gst / 100));
        const totalPaid = data.paidBefore + data.paidToday;
        const due = totalPrice - totalPaid;
        
        return {
            priceAfterDiscount,
            totalPrice,
            totalPaid,
            due,
            paymentStatus: due <= 0 ? 'Full Payment' : 'Partial Payment'
        };
    }

    async function generateReceipt(formData, calculations) {
        const now = new Date();
        const receiptNo = generateReceiptNumber(now, formData.studentName, formData.centerName);
        const receiptDate = formatDate(now);
        
        // Format the date of birth
        const dob = new Date(formData.studentDOB);
        const formattedDOB = dob.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        const elements = {
            'outputCenterName': formData.centerName,
            'outputCenterAddress': formData.centerAddress,
            'receiptNo': receiptNo,
            'receiptDate': receiptDate,
            'outputStudentName': formData.studentName,
            'outputStudentDOB': formattedDOB,
            'outputFatherName': formData.fatherName,
            'outputMotherName': formData.motherName,
            'outputStudentPhone': formData.studentPhone,
            'outputStudentEmail': formData.studentEmail,
            'outputRegistrationNo': formData.registrationNo,
            'outputClassType': formData.classType,
            'outputCourseName': formData.courseName,
            'outputBatchTime': formData.batchTime,
            'outputCoursePrice': formData.coursePrice.toFixed(2),
            'outputDiscount': formData.discount.toFixed(2),
            'outputGst': formData.gst.toFixed(2),
            'outputTotalPrice': calculations.totalPrice.toFixed(2),
            'outputPaidBefore': formData.paidBefore.toFixed(2),
            'outputPaidToday': formData.paidToday.toFixed(2),
            'outputTotalPaid': calculations.totalPaid.toFixed(2),
            'outputDue': Math.max(0, calculations.due).toFixed(2),
            'outputPaymentStatus': calculations.paymentStatus
        };

        // Animate each element with staggered delay
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.textContent = value;
                
                await new Promise(resolve => setTimeout(resolve, 50));
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }

        // Show receipt section with animation
        receiptOutput.style.display = 'block';
        await new Promise(resolve => setTimeout(resolve, 500));
        receiptOutput.classList.add('show');
        printReceiptBtn.style.display = 'block';
        formSection.classList.remove('loading');
    }

    function generateReceiptNumber(date, studentName, centerName) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        const studentInitial = studentName.charAt(0).toUpperCase();
        const instituteInitial = centerName.charAt(0).toUpperCase();
        
        return `NCTC/${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${studentInitial}${instituteInitial}`;
    }

    function formatDate(date) {
        return date.toLocaleString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function showSuccessAnimation() {
        const successAnimation = document.createElement('div');
        successAnimation.className = 'success-animation';
        successAnimation.innerHTML = '✓';
        document.body.appendChild(successAnimation);

        setTimeout(() => {
            successAnimation.remove();
        }, 2000);
    }

    function createPrintAnimation() {
        const printAnimation = document.createElement('div');
        printAnimation.className = 'print-animation';
        printAnimation.innerHTML = '<div class="print-icon">🖨️</div>';
        document.body.appendChild(printAnimation);

        setTimeout(() => {
            printAnimation.remove();
        }, 1000);
    }

    function createHoverEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'hover-effect';
        element.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1000);
    }
});

// Add styles for new animations
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--neon-blue);
        border-radius: 50%;
        pointer-events: none;
        animation: float 3s infinite;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 1s linear;
        pointer-events: none;
    }

    .loading-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--neon-blue);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
        transition: width 0.3s ease;
        z-index: 1000;
    }

    .print-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 50px;
        animation: printPulse 1s ease-out;
        z-index: 1000;
    }

    .hover-effect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: hoverShine 1s linear;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes printPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }

    @keyframes hoverShine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(style); 