const supabase = createClient('https://oypgqdlypqpvbdhvvgaa.supabase.co/rest/v1/','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cGdxZGx5cHFwdmJkaHZ2Z2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NDkwMzksImV4cCI6MjA5OTAyNTAzOX0.XBqbsgprrbxSwsg5w_cy_OIUPmTnKRXUw_ToWrEatb8'); );

const params = new URLSearchParams(window.location.search);
const customerId = params.get('id') || 'dr-ahmed';

async function loadCard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error || !data) {
    document.getElementById('cardContainer').innerHTML = '<h2>Card not found</h2>';
    return;
  }
  renderCard(data);
}

function renderCard(c) {
  const container = document.getElementById('cardContainer');
  container.style.setProperty('--primary', c.theme_color || '#1a73e8');

  // Build social links if available
  let socialHTML = '';
  const icons = { linkedin: 'fab fa-linkedin-in', twitter: 'fab fa-twitter', instagram: 'fab fa-instagram', dribbble: 'fab fa-dribbble' };
  if (c.social) {
    Object.keys(c.social).forEach(key => {
      if (icons[key]) socialHTML += `<a href="${c.social[key]}" target="_blank" class="social-link"><i class="${icons[key]}"></i></a>`;
    });
  }

  container.innerHTML = `
    <div class="profession-badge">${c.profession || 'Professional'}</div>
    <img class="avatar" src="${c.avatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(c.name)+'&background='+c.theme_color.replace('#','')+'&color=fff'}" />
    <h1 class="name">${c.name}</h1>
    <p class="title">${c.title}</p>
    <p class="company"><i class="fas fa-building" style="color:var(--primary);"></i> ${c.company}</p>
    <div class="contact-grid">
      <a class="contact-item" href="tel:${c.phone}"><i class="fas fa-phone-alt"></i> ${c.phone}</a>
      <a class="contact-item" href="mailto:${c.email}"><i class="fas fa-envelope"></i> ${c.email}</a>
      ${c.website ? `<a class="contact-item" href="${c.website}" target="_blank"><i class="fas fa-globe"></i> ${c.website}</a>` : ''}
    </div>
    <div class="action-row">
      <button class="action-btn" onclick="downloadVCard('${c.id}')"><i class="fas fa-address-card"></i> Save Contact</button>
      <button class="action-btn secondary" onclick="shareCard()"><i class="fas fa-share-alt"></i> Share</button>
    </div>
    ${socialHTML ? `<div class="social-row">${socialHTML}</div>` : ''}
    <div class="qr-section">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}" />
      <p style="font-size:12px;color:#8a9aaa;">Scan to view</p>
    </div>
  `;
}

// (Keep the downloadVCard and shareCard functions from previous version here)
async function downloadVCard(id) { /* same as before but fetch from Supabase */ }
function shareCard() { /* same */ }

loadCard();
