async function handleDonorSignUp() {
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const { data, error } = await _supabase.auth.signUp({ email, password: pass, options: { data: { role: 'donor' } } });
    if (error) return alert(error.message);
    await _supabase.from('donors').insert([{
        id: data.user.id,
        full_name: document.getElementById('regUser').value,
        blood_group: document.getElementById('regBlood').value,
        phone: document.getElementById('regPhone').value,
        location: document.getElementById('regLoc').value
    }]);
    alert("Donor Registered!");
}

async function handleHospitalSignUp() {
    const email = document.getElementById('hospEmail').value;
    const pass = document.getElementById('hospPass').value;
    const { data, error } = await _supabase.auth.signUp({ email, password: pass, options: { data: { role: 'hospital' } } });
    if (error) return alert(error.message);
    await _supabase.from('hospitals').insert([{
        id: data.user.id,
        name: document.getElementById('hospName').value,
        address: document.getElementById('hospAddress').value
    }]);
    alert("Hospital Registered!");
}

async function handleLogin() {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: document.getElementById('logEmail').value,
        password: document.getElementById('logPass').value
    });
    if (error) alert(error.message);
    else location.reload();
}

async function checkSession() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('profile-view').style.display = 'block';
        const { data: donor } = await _supabase.from('donors').select('*').eq('id', user.id).single();
        if (donor) {
            document.getElementById('prof-name').innerText = donor.full_name;
            document.getElementById('prof-count').innerText = donor.donation_count;
            const rank = getRankData(donor.donation_count);
            document.getElementById('rank-badge').innerText = rank.label;
            document.getElementById('rank-badge').className = `rank-tag ${rank.class}`;
        } else {
            document.getElementById('prof-name').innerText = "Hospital Admin";
        }
    }
}

async function handleLogout() { await _supabase.auth.signOut(); location.reload(); }