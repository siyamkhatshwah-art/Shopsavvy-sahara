// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
// Track outbound affiliate links
document.addEventListener('click', function(e) {
    // Track product card clicks
    if (e.target.closest('.btn-platform')) {
        e.preventDefault();
        const url = e.target.closest('.btn-platform').getAttribute('href');
        
        // Here you would typically send this data to your analytics
        console.log('Affiliate link clicked:', url);
        
        // Redirect after a small delay
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }
    
    // Track other affiliate links
    if (e.target.closest('[data-affiliate-link]')) {
        e.preventDefault();
        const url = e.target.closest('[data-affiliate-link]').getAttribute('href');
        
        console.log('Affiliate link clicked:', url);
        
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }
});
// Newsletter form handling
const newsletterForm = document.querySelector('form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter a valid email address');
            return;
        }

        // Store in cookies
        document.cookie = `newsletter_subscribed=true; max-age=${60 * 60 * 24 * 30}; path=/`;
        document.cookie = `newsletter_email=${encodeURIComponent(email)}; max-age=${60 * 60 * 24 * 30}; path=/`;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg';
        successMsg.textContent = 'Thanks for subscribing!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
        
        emailInput.value = '';
    });
}

// Handle all buttons
document.addEventListener('click', (e) => {
    // View Review buttons
    if (e.target.closest('a[href="#"]') && e.target.closest('a[href="#"]').textContent.includes('View Review')) {
        e.preventDefault();
        alert('This would navigate to a detailed product review page in a real implementation.');
    }
    
    // How We Review button
    if (e.target.closest('a[href="#how-we-review"]')) {
        e.preventDefault();
        document.getElementById('how-we-review').scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // Shop Now button
    if (e.target.closest('a[href="#featured"]')) {
        e.preventDefault();
        document.getElementById('featured').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Check for existing newsletter subscription
window.addEventListener('DOMContentLoaded', () => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const newsletterSubscribed = cookies.some(c => c.startsWith('newsletter_subscribed=true'));
    
    if (newsletterSubscribed) {
        const email = cookies.find(c => c.startsWith('newsletter_email='))?.split('=')[1];
        if (email) {
            const form = document.querySelector('form');
            if (form) {
                const input = form.querySelector('input[type="email"]');
                input.value = decodeURIComponent(email);
                input.disabled = true;
                
                const button = form.querySelector('button[type="submit"]');
                button.textContent = 'Subscribed!';
                button.disabled = true;
                button.classList.remove('hover:bg-gray-100');
                button.classList.add('bg-gray-300', 'cursor-not-allowed');
            }
        }
    }
});
