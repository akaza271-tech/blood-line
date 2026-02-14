// Leaderboard
async function fetchLeaderboard() {
    const { data } = await _supabase.from('donors').select('full_name, donation_count').order('donation_count', { ascending: false }).limit(5);
    const list = document.getElementById('leaderboard-list');
    if (data) list.innerHTML = data.map(d => `<div class="leader-row"><b>${d.full_name}</b> <span>${d.donation_count} Units</span></div>`).join('');
}

// Search
async function searchDonors() {
    const blood = document.getElementById('searchBlood').value;
    const { data } = await _supabase.from('donors').select('*').eq('blood_group', blood);
    const res = document.getElementById('search-results');
    res.innerHTML = data.length ? data.map(d => `
        <div class="card" style="border-left: 4px solid var(--brand); margin-bottom:10px;">
            <b>${d.full_name}</b> (${d.location}) <br> <small>📞 ${d.phone}</small> <br>
            <button class="btn-outline" style="padding:4px; font-size:12px; margin-top:5px;" onclick="logDonation('${d.id}')">Verify Donation</button>
        </div>`).join('') : "<p>No donors found.</p>";
}

// Verify Donation (Rank Up)
async function logDonation(donorId) {
    const { data: donor } = await _supabase.from('donors').select('donation_count').eq('id', donorId).single();
    await _supabase.from('donors').update({ donation_count: (donor.donation_count || 0) + 1 }).eq('id', donorId);
    alert("Donation verified! Hero ranked up.");
    searchDonors();
}

// Emergency Alert
async function sendEmergencyAlert() {
    const blood = document.getElementById('alertBlood').value;
    const { data: { user } } = await _supabase.auth.getUser();
    await _supabase.from('alerts').insert([{ hospital_id: user.id, blood_needed: blood }]);
    alert("🚨 Emergency alert broadcasted!");
    fetchAlerts();
}

async function fetchAlerts() {
    const { data } = await _supabase.from('alerts').select('*, hospitals(name)').order('created_at', { ascending: false }).limit(3);
    const div = document.getElementById('active-alerts');
    if (data && data.length) div.innerHTML = data.map(a => `<div class="rank-tag rank-bronze" style="display:block; margin-bottom:5px;">🚨 ${a.blood_needed} needed at ${a.hospitals?.name}</div>`).join('');
}

function getRankData(count) {
    if (count >= 10) return { label: "Diamond Hero", class: "rank-diamond" };
    if (count >= 5) return { label: "Gold Savior", class: "rank-gold" };
    return { label: "Bronze Donor", class: "rank-bronze" };
}