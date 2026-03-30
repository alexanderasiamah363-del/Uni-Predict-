function nextStep(current) {
    document.getElementById('step' + current).classList.remove('active');
    document.getElementById('step' + (current + 1)).classList.add('active');
    document.getElementById('dot' + (current + 1)).classList.add('active');
}

function updateTheme() {
    const uni = document.getElementById('uniSelect').value;
    document.body.className = uni === 'KNUST' ? 'bg-knust' : 'bg-ug';
}

function runPrediction() {
    nextStep(1); // Move to results step
    
    // 1. Calculate Aggregate (4 Cores + Best 3 Electives)
    const cores = [
        parseInt(document.getElementById('eng').value),
        parseInt(document.getElementById('math').value),
        parseInt(document.getElementById('sci').value),
        parseInt(document.getElementById('soc').value)
    ];
    const electives = [
        parseInt(document.getElementById('el1').value),
        parseInt(document.getElementById('el2').value),
        parseInt(document.getElementById('el3').value)
    ].sort((a,b) => a - b);

    const aggregate = cores.reduce((a,b) => a+b, 0) + electives.reduce((a,b) => a+b, 0);

    // 2. Show Loader for 1.5s
    setTimeout(() => {
        document.getElementById('results-loader').style.display = 'none';
        document.getElementById('results-content').classList.remove('display-none');
        showMatches(aggregate);
    }, 1500);
}

function showMatches(agg) {
    const uniKey = document.getElementById('uniSelect').value;
    const programs = universityDB[uniKey].programs;
    const list = document.getElementById('program-list');
    
    document.getElementById('result-summary').innerText = `Your Aggregate: ${agg}`;
    list.innerHTML = "";

    programs.forEach(p => {
        const qualified = agg <= p.cutoff;
        list.innerHTML += `
            <div class="glass-card" style="margin-top: 10px; padding: 20px; display: flex; justify-content: space-between;">
                <div>
                    <h4>${p.name}</h4>
                    <small>Cut-off: ${p.cutoff}</small>
                </div>
                <div>
                    <span class="badge-qualify" style="background: ${qualified ? '#22d47a' : '#ff4d6a'}">
                        ${qualified ? '✓ Qualified' : 'X Below Cut-off'}
                    </span>
                </div>
            </div>
        `;
    });
}
