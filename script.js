// Expanded Demo Data for Active Debtors
const debtors = [
    { id: 1, name: "JOHN DOE", vehicle: "1231 PHRS CAR", due: "05/19/2026", status: "Delinquent", risk: 78, stability: "Poor", balance: "$240", habits: "Multiple NSF Fees", selfie: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "JANA RUTH", vehicle: "1225 NORT-HBONEE", due: "05/29/2026", status: "Current", risk: 15, stability: "Excellent", balance: "$3,150", habits: "None", selfie: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "ALEX GRGAN", vehicle: "1220 BNRS CAR", due: "05/28/2026", status: "Current", risk: 45, stability: "Fair", balance: "$980", habits: "High discretionary", selfie: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "SARAH JENKINS", vehicle: "2019 FORD F-150", due: "05/15/2026", status: "Delinquent", risk: 82, stability: "Unstable", balance: "$45", habits: "Overdraft history", selfie: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "MICHAEL CHEN", vehicle: "2021 TOYOTA CAMRY", due: "06/02/2026", status: "Current", risk: 10, stability: "Excellent", balance: "$5,420", habits: "Consistent savings", selfie: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "MARIA GARCIA", vehicle: "2018 CHEVY EQUINOX", due: "05/22/2026", status: "Current", risk: 30, stability: "Good", balance: "$1,100", habits: "Regular utility payments", selfie: "https://i.pravatar.cc/150?u=6" }
];

// Expanded Demo Data for Payment Tracker
const payments = [
    { date: "2026-05-01", name: "JOHN DOE", amount: "$400", method: "Cash", status: "Current" },
    { date: "2026-05-15", name: "JANA RUTH", amount: "$400", method: "ACH", status: "Current" },
    { date: "2026-05-10", name: "JOHN DOE", amount: "$0", method: "N/A", status: "Delinquent" },
    { date: "2026-05-12", name: "SARAH JENKINS", amount: "$0", method: "N/A", status: "Delinquent" },
    { date: "2026-05-20", name: "ALEX GRGAN", amount: "$350", method: "Debit", status: "Current" },
    { date: "2026-05-21", name: "MICHAEL CHEN", amount: "$500", method: "ACH", status: "Current" },
    { date: "2026-05-22", name: "MARIA GARCIA", amount: "$300", method: "Cash", status: "Current" },
    { date: "2026-04-15", name: "SARAH JENKINS", amount: "$450", method: "Debit", status: "Current" }
];

function init() {
    renderDebtorsList(debtors);
    renderHistory();
    // Default select the first record
    if(debtors.length > 0) selectDebtor(debtors[0].id);
}

function renderDebtorsList(list) {
    const body = document.getElementById('debtorBody');
    body.innerHTML = list.map(d => `
        <tr onclick="selectDebtor(${d.id})" id="row-${d.id}">
            <td>${d.id}</td>
            <td><img src="${d.selfie}" width="30" height="30" style="border-radius:50%"></td>
            <td><strong>${d.name}</strong><br><small>${d.vehicle}</small></td>
            <td>${d.due}</td>
            <td><span class="status-tag ${d.status.toLowerCase()}">${d.status.toUpperCase()}</span></td>
            <td>
                <label class="switch" onclick="event.stopPropagation();">
                    <input type="checkbox" ${d.status === 'Delinquent' ? 'checked' : ''} onchange="toggleLockdown(${d.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td><button class="ghost-btn" onclick="event.stopPropagation(); viewDebtorHistory('${d.name}')">VIEW</button></td>
            <td><button class="ghost-btn">LOG</button> <button class="ghost-btn">LINK</button></td>
        </tr>
    `).join('');
}

function selectDebtor(id) {
    const d = debtors.find(x => x.id === id);
    if (!d) return;

    document.querySelectorAll('tr').forEach(r => r.style.background = 'transparent');
    const selectedRow = document.getElementById(`row-${id}`);
    if(selectedRow) selectedRow.style.background = '#f1f5f9';

    document.getElementById('detailSelfie').src = d.selfie;
    document.getElementById('riskValue').innerText = d.risk;
    document.getElementById('incomeStability').innerText = d.stability;
    document.getElementById('avgBalance').innerText = d.balance;
    document.getElementById('flaggedHabits').innerText = d.habits;
    
    // Needle logic: 100% Risk = -90deg, 0% Risk = 90deg
    const angle = -90 + ((100 - d.risk) * 1.8);
    document.getElementById('riskNeedle').style.transform = `rotate(${angle}deg)`;

    const statusTxt = document.getElementById('overallStatusText');
    statusTxt.innerText = d.status === 'Delinquent' ? "RED (DELINQUENT)" : "GREEN (VERIFIED)";
    statusTxt.className = d.status === 'Delinquent' ? "red-text" : "v-green";
}

function filterDebtors() {
    const q = document.getElementById('dashSearch').value.toLowerCase();
    renderDebtorsList(debtors.filter(d => d.name.toLowerCase().includes(q) || d.id.toString().includes(q)));
}

function toggleLockdown(id, isChecked) {
    const d = debtors.find(x => x.id === id);
    if (d) { 
        d.status = isChecked ? 'Delinquent' : 'Current'; 
        renderDebtorsList(debtors); 
        selectDebtor(id); 
    }
}

function showPage(pId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pId).classList.add('active');
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${pId}`).classList.add('active');
}

function viewDebtorHistory(name) {
    showPage('history');
    document.getElementById('histSearch').value = name;
    filterHistory();
}

function renderHistory() {
    const q = document.getElementById('histSearch').value.toLowerCase();
    const s = document.getElementById('statusFilter').value;
    const filtered = payments.filter(p => 
        p.name.toLowerCase().includes(q) && (s === 'all' || p.status === s)
    );
    document.getElementById('historyBody').innerHTML = filtered.map(p => `
        <tr>
            <td>${p.date}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.amount}</td>
            <td>${p.method}</td>
            <td><span class="status-tag ${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
    `).join('');
}

function filterHistory() { renderHistory(); }
window.onload = init;
