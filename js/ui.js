function switchPane(id, el) {
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
}

window.onload = () => {
    checkSession();
    fetchLeaderboard();
    fetchAlerts();
    // Update simple count stats
    _supabase.from('donors').select('*', { count: 'exact', head: true }).then(r => document.getElementById('stat-donors').innerText = r.count);
    _supabase.from('hospitals').select('*', { count: 'exact', head: true }).then(r => document.getElementById('stat-hospitals').innerText = r.count);
};