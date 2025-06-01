// Mobile Menu Functionality
function showMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.add('active');
}

function hideMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

// Handle submenu on mobile
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        const hasSubmenu = document.querySelectorAll('.has-submenu > a');
        
        hasSubmenu.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const isDisplayed = submenu.style.display === 'block';
                
                // Hide all other submenus
                document.querySelectorAll('.submenu').forEach(menu => {
                    menu.style.display = 'none';
                });
                
                // Toggle current submenu
                submenu.style.display = isDisplayed ? 'none' : 'block';
            });
        });
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.querySelector('.fa-bars');
    
    if (!navLinks.contains(e.target) && e.target !== menuBtn) {
        hideMenu();
    }
});

// Handle active menu items
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-links a');
    
    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentLocation || 
            currentLocation.endsWith(item.getAttribute('href'))) {
            item.classList.add('active');
            
            // If it's a submenu item, also highlight parent
            const parent = item.closest('.has-submenu');
            if (parent) {
                parent.querySelector('> a').classList.add('active');
            }
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Hide mobile menu after clicking a link
            hideMenu();
        }
    });
});

// Form Submission
const enquiryForm = document.querySelector('.enquiry-form');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const district = this.district.value;
        const course = this.course.value;
        
        // You can handle the form submission here
        alert('Thank you for your enquiry!\nDistrict: ' + district + '\nCourse: ' + course);
        this.reset();
    });
}

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links ul li a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Function to send location via WhatsApp
function sendLocationViaWhatsApp() {
    const formData = {
        state: document.getElementById('state').value,
        district: document.getElementById('district').value,
        block: document.getElementById('block').value,
        policeStation: document.getElementById('police-station').value
    };

    // Generate receipt
    const receipt = generateReceipt(formData);

    // Open receipt in new tab
    openReceiptInNewTab(receipt);

    const message = `${receipt.text}

*Offline Admission Enquiry*
---------------------------
I'm interested in offline admission.

*My Location Details:*
State: ${formData.state || 'Not selected'}
District: ${formData.district || 'Not selected'}
Block: ${formData.block || 'Not selected'}
Police Station: ${formData.policeStation || 'Not selected'}

Please provide more information about the admission process.`;

    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp link
    const whatsappLink = `https://wa.me/919775765498?text=${encodedMessage}`;
    
    // Redirect to WhatsApp after a short delay to allow receipt to open
    setTimeout(() => {
        window.location.href = whatsappLink;
    }, 1000);
} 