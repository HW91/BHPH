const debtors = [
    { id: 1, name: "JOHN DOE", vehicle: "1231 PHRS CAR", due: "07/19/2023", status: "Delinquent", risk: 78, stability: 32, selfie: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "JANA RUTH", vehicle: "1225 NORT-HBONEE", due: "01/29/2023", status: "Current", risk: 20, stability: 85, selfie: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "ALEX GRGAN", vehicle: "1220 BNRS CAR", due: "07/28/2023", status: "Current", risk: 45, stability: 50, selfie: "https://i.pravatar.cc/150?u=3" }
];

const payments = [
    { date: "2023-07-01", name: "JOHN DOE", amount: "$400", method: "Cash", status: "Current" },
    { date: "2023-06-15", name: "JANA RUTH", amount: "$400", method: "ACH", status: "Current" },
    { date: "2023-07-10", name: "JOHN DOE", amount: "$0", method: "N/A", status: "Delinquent" }
];

function init() {
    renderDebtors();
    renderHistory();
}

function renderDebtors() {
    const body = document.getElementById('debtorBody');
    body.innerHTML = debtors.map(d => `
        <tr onclick="selectDebtor(${d.id})" style="cursor:pointer">
            <td>${d.id}</td>
            <td><img src="${d.selfie}" width="30" style="border-radius:50%"></td>
            <td><strong>${d.name}</strong><br><small>${d.vehicle}</small></td>
            <td>${d.due}</td>
            <td><span class="status-tag ${d.status.toLowerCase()}">${d.status.toUpperCase()}</span></td>
            <td><input type="checkbox" ${d.status === 'Delinquent' ? 'checked' : ''}></td>
            <td>
                <button class="ghost-btn">LOG CASH PAYMENT</button>
                <button class="ghost-btn">SEND LINK</button>
            </td>
        </tr>
    `).join('');
}

function selectDebtor(id) {
    const d = debtors.find(x => x.id === id);
    document.getElementById('detailSelfie').src = d.selfie;
    document.getElementById('riskValue').innerText = d.risk;
    document.getElementById('stabilityValue').innerText = d.stability;
    
    // Rotate needles (0 to 180 degrees)
    // Formula: (Value / 100) * 180 - 90 (approximate for SVG)
    document.getElementById('riskNeedle').style.transform = `rotate(${d.risk * 1.8}deg)`;
    document.getElementById('stabilityNeedle').style.transform = `rotate(${d.stability * 1.8}deg)`;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function renderHistory(filter = 'all') {
    const body = document.getElementById('historyBody');
    const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
    body.innerHTML = filtered.map(p => `
        <tr>
            <td>${p.date}</td>
            <td>${p.name}</td>
            <td>${p.amount}</td>
            <td>${p.method}</td>
            <td><span class="status-tag ${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
    `).join('');
}

function filterHistory() {
    const val = document.getElementById('statusFilter').value;
    renderHistory(val);
}

window.onload = init;
                                                                      
