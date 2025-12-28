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
// Simple renderer — expects assets/data/affiliates.json (relative path)
// Use relative paths so it works on GitHub Pages under repo subpaths

async function loadAffiliates() {
  const grid = document.getElementById('affiliates-grid');
  if (!grid) return;
  try {
    const res = await fetch('assets/data/affiliates.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load affiliate data');
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error('Invalid affiliates.json');

    grid.innerHTML = items.map(renderCard).join('');
    attachHandlers();
  } catch (err) {
    console.error('Affiliates error:', err);
    grid.innerHTML = '<p>Unable to load offers right now.</p>';
  }
}

function renderCard(p) {
  const imgStyle = p.image ? `style="background-image: url('${escapeAttr(p.image)}')" aria-hidden="true"` : '';
  const priceHtml = p.price ? `<span class="price">${escapeHtml(p.price)}</span>` : '';
  const store = p.store ? `<span class="store-badge">${escapeHtml(p.store)}</span>` : '';
  const button = p.affiliate_url
    ? `<a class="buy-btn" data-affiliate data-id="${escapeHtml(p.id)}" href="${escapeAttr(p.affiliate_url)}" target="_blank" rel="noopener sponsored">Buy</a>`
    : `<button class="buy-btn" disabled>Link missing</button>`;

  return `
    <article class="aff-card" aria-labelledby="aff-${escapeHtml(p.id)}">
      <div class="thumb" ${imgStyle}></div>
      <div class="info">
        <h3 id="aff-${escapeHtml(p.id)}" class="title">${escapeHtml(p.title)}</h3>
        <div class="meta">${store} ${priceHtml}</div>
        <div class="actions">
          ${button}
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function attachHandlers() {
  // Hook for tracking; add analytics calls here if needed
  const anchors = document.querySelectorAll('a[data-affiliate]');
  anchors.forEach(a => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('data-id') || '';
      // Example: send analytics event
      // if (window.gtag) gtag('event', 'click', {event_category: 'affiliate', event_label: id});
    });
  });
}

document.addEventListener('DOMContentLoaded', loadAffiliates);
// Put this at assets/js/affiliates.js
async function loadAffiliates() {
  const grid = document.getElementById('affiliates-grid');
  if (!grid) return;
  try {
    const res = await fetch('assets/data/affiliates.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load affiliate data');
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error('Invalid affiliates.json');

    grid.innerHTML = items.map(renderCard).join('');
    attachHandlers();
  } catch (err) {
    console.error('Affiliates error:', err);
    grid.innerHTML = '<p>Unable to load offers right now.</p>';
  }
}

function renderCard(p) {
  const imgStyle = p.image ? `style="background-image: url('${escapeAttr(p.image)}')" aria-hidden="true"` : '';
  const priceHtml = p.price ? `<span class="price">${escapeHtml(p.price)}</span>` : '';
  const store = p.store ? `<span class="store-badge">${escapeHtml(p.store)}</span>` : '';
  const button = p.affiliate_url
    ? `<a class="buy-btn" data-affiliate data-id="${escapeHtml(p.id)}" href="${escapeAttr(p.affiliate_url)}" target="_blank" rel="noopener sponsored">Buy</a>`
    : `<button class="buy-btn" disabled>Link missing</button>`;

  return `
    <article class="aff-card" aria-labelledby="aff-${escapeHtml(p.id)}">
      <div class="thumb" ${imgStyle}></div>
      <div class="info">
        <h3 id="aff-${escapeHtml(p.id)}" class="title">${escapeHtml(p.title)}</h3>
        <div class="meta">${store} ${priceHtml}</div>
        <div class="actions">${button}</div>
      </div>
    </article>
  `;
}

function escapeHtml(s) { if (s === null || s === undefined) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(s) { if (s === null || s === undefined) return ''; return String(s).replace(/"/g,'&quot;').replace(/'/g,"&#39;"); }

function attachHandlers() {
  const anchors = document.querySelectorAll('a[data-affiliate]');
  anchors.forEach(a => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('data-id') || '';
      // Optional analytics hook:
      // if (window.gtag) gtag('event', 'click', {event_category: 'affiliate', event_label: id});
    });
  });
}

document.addEventListener('DOMContentLoaded', loadAffiliates);
