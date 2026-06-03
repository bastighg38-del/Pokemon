// app.js – Vollständige Benutzeroberfläche, API-Ladeprozess, Event-Steuerung, Items + Debug Items + Baum-Debug + Shiny + Legi + Trainer
// Final: Team-Vorschau, Pokéball-Icons (schwarz für besiegt), keine Duplikate, größere Bälle, Trainer-Intro mit Sprites

window.pokemonDetailsMap = new Map();
window.tmPokemonLearners = new Map();
window.tutorLearnersMap = new Map();
window.activeTable = 'pokemon';
window.debugSelectedItem = null;

const trainerSpriteMap = {
    'Ass-Trainer': 'acetrainer',
    'Schönheit': 'beauty',
    'Biker': 'biker',
    'Vogelfänger': 'birdkeeper',
    'Käfersammler': 'bugcatcher',
    'Einbrecher': 'burglar',
    'Medium': 'medium',
    'Rowdy': 'blackbelt',
    'Ingenieur': 'worker',
    'Angler': 'fisherman',
    'Spieler': 'gambler',
    'Gentleman': 'gentleman',
    'Wanderer': 'hiker',
    'Jongleur': 'juggler',
    'Göre': 'lass',
    'Pokémaniac': 'pokemaniac',
    'Psycho': 'psychic',
    'Rocker': 'guitarist',
    'Matrose': 'sailor',
    'Forscher': 'scientist',
    'Streber': 'supernerd',
    'Schwimmer': 'swimmer',
    'Dompteur': 'tamer',
    'Knirps': 'youngster'
};

window.getTrainerSpriteUrl = function(trainerClassName) {
    const spriteName = trainerSpriteMap[trainerClassName];
    return spriteName
        ? `https://play.pokemonshowdown.com/sprites/trainers/${spriteName}.png`
        : '';
};

function updateTrainerSprite() {
    const img = document.getElementById('trainerSpriteImage');
    if (!img || !currentTrainerClass) return;
    img.src = window.getTrainerSpriteUrl(currentTrainerClass);
    img.alt = currentTrainerClass;
}
// Füge dies in app.js ein, direkt nach updateTrainerSprite():

window.showTrainerIntro = function(trainerClass) {
    const spriteUrl = window.getTrainerSpriteUrl(trainerClass);
    const overlay = document.createElement('div');
    overlay.className = 'trainer-intro-overlay';
    overlay.innerHTML = `
        <div class="trainer-intro">
            <img src="${spriteUrl}" class="trainer-intro-sprite" 
                 onerror="this.style.display='none'">
            <h2>${trainerClass} fordert dich heraus!</h2>
            <p>Schick dein Pokémon in den Kampf!</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Nach 1,8 Sekunden ausblenden und entfernen
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 500);
    }, 1800);
};

// --- API-Funktionen (unverändert) ---
async function fetchPokemonMovesAllGens(id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) return { levelMoves: [], tmMoves: [], tutorMoves: [] };
        const data = await res.json();
        const levelMoves = [], tmMoves = [], tutorMoves = [], seenLevel = new Set();
        for (const m of data.moves) {
            const moveId = parseInt(m.move.url.split('/').slice(-2, -1)[0]);
            for (const vgd of m.version_group_details) {
                const vg = vgd.version_group.name;
                if (vg === 'red-blue' || vg === 'yellow' || vg === 'firered-leafgreen') {
                    if (vgd.move_learn_method.name === 'level-up') {
                        if (!seenLevel.has(moveId)) { seenLevel.add(moveId); levelMoves.push({ name: m.move.name.replace(/-/g, ' '), level: vgd.level_learned_at, id: moveId }); }
                    }
                    if (vgd.move_learn_method.name === 'machine') {
                        let tmNumber = vgd.machine ? `TM${vgd.machine.url.split('/').slice(-2, -1)[0].padStart(2, '0')}` : window.fixedTMVM.get(moveId) || null;
                        if (tmNumber && !tmMoves.find(t => t.moveId === moveId)) tmMoves.push({ moveId, tmNumber, moveName: m.move.name.replace(/-/g, ' ') });
                    }
                    if (vg === 'firered-leafgreen' && vgd.move_learn_method.name === 'tutor') {
                        if (!tutorMoves.find(t => t.id === moveId)) tutorMoves.push({ id: moveId, name: m.move.name.replace(/-/g, ' ') });
                    }
                }
            }
        }
        levelMoves.sort((a, b) => a.level - b.level);
        return { levelMoves, tmMoves, tutorMoves };
    } catch (e) { return { levelMoves: [], tmMoves: [], tutorMoves: [] }; }
}

async function fetchEvolutionChain(id) {
    try {
        const spec = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        if (!spec.ok) return null;
        const species = await spec.json();
        const chainRes = await fetch(species.evolution_chain.url);
        const chain = await chainRes.json();
        const list = [];
        function traverse(node, prev = null) {
            const name = node.species.name, pid = parseInt(node.species.url.split('/').slice(-2, -1)[0]);
            let cond = '';
            if (prev && node.evolution_details.length) {
                const d = node.evolution_details[0];
                if (d.min_level) cond = `Level ${d.min_level}`;
                else if (d.item) cond = `mit ${d.item.name.replace(/-/g, ' ')}`;
                else if (d.min_happiness) cond = 'Freundschaft';
                else if (d.trade_species) cond = 'Tausch';
            }
            list.push({ name, id: pid, condition: cond });
            for (const next of node.evolves_to) traverse(next, node);
        }
        traverse(chain.chain);
        return list;
    } catch (e) { return null; }
}

async function loadAllPokemonDetails() {
    const total = allPokemon.length;
    let loaded = 0;
    const div = document.createElement('div');
    div.style.cssText = 'margin:10px; font-size:0.9rem';
    document.querySelector('.button-bar').after(div);
    div.innerHTML = `<i class="fas fa-cloud-download-alt"></i> Lade API-Daten (0/${total}) ...`;
    for (const p of allPokemon) {
        const id = parseInt(p.nr);
        if (!pokemonDetailsMap.has(p.name)) {
            const [movesData, evo] = await Promise.all([fetchPokemonMovesAllGens(id), fetchEvolutionChain(id)]);
            pokemonDetailsMap.set(p.name, { moves: movesData.levelMoves, evolutionChain: evo || [], tms: movesData.tmMoves, tutors: movesData.tutorMoves || [] });
            for (const tm of movesData.tmMoves) {
                if (tm.tmNumber) {
                    if (!tmPokemonLearners.has(tm.moveId)) tmPokemonLearners.set(tm.moveId, []);
                    if (!tmPokemonLearners.get(tm.moveId).find(e => e.name === p.name && e.tmNumber === tm.tmNumber)) tmPokemonLearners.get(tm.moveId).push({ name: p.name, nr: p.nr, tmNumber: tm.tmNumber });
                }
            }
            for (const tut of movesData.tutorMoves) {
                if (!tutorLearnersMap.has(tut.id)) tutorLearnersMap.set(tut.id, []);
                if (!tutorLearnersMap.get(tut.id).find(e => e.name === p.name)) tutorLearnersMap.get(tut.id).push({ name: p.name, nr: p.nr });
            }
        }
        for (const [moveId, data] of Object.entries(window.fireRedTutors)) {
            if (data.learners.includes(p.name)) {
                const mid = parseInt(moveId);
                if (!tutorLearnersMap.has(mid)) tutorLearnersMap.set(mid, []);
                if (!tutorLearnersMap.get(mid).find(e => e.name === p.name)) tutorLearnersMap.get(mid).push({ name: p.name, nr: p.nr });
            }
        }
        loaded++;
        div.innerHTML = `<i class="fas fa-cloud-download-alt"></i> Lade API-Daten (${loaded}/${total}) ...`;
        await new Promise(r => setTimeout(r, 30));
    }
    div.innerHTML = `<i class="fas fa-check-circle"></i> Alle API-Daten geladen!`;
    setTimeout(() => div.remove(), 3000);
    renderPokemonTable(true);
    renderMovesTable();
    renderItemsTable();
    renderDebugItems();
}

window.getAllLearnableMoves = function(pokemonName, level) {
    const details = pokemonDetailsMap.get(pokemonName);
    if (!details) return [getMoveById(165)].filter(m => m);
    const allMovesSet = new Map();
    for (const m of details.moves) { if (m.level <= level) allMovesSet.set(m.id, getMoveById(m.id)); }
    if (details.evolutionChain) {
        const evoChain = details.evolutionChain;
        const currentIndex = evoChain.findIndex(e => e.name.toLowerCase() === pokemonName.toLowerCase());
        for (let i = 0; i < currentIndex; i++) {
            const preEvo = evoChain[i];
            const preDetails = pokemonDetailsMap.get(preEvo.name);
            if (preDetails && preDetails.moves) { for (const m of preDetails.moves) { if (m.level <= level) allMovesSet.set(m.id, getMoveById(m.id)); } }
        }
    }
    if (details.tms) { for (const tm of details.tms) { const move = getMoveById(tm.moveId); if (move) allMovesSet.set(tm.moveId, move); } }
    if (details.tutors) { for (const tut of details.tutors) { const move = getMoveById(tut.id); if (move) allMovesSet.set(tut.id, move); } }
    for (const [moveId, data] of Object.entries(window.fireRedTutors)) { if (data.learners.includes(pokemonName)) { const mid = parseInt(moveId); const move = getMoveById(mid); if (move) allMovesSet.set(mid, move); } }
    if (allMovesSet.size === 0) allMovesSet.set(165, getMoveById(165));
    return Array.from(allMovesSet.values()).filter(m => m);
};

// --- Tabellen-Rendering (unverändert) ---
function renderPokemonTable(withButtons = false) {
    const tbody = document.getElementById('pokemonTableBody');
    tbody.innerHTML = '';
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    let data = term ? allPokemon.filter(p => p.name.toLowerCase().includes(term) || p.nr.includes(term) || p.types.some(t => t.toLowerCase().includes(term))) : allPokemon;
    for (const p of data) {
        const row = tbody.insertRow(); row.classList.add('pokemon-row'); row.dataset.pokemonName = p.name;
        const badges = p.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join('');
        const detailBtn = withButtons ? `<button class="detail-btn" data-name="${p.name}"><i class="fas fa-info-circle"></i> Details</button>` : '<span style="color:#888;">lädt...</span>';
        const battleBtn = `<button class="battle-btn" data-name="${p.name}"><i class="fas fa-crosshairs"></i> Kampf!</button>`;
        const spdDisplay = p.spd !== undefined ? p.spd : '?';
        row.innerHTML = `<td>${p.nr}</td><td class="pokemon-name"><img class="pokemon-sprite" src="${getNormalGifUrl(p.nr)}" onerror="this.src='${getNormalGifUrl(p.nr)}'"> ${p.name}</td><td><div class="type-badges">${badges}</div></td><td>${p.hp}</td><td>${p.atk}</td><td>${p.def}</td><td>${p.spa}</td><td>${spdDisplay}</td><td>${p.spe}</td><td>${p.sum}</td><td>${detailBtn} ${battleBtn}</td>`;
    }
    if (withButtons) {
        document.querySelectorAll('.detail-btn').forEach(btn => btn.addEventListener('click', (e) => handleDetailClick(e.currentTarget.getAttribute('data-name'))));
        document.querySelectorAll('.battle-btn').forEach(btn => btn.addEventListener('click', (e) => startBattle(e.currentTarget.getAttribute('data-name'))));
    }
}

function renderMovesTable() {
    const tbody = document.getElementById('movesTableBody');
    tbody.innerHTML = '';
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    let data = term ? allMoves.filter(m => (m.Name || '').toLowerCase().includes(term) || (m.ID || '').includes(term) || (m.Typ || '').toLowerCase().includes(term) || (m.Kategorie || '').toLowerCase().includes(term)) : allMoves;
    for (const m of data) {
        const row = tbody.insertRow(); row.classList.add('move-row'); row.setAttribute('data-move-id', m.ID); row.setAttribute('data-move-name', m.Name);
        let catIcon = ''; const cat = (m.Kategorie || '').toLowerCase();
        if (cat === 'physisch') catIcon = '<i class="fas fa-fist-raised" style="color:#d9534f; margin-right:4px;"></i>';
        else if (cat === 'spezial') catIcon = '<i class="fas fa-magic" style="color:#5bc0de; margin-right:4px;"></i>';
        else if (cat === 'status') catIcon = '<i class="fas fa-shield-alt" style="color:#5cb85c; margin-right:4px;"></i>';
        const moveIdNum = parseInt(m.ID);
        let tmValue = window.fixedTMVM.get(moveIdNum) || '';
        let badgeClass = tmValue.startsWith('VM') ? 'vm-badge' : 'tm-badge';
        const tmHtml = tmValue ? `<span class="${badgeClass}">${tmValue}</span>` : '—';
        const prioDisplay = (m.Priorität || 0) !== 0 ? `<span style="color:${m.Priorität > 0 ? '#5bc0de' : '#e74c3c'}">${m.Priorität > 0 ? '+' + m.Priorität : m.Priorität}</span>` : '0';
        row.innerHTML = `<td>${m.ID || '-'}</td><td style="text-align:left">${m.Name || '-'}</td><td><span class="type-badge ${getTypeClass(m.Typ)}">${m.Typ || '-'}</span></td><td>${catIcon} ${m.Kategorie || '-'}</td><td>${m.Stärke ?? '-'}</td><td>${getAccuracyForMove(m)}</td><td>${m.AP ?? '-'}</td><td>${prioDisplay}</td><td>${tmHtml}</td><td class="move-desc">${getMoveDescription(m)}</td>`;
    }
}

function renderItemsTable() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = '';
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    let data = term ? allItems.filter(i => i.name.toLowerCase().includes(term) || i.category.toLowerCase().includes(term) || i.desc.toLowerCase().includes(term)) : allItems;
    for (const item of data) {
        const row = tbody.insertRow(); row.classList.add('item-row');
        const spriteUrl = getItemSpriteUrl(item.name);
        row.innerHTML = `<td><img class="item-sprite" src="${spriteUrl}" onerror="this.style.display='none'" alt="${item.name}"></td><td class="item-name">${item.name}</td><td>${item.category}</td><td style="text-align:left;">${item.desc}</td>`;
    }
}

// --- Debug Items (unverändert) ---
function renderDebugItems() {
    const container = document.getElementById('debugItemsGrid');
    const msgDiv = document.getElementById('debugSelectionMessage');
    container.innerHTML = '';
    msgDiv.textContent = '';
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, 3);
    window.debugSelectedItem = null;

    selectedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'debug-item-card';
        const spriteUrl = getItemSpriteUrl(item.name);
        const shortName = item.name.replace(/\(.*\)/, '').trim();
        card.innerHTML = `
            <div class="item-icon"><img src="${spriteUrl}" alt="${shortName}" onerror="this.style.display='none'"></div>
            <div class="item-name" title="${shortName}">${shortName}</div>
            <div class="item-category">${item.category}</div>
            <div class="item-desc">${item.desc}</div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.debug-item-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            window.debugSelectedItem = item;
            
            const ballNames = ['Pokéball', 'Superball', 'Hyperball'];
            if (ballNames.includes(item.name)) {
                msgDiv.textContent = `✨ Du hast 10x ${shortName} erhalten!`;
            } else {
                msgDiv.textContent = `✨ Du hast gewählt: ${shortName}`;
            }
        });
        container.appendChild(card);
    });
}

// --- Detail-Modal (unverändert) ---
async function handleDetailClick(name) {
    const d = pokemonDetailsMap.get(name); if (!d) { alert('Details werden noch geladen.'); return; }
    const base = allPokemon.find(p => p.name === name); if (!base) return;
    const modal = document.getElementById('pokemonModal'), content = document.getElementById('modalDynamicContent');
    content.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Lade ...</div>';
    modal.style.display = 'block';
    const hdGif = getPokemonImageUrl(base.nr);
    const evoChain = d.evolutionChain || [], moves = d.moves || [], tms = d.tms || [], tutors = d.tutors || [];
    let evoHtml = `<div class="modal-evo"><h3>🔗 Entwicklung</h3><div class="evo-chain">`;
    if (evoChain.length) { evoChain.forEach((evo, idx) => { evoHtml += `<div class="evo-step"><img src="${getPokemonImageUrl(evo.id.toString().padStart(4, '0'))}" width="70"><div><strong>${evo.name}</strong></div>${evo.condition ? `<div class="evo-condition">${evo.condition}</div>` : ''}</div>`; if (idx < evoChain.length - 1) evoHtml += '<div class="evo-arrow">→</div>'; }); }
    else evoHtml += '<div class="evo-step">Keine Daten</div>';
    evoHtml += '</div></div>';
    let movesHtml = `<div class="modal-moves"><h3>⚔️ Level-Up Attacken</h3>${moves.length ? `<table class="moves-table"><thead><tr><th>Level</th><th>Attacke</th><th>Beschreibung</th></tr></thead><tbody>${moves.map(m => { const mv = getMoveById(m.id); return `<tr><td>${m.level}</td><td style="text-align:left">${mv?.Name || m.name}</td><td class="move-desc">${mv ? getMoveDescription(mv) : ''}</td></tr>`; }).join('')}</tbody></table>` : '<p>Keine Level‑Up Attacken gefunden.</p>'}</div>`;
    let tmsHtml = `<div class="modal-tms"><h3>📀 TMs/VM</h3>${tms.length ? `<table class="tms-table"><thead><tr><th>TM/VM</th><th>Attacke</th><th>Beschreibung</th></tr></thead><tbody>${tms.map(t => { const mv = getMoveById(t.moveId); return `<tr><td>${t.tmNumber}</td><td style="text-align:left">${mv?.Name || t.moveName}</td><td class="move-desc">${mv ? getMoveDescription(mv) : ''}</td></tr>`; }).join('')}</tbody></table>` : '<p>Keine TM/VM‑Daten vorhanden.</p>'}</div>`;
    let tutorHtml = `<div class="modal-tms"><h3>🎓 Attackenlehrer (Feuerrot)</h3>`;
    const allTutors = [...tutors];
    for (const [moveId, data] of Object.entries(window.fireRedTutors)) { if (data.learners.includes(name) && !allTutors.find(t => t.id === parseInt(moveId))) allTutors.push({ id: parseInt(moveId), name: data.name }); }
    tutorHtml += allTutors.length ? `<table class="tms-table"><thead><tr><th>Attacke</th><th>Beschreibung</th></tr></thead><tbody>${allTutors.map(t => { const mv = getMoveById(t.id); return `<tr><td style="text-align:left">${mv?.Name || t.name}</td><td class="move-desc">${mv ? getMoveDescription(mv) : ''}</td></tr>`; }).join('')}</tbody></table>` : '<p>Keine Attackenlehrer-Daten.</p>';
    tutorHtml += '</div>';
    content.innerHTML = `<div style="text-align:center;"><div class="modal-artwork"><img src="${hdGif}" alt="${base.name}"></div><h2>${base.name} #${base.nr}</h2><div>${base.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join(' ')}</div></div>${evoHtml}${movesHtml}${tmsHtml}${tutorHtml}`;
}

// --- Kampf-Start (mit Trainer-Intro) ---
function startBattle(playerPokemonName, enemyTeamOrName = null, isShiny = false, trainerClassName = null) {
    const playerPoke = allPokemon.find(p => p.name === playerPokemonName);
    if (!playerPoke) return;

    let enemyTeam = [];
    if (Array.isArray(enemyTeamOrName)) {
        // Trainer-Team
        enemyTeam = enemyTeamOrName.map(name => {
            const poke = allPokemon.find(p => p.name === name);
            if (!poke) return null;
            return { ...poke, isShiny: isShiny };
        }).filter(Boolean);
    } else {
        // Einzelner Gegner
        let enemyPoke;
        if (enemyTeamOrName) {
            enemyPoke = allPokemon.find(p => p.name === enemyTeamOrName);
        } else {
            const possibleEnemies = allPokemon.filter(p => p.name !== playerPokemonName);
            enemyPoke = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
        }
        if (enemyPoke) enemyTeam = [enemyPoke];
    }

    if (enemyTeam.length === 0) return;

    const playerLevel = parseInt(document.getElementById('playerLevelSlider').value);
    const enemyLevel = parseInt(document.getElementById('enemyLevelSlider').value);
    const playerStats = getStatsForLevel(playerPoke, playerLevel);

    const playerMoves = getAllLearnableMoves(playerPoke.name, playerLevel).slice(0, 4);
    while (playerMoves.length < 4) playerMoves.push(getMoveById(165));

    const enemyTeamStats = enemyTeam.map(poke => {
        const stats = getStatsForLevel(poke, enemyLevel);
        const moves = getAllLearnableMoves(poke.name, enemyLevel).slice(0, 4);
        while (moves.length < 4) moves.push(getMoveById(165));
        return {
            ...poke,
            ...stats,
            currentHp: stats.hp,
            maxHp: stats.hp,
            moves: moves,
            level: enemyLevel,
            status: null,
            boosts: { atk: 0, def: 0, spe: 0, spez: 0 },
            movePP: moves.map(m => m.AP || 0),
            confusion: false, confusionTurns: 0,
            leechSeed: null, bind: null,
            substituteHP: 0, substituteMaxHP: 0,
            mistActive: false, mistTurns: 0,
            disabledMoveIndex: -1, disabledTurns: 0,
            lastUsedMoveIndex: -1, lastUsedMove: null,
            criticalUp: false,
            isProtected: false, protectSuccessive: false, protectCount: 0,
            flinch: false,
            item: null,
            isShiny: isShiny || false
        };
    });

    battleState = {
        player: {
            ...playerPoke, ...playerStats,
            currentHp: playerStats.hp, maxHp: playerStats.hp,
            moves: playerMoves, level: playerLevel,
            status: null, boosts: { atk: 0, def: 0, spe: 0, spez: 0 },
            movePP: playerMoves.map(m => m.AP || 0),
            confusion: false, confusionTurns: 0,
            leechSeed: null, bind: null,
            substituteHP: 0, substituteMaxHP: 0,
            mistActive: false, mistTurns: 0,
            disabledMoveIndex: -1, disabledTurns: 0,
            lastUsedMoveIndex: -1, lastUsedMove: null,
            criticalUp: false,
            isProtected: false, protectSuccessive: false, protectCount: 0,
            flinch: false,
            item: null
        },
        enemy: enemyTeamStats[0],
        enemyTeam: enemyTeamStats,
        enemyIndex: 0,
        playerSide: { lightScreen: 0, reflect: 0 },
        enemySide: { lightScreen: 0, reflect: 0 },
        weather: null,
        isPlayerTurn: true,
        battleOver: false,
        _metronomeUser: null, _metronomeTarget: null,
        _pendingPlayerAction: null
    };
    renderBattleUI();
    
    // Trainer-Intro anzeigen, wenn eine Trainerklasse übergeben wurde
    if (trainerClassName) {
        window.showTrainerIntro(trainerClassName);
    }
    
    document.getElementById('battleOverlay').classList.add('active');
    addBattleLog('🎮', `${playerPoke.name} (Lv.${playerLevel}) fordert Trainer mit ${enemyTeamStats.length} Pokémon heraus!`);
    // Team-Vorschau mit Bällen (alle farbig)
    document.getElementById('enemyPartyDisplay').innerHTML = window.getTeamBallDisplay(enemyTeamStats.length, 0);
}

// --- Kampf-UI-Rendering ---
window.renderBattleUI = function() {
    if (!battleState) return;
    const { player, enemy } = battleState;
    document.getElementById('battlePlayerName').textContent = `${player.name} Lv.${player.level}`;
    document.getElementById('battlePlayerImg').src = getPokemonImageUrl(player.nr);
    document.getElementById('battlePlayerTypes').innerHTML = player.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join('');
    document.getElementById('battleEnemyName').textContent = `${enemy.name} Lv.${enemy.level}`;
    document.getElementById('battleEnemyImg').src = enemy.isShiny ? getShinyImageUrl(enemy.nr) : getPokemonImageUrl(enemy.nr);
    document.getElementById('battleEnemyTypes').innerHTML = enemy.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join('');
    updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', player.currentHp, player.maxHp);
    updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', enemy.currentHp, enemy.maxHp);
    updateSubstituteBar(player); updateSubstituteBar(enemy);
    updateItemDisplay('playerItemDisplay', player);
    updateItemDisplay('enemyItemDisplay', enemy);
    document.getElementById('battleResult').style.display = 'none';
    updateWeatherDisplay(); updateStatusIcons(); updateBoostDisplay(); updateAccuracyInfo(); updateCritInfo(); updateSeedIndicators();

    // Gegner-Team-Anzeige mit schwarzen Bällen für besiegte
    if (battleState.enemyTeam && battleState.enemyTeam.length > 1) {
        document.getElementById('enemyPartyDisplay').innerHTML = window.getTeamBallDisplay(
            battleState.enemyTeam.length,
            battleState.enemyIndex
        );
    } else {
        document.getElementById('enemyPartyDisplay').textContent = '';
    }

    renderMoveButtons();
};

window.renderMoveButtons = function() {
    const container = document.getElementById('battleMoveButtons');
    if (!battleState || battleState.battleOver) { container.innerHTML = ''; return; }
    const enemy = battleState.enemy;
    container.innerHTML = battleState.player.moves.map((m, i) => {
        const isDisabledByEffect = battleState.player.disabledMoveIndex === i && battleState.player.disabledTurns > 0;
        const currentPP = battleState.player.movePP[i], maxPP = m.AP || 0, disabled = currentPP <= 0 || isDisabledByEffect;
        const powerDisp = m.Stärke === 'K.O.' ? 'K.O.' : (typeof m.Stärke === 'string' ? 'Var.' : m.Stärke ?? '—');
        const accuracyDisp = getAccuracyForMove(m);
        const effectiveness = getTypeMultiplier(m.Typ, enemy.types);
        const moveDesc = getMoveDescription(m);
        let effText = '', effClass = '';
        if (effectiveness >= 2) { effText = '🔥 2× effektiv!'; effClass = 'log-damage'; }
        else if (effectiveness > 1) { effText = `🔥 ${effectiveness}×`; effClass = 'log-damage'; }
        else if (effectiveness === 0) effText = '🚫 keine Wirkung';
        else if (effectiveness < 1) effText = `❄️ ${effectiveness}×`;
        const disabledNote = isDisabledByEffect ? ' (deaktiviert)' : '';
        const prio = (m.Priorität || 0) !== 0 ? `<span style="font-size:0.7rem; color:${m.Priorität > 0 ? '#5bc0de' : '#e74c3c'}"> (Prio ${m.Priorität > 0 ? '+' + m.Priorität : m.Priorität})</span>` : '';
        return `<button class="battle-move-btn" data-move-index="${i}" ${disabled ? 'disabled' : ''}>
            <div class="move-row"><span class="move-type-icon ${getTypeClass(m.Typ)}">${(m.Typ || '?').substring(0, 2).toUpperCase()}</span><span><strong>${m.Name || '?'}</strong> ⚡${powerDisp}${prio}${disabledNote}</span></div>
            <div class="move-effectiveness ${effClass}">${effText || 'Normal'}</div>
            <div class="move-pp">AP: ${currentPP}/${maxPP}</div>
            <div class="move-tooltip"><div><strong>${m.Name}</strong></div><div>Typ: ${m.Typ} | Kat: ${m.Kategorie} | Prio: ${m.Priorität || 0}</div><div>Stärke: ${powerDisp} | Genauigkeit: ${accuracyDisp}</div><div>AP: ${currentPP}/${maxPP}</div><div style="margin-top:4px; padding-top:4px; border-top:1px solid #3a5f8a; color:#ffd966;">📝 ${moveDesc}</div>${isDisabledByEffect ? '<div style="color:#f44336;">🚫 Deaktiviert</div>' : ''}</div>
        </button>`;
    }).join('');
    container.querySelectorAll('.battle-move-btn:not([disabled])').forEach(btn => btn.addEventListener('click', () => executePlayerTurn(parseInt(btn.dataset.moveIndex))));
};

// --- Attacken- und Item-Editor (unverändert) ---
function openMoveEditor(pokemonKey) {
    if (!battleState) return;
    const target = pokemonKey === 'player' ? battleState.player : battleState.enemy;
    const level = target.level;
    const allLearnable = getAllLearnableMoves(target.name, level);
    const currentMoveIds = target.moves.map(m => m.ID);
    const modal = document.getElementById('moveEditorModal');
    const container = document.getElementById('editorMovesContainer');
    const title = document.getElementById('editorTitle');
    title.innerText = `Attacken für ${target.name} (Lv.${level}) – ${allLearnable.length} erlernbare Attacken`;
    let html = `<div style="display:flex; flex-direction:column; gap:12px; max-height:50vh; overflow-y:auto;">`;
    for (let i = 0; i < 4; i++) {
        html += `<div><label><strong>Attacke ${i + 1}:</strong></label><select class="move-select" data-slot="${i}"><option value="">-- keine Attacke --</option>`;
        for (const move of allLearnable) {
            const selected = currentMoveIds[i] === move.ID ? 'selected' : '';
            const tutorBadge = (target.name && fireRedTutors[parseInt(move.ID)] && fireRedTutors[parseInt(move.ID)].learners.includes(target.name)) ? ' 🎓' : '';
            html += `<option value="${move.ID}" ${selected}>${move.Name} (${move.Typ} | ${move.Kategorie} | Stärke: ${move.Stärke ?? '-'} | AP: ${move.AP ?? '-'} | Prio: ${move.Priorität || 0})${tutorBadge}</option>`;
        }
        html += `</select></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    
    const itemSelect = document.getElementById('editorItemSelect');
    itemSelect.innerHTML = '<option value="">-- Kein Item --</option>';
    for (const item of allItems) {
        const selected = (target.item && target.item.name === item.name) ? 'selected' : '';
        itemSelect.innerHTML += `<option value="${item.name}" ${selected}>${item.name} (${item.category})</option>`;
    }
    
    modal.style.display = 'block';
    window._pendingEditor = { pokemonKey, level };
}

function applyMovesToBattle(pokemonKey, newMoveIds, newItemName) {
    if (!battleState) return;
    const target = pokemonKey === 'player' ? battleState.player : battleState.enemy;
    const newMoves = newMoveIds.map(id => getMoveById(parseInt(id))).filter(m => m);
    while (newMoves.length < 4) newMoves.push(getMoveById(165));
    target.moves = newMoves.slice(0, 4);
    target.movePP = target.moves.map(m => m.AP || 0);
    target.disabledMoveIndex = -1;
    target.disabledTurns = 0;
    
    if (newItemName) {
        const item = allItems.find(i => i.name === newItemName);
        target.item = item || null;
    } else {
        target.item = null;
    }
    
    if (pokemonKey === 'player') renderMoveButtons();
    addBattleLog('⚙️', `${target.name} hat Attacken${newItemName ? ' und Item' : ''} geändert!`);
    renderBattleUI();
}

// --- Metronom (unverändert) ---
function openMetronomeSelection() {
    const modal = document.getElementById('metronomeModal');
    const select = document.getElementById('metronomeSelect');
    const allAttackMoves = allMoves.filter(m => m.Kategorie !== 'Status' && m.Stärke && m.Stärke !== 'K.O.' && parseInt(m.ID) !== 118 && parseInt(m.ID) !== 119 && parseInt(m.ID) !== 165);
    select.innerHTML = allAttackMoves.map(m => `<option value="${m.ID}">${m.Name} (${m.Typ} | Stärke: ${m.Stärke ?? '?'} | Gen: ${getAccuracyForMove(m)})</option>`).join('');
    select.size = Math.min(15, allAttackMoves.length);
    modal.style.display = 'block';
    document.getElementById('confirmMetronome').onclick = () => {
        const selectedId = select.value;
        if (selectedId) {
            const chosenMove = getMoveById(parseInt(selectedId));
            if (chosenMove && battleState && battleState._metronomeUser && battleState._metronomeTarget) {
                const user = battleState._metronomeUser;
                const target = battleState._metronomeTarget;
                addBattleLog('🎵', `Metronom: ${user.name} wählt ${chosenMove.Name}!`);
                const res = calculateDamage(user, target, chosenMove, user.level);
                if (res.hit) {
                    if (target.substituteHP > 0) {
                        const subDmg = Math.min(target.substituteHP, res.damage);
                        target.substituteHP -= subDmg;
                        const remainingDmg = res.damage - subDmg;
                        if (remainingDmg > 0) target.currentHp = Math.max(0, target.currentHp - remainingDmg);
                        addBattleLog('🛡️', `Delegator absorbiert ${subDmg} Schaden! ${remainingDmg > 0 ? remainingDmg + ' Schaden geht durch.' : ''}`);
                        if (target.substituteHP <= 0) { addBattleLog('💨', 'Der Delegator wurde zerstört!'); target.substituteHP = 0; }
                        updateSubstituteBar(target);
                    } else { target.currentHp = Math.max(0, target.currentHp - res.damage); }
                    addBattleLog('⚔️', `${res.message}`);
                } else addBattleLog('💨', `${chosenMove.Name} verfehlt!`);
                updateHPBar(target === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', target === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', target.currentHp, target.maxHp);
                updateHPBar(user === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', user === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', user.currentHp, user.maxHp);
                if (target.currentHp <= 0) endBattle(user === battleState.player ? 'player' : 'enemy');
                else if (user.currentHp <= 0) endBattle(user === battleState.player ? 'enemy' : 'player');
            }
        }
        document.getElementById('metronomeModal').style.display = 'none';
        battleState._metronomeUser = null; battleState._metronomeTarget = null;
        if (battleState && !battleState.battleOver) {
            if (battleState.isPlayerTurn === false) {
                updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
                updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
                updateSubstituteBar(battleState.player); updateSubstituteBar(battleState.enemy);
                if (!battleState.battleOver) executeEnemyTurnDirect();
            }
        }
    };
    document.getElementById('cancelMetronome').onclick = () => {
        document.getElementById('metronomeModal').style.display = 'none';
        battleState._metronomeUser = null; battleState._metronomeTarget = null;
        if (battleState && !battleState.battleOver) { battleState.isPlayerTurn = true; renderMoveButtons(); }
    };
    document.getElementById('closeMetronome').onclick = () => {
        document.getElementById('metronomeModal').style.display = 'none';
        battleState._metronomeUser = null; battleState._metronomeTarget = null;
        if (battleState && !battleState.battleOver) { battleState.isPlayerTurn = true; renderMoveButtons(); }
    };
}

// --- Kontext-Popups (unverändert) ---
function showMoveContextPopup(moveId, moveName, event) {
    const popup = document.getElementById('contextPopup'); if (!popup) return;
    const move = getMoveById(moveId);
    const desc = move ? getMoveDescription(move) : '';
    const levelLearners = [];
    for (const p of allPokemon) { const d = pokemonDetailsMap.get(p.name); if (d && d.moves) { const mi = d.moves.find(m => m.id === moveId); if (mi) levelLearners.push({ name: p.name, level: mi.level, nr: p.nr }); } }
    levelLearners.sort((a, b) => a.name.localeCompare(b.name));
    const tmLearners = tmPokemonLearners.get(moveId) || [], tutorLearners = tutorLearnersMap.get(moveId) || [];
    const tmNumber = window.fixedTMVM.get(moveId) || '';
    let html = `<strong>📖 ${moveName} (ID ${moveId})</strong><br>`;
    if (desc) html += `<div style="color:#ffd966; margin:4px 0;">📝 ${desc}</div>`;
    if (tmNumber) html += `<div><span class="${tmNumber.startsWith('VM') ? 'vm-number' : 'tm-number'}">${tmNumber}</span></div>`;
    html += '<div class="section-title">📈 Level‑Up</div>';
    if (pokemonDetailsMap.size < allPokemon.length) html += '<div style="color:#ffaa44;"><i class="fas fa-spinner fa-pulse"></i> Lade Details ...</div>';
    else if (levelLearners.length === 0) html += '<div style="color:#aaa;">Keine Pokémon lernen diese Attacke per Level.</div>';
    else { html += `<div class="pokemon-list" style="max-height:200px; overflow-y:auto;"><table style="width:100%;"><tbody>${levelLearners.map(l => `<tr class="learn-entry"><td><span class="learn-pokemon">${l.name}</span> <span class="learn-level">(Level ${l.level})</span></td></tr>`).join('')}</tbody></table></div>`; }
    html += '<div class="section-title">🎮 TM/VM</div>';
    if (pokemonDetailsMap.size < allPokemon.length) html += '<div style="color:#ffaa44;"><i class="fas fa-spinner fa-pulse"></i> Lade TM-Daten ...</div>';
    else if (tmLearners.length === 0 && !tmNumber) html += '<div style="color:#aaa;">Keine TM/VM für diese Attacke.</div>';
    else { const unique = new Map(); tmLearners.forEach(l => unique.set(l.name, l)); html += `<div class="pokemon-list" style="max-height:200px; overflow-y:auto;"><table style="width:100%;"><tbody>${Array.from(unique.values()).map(l => `<tr class="learn-entry"><td><span class="learn-pokemon">${l.name}</span> <span class="learn-level">(${l.tmNumber})</span></td></tr>`).join('')}</tbody></table></div>`; }
    html += '<div class="section-title">🎓 Attackenlehrer (FR/BG)</div>';
    if (tutorLearners.length === 0) html += '<div style="color:#aaa;">Keine Attackenlehrer für diese Attacke.</div>';
    else { html += `<div class="pokemon-list" style="max-height:200px; overflow-y:auto;"><table style="width:100%;"><tbody>${tutorLearners.map(l => `<tr class="learn-entry"><td><span class="learn-pokemon">${l.name}</span></td></tr>`).join('')}</tbody></table></div>`; }
    popup.innerHTML = html; popup.style.display = 'block';
    popup.style.left = Math.min(event.clientX, window.innerWidth - 400) + 'px'; popup.style.top = Math.min(event.clientY, window.innerHeight - 400) + 'px';
}

function showPokemonContextPopup(e, pokemonName) {
    const popup = document.getElementById('contextPopup');
    const poke = allPokemon.find(p => p.name === pokemonName); if (!poke) return;
    let html = `<strong>${poke.name} (#${poke.nr})</strong><br><table>`;
    html += `<tr><td class="stat-name">KP</td><td>${poke.hp}</td></tr><tr><td class="stat-name">Angriff</td><td>${poke.atk}</td></tr><tr><td class="stat-name">Verteidigung</td><td>${poke.def}</td></tr><tr><td class="stat-name">Sp.-Ang.</td><td>${poke.spa}</td></tr><tr><td class="stat-name">Sp.-Vert.</td><td>${poke.spd}</td></tr><tr><td class="stat-name">Initiative</td><td>${poke.spe}</td></tr><tr><td class="stat-name">Summe</td><td>${poke.sum}</td></tr>`;
    if (battleState) {
        let bp = null;
        if (battleState.player?.name === pokemonName) bp = battleState.player;
        if (battleState.enemy?.name === pokemonName) bp = battleState.enemy;
        if (bp?.boosts) {
            html += `<tr><td colspan="2"><hr></td></tr><tr><td colspan="2"><strong>Boost-Status</strong></td></tr>`;
            const lb = { atk: 'Ang.', def: 'Vert.', spe: 'Init.', spez: 'Gen./Flucht' };
            for (const s of ['atk', 'def', 'spe', 'spez']) { const v = bp.boosts[s] || 0; html += `<tr><td class="stat-name">${lb[s]}</td><td class="boost-indicator">${v > 0 ? '+' + v : v}</td></tr>`; }
            html += `<tr><td class="stat-name">Genauigkeit</td><td>${getAccuracyMultiplier(bp.boosts.spez || 0).toFixed(2)}x</td></tr>`;
            html += `<tr><td class="stat-name">Krit-Chance</td><td>${(getCritChance(bp) * 100).toFixed(1)}%</td></tr>`;
            html += `<tr><td class="stat-name">Eff. Initiative</td><td>${getEffectiveSpeed(bp)}</td></tr>`;
        }
        if (bp?.status) { html += `<tr><td colspan="2">Status: ${getStatusText(bp.status.type)}${bp.status.toxicCounter ? ` (Toxin x${bp.status.toxicCounter})` : ''}${bp.status.sleepTurns ? ` (${bp.status.sleepTurns} Rd)` : ''}</td></tr>`; }
        if (bp?.substituteHP > 0) html += `<tr><td colspan="2">🛡️ Delegator: ${bp.substituteHP}/${bp.substituteMaxHP}</td></tr>`;
        if (bp?.leechSeed) html += '<tr><td colspan="2">🌱 Egelsamen aktiv</td></tr>';
        if (bp?.confusion) html += '<tr><td colspan="2">🌀 Verwirrt</td></tr>';
        if (bp?.isProtected) html += '<tr><td colspan="2">🛡️ Geschützt</td></tr>';
        if (bp?.item) html += `<tr><td colspan="2">🎁 Item: ${bp.item.name}</td></tr>`;
    }
    html += '</table>';
    popup.innerHTML = html; popup.style.display = 'block';
    popup.style.left = Math.min(e.clientX, window.innerWidth - 280) + 'px'; popup.style.top = Math.min(e.clientY, window.innerHeight - 280) + 'px';
}

function hideContextPopup() { document.getElementById('contextPopup').style.display = 'none'; }

// --- Tab-Wechsel & Suche (unverändert) ---
function setActiveTable(t) {
    window.activeTable = t;
    document.getElementById('pokemonContainer').style.display = t === 'pokemon' ? 'block' : 'none';
    document.getElementById('movesContainer').style.display = t === 'moves' ? 'block' : 'none';
    document.getElementById('itemsContainer').style.display = t === 'items' ? 'block' : 'none';
    document.getElementById('debugItemsContainer').style.display = t === 'debugitems' ? 'block' : 'none';
    document.getElementById('treeContainer').style.display = t === 'tree' ? 'block' : 'none';
    document.getElementById('shinyContainer').style.display = t === 'shiny' ? 'block' : 'none';
    document.getElementById('legiContainer').style.display = t === 'shiny' ? 'block' : 'none';
    document.getElementById('trainerContainer').style.display = t === 'trainer' ? 'block' : 'none';
    document.getElementById('btnPokemon').classList.toggle('active', t === 'pokemon');
    document.getElementById('btnMoves').classList.toggle('active', t === 'moves');
    document.getElementById('btnItems').classList.toggle('active', t === 'items');
    document.getElementById('btnDebugItems').classList.toggle('active', t === 'debugitems');
    document.getElementById('btnTree').classList.toggle('active', t === 'tree');
    document.getElementById('btnShiny').classList.toggle('active', t === 'shiny');
    document.getElementById('btnTrainer').classList.toggle('active', t === 'trainer');
    document.getElementById('searchInput').value = '';
    updateSearch();
    if (t === 'debugitems') {
        renderDebugItems();
    }
    if (t === 'tree') {
        initTreeDebug();
    }
    if (t === 'shiny') {
        initShinyEncounter();
        initLegiEncounter();
    }
    if (t === 'trainer') {
        initTrainerBattle();
    }
}

function updateSearch() {
    if (window.activeTable === 'pokemon') renderPokemonTable(pokemonDetailsMap.size === allPokemon.length);
    else if (window.activeTable === 'moves') renderMovesTable();
    else if (window.activeTable === 'items') renderItemsTable();
}

// --- Baum-Debug (unverändert) ---
function initTreeDebug() {
    const structure = [2, 3, 4, 3, 4, 3, 2, 1];
    const treeContainer = document.getElementById('tree');
    const svg = document.getElementById('treeLines');
    const infoDiv = document.getElementById('treeDebugInfo');
    const resetBtn = document.getElementById('resetTreeBtn');

    if (!treeContainer || treeContainer.dataset.initialized) return;
    treeContainer.dataset.initialized = 'true';

    const nodes = [];
    let nodeId = 0;
    const levelGap = 110;
    const nodeSize = 60;
    const width = 700;

    structure.forEach((count, level) => {
        const spacing = width / (count + 1);
        for (let i = 0; i < count; i++) {
            nodes.push({
                id: nodeId++,
                level,
                index: i,
                x: spacing * (i + 1) - nodeSize / 2,
                y: 40 + level * levelGap,
                value: Math.floor(Math.random() * 6) + 1,
                next: []
            });
        }
    });

    for (let level = 0; level < structure.length - 1; level++) {
        const current = nodes.filter(n => n.level === level);
        const next = nodes.filter(n => n.level === level + 1);
        const ratio = next.length / current.length;

        current.forEach((node, i) => {
            const targetIndexA = Math.floor(i * ratio);
            const targetIndexB = Math.min(targetIndexA + 1, next.length - 1);

            if ((level === 2 || level === 4 || level === 5) && i === 0) {
                if (next[targetIndexA]) node.next.push(next[targetIndexA].id);
                return;
            }

            if (next[targetIndexA]) node.next.push(next[targetIndexA].id);
            if (next[targetIndexB] && targetIndexB !== targetIndexA) node.next.push(next[targetIndexB].id);
        });
    }

    svg.innerHTML = '';
    const lineMap = new Map();
    nodes.forEach(node => {
        node.next.forEach(targetId => {
            const target = nodes.find(n => n.id === targetId);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", node.x + nodeSize / 2);
            line.setAttribute("y1", node.y + nodeSize / 2);
            line.setAttribute("x2", target.x + nodeSize / 2);
            line.setAttribute("y2", target.y + nodeSize / 2);
            line.setAttribute("stroke", "#3a4a5a");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
            lineMap.set(`${node.id}-${targetId}`, line);
        });
    });

    treeContainer.querySelectorAll('.node').forEach(el => el.remove());
    nodes.forEach(node => {
        const div = document.createElement("div");
        div.className = "node";
        div.id = "node-" + node.id;
        div.style.left = node.x + "px";
        div.style.top = node.y + "px";
        div.textContent = node.value;
        div.dataset.id = node.id;
        div.dataset.level = node.level;
        treeContainer.appendChild(div);
    });

    let pathNodeIds = [];
    let currentEndId = null;

    function updatePathHighlights() {
        document.querySelectorAll('#tree .node').forEach(el => {
            el.classList.remove('debug-selected', 'path-node', 'path-start');
        });
        lineMap.forEach(line => line.classList.remove('path-line'));

        if (pathNodeIds.length === 0) return;

        pathNodeIds.forEach((id, index) => {
            const el = document.getElementById('node-' + id);
            if (!el) return;
            if (index === 0) {
                el.classList.add('path-start');
            } else if (index === pathNodeIds.length - 1) {
                el.classList.add('debug-selected');
            } else {
                el.classList.add('path-node');
            }
        });

        for (let i = 0; i < pathNodeIds.length - 1; i++) {
            const from = pathNodeIds[i];
            const to = pathNodeIds[i + 1];
            const line = lineMap.get(`${from}-${to}`);
            if (line) line.classList.add('path-line');
        }
    }

    function resetPath() {
        pathNodeIds = [];
        currentEndId = null;
        updatePathHighlights();
        infoDiv.textContent = 'Klicke auf einen Startknoten (Ebene 0)';
    }

    function handleNodeClick(e) {
        const id = parseInt(e.currentTarget.dataset.id);
        const clickedNode = nodes.find(n => n.id === id);

        if (pathNodeIds.length === 0) {
            if (clickedNode.level !== 0) {
                infoDiv.textContent = 'Bitte wähle zuerst einen Startknoten in Ebene 0.';
                return;
            }
            pathNodeIds = [id];
            currentEndId = id;
            updatePathHighlights();
            infoDiv.innerHTML = `Pfad gestartet bei ID ${id} (Wert ${clickedNode.value}). Klicke auf einen verbundenen Knoten.`;
            return;
        }

        const lastNode = nodes.find(n => n.id === currentEndId);
        if (!lastNode.next.includes(id)) {
            infoDiv.textContent = 'Dieser Knoten ist nicht mit dem aktuellen Pfadende verbunden.';
            return;
        }

        if (pathNodeIds.includes(id)) {
            infoDiv.textContent = 'Dieser Knoten wurde bereits besucht. (Keine Änderung)';
            return;
        }

        pathNodeIds.push(id);
        currentEndId = id;
        updatePathHighlights();

        const endNode = nodes.find(n => n.id === id);
        const nextIds = endNode.next.join(', ');
        infoDiv.innerHTML = `Pfad erweitert zu ID ${id} (Wert ${endNode.value}).<br>➡️ Mögliche nächste Knoten: ${nextIds || 'keine'}`;

        if (endNode.next.length === 0) {
            infoDiv.innerHTML += '<br>🏁 Ende des Baums erreicht.';
        }
    }

    document.querySelectorAll('#tree .node').forEach(el => {
        el.addEventListener('click', handleNodeClick);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', resetPath);
    }

    infoDiv.textContent = 'Klicke auf einen Startknoten (Ebene 0), um den Pfad zu beginnen.';
    resetPath();
}

// --- Shiny Encounter (unverändert) ---
let currentShinyName = null;

function loadRandomShiny() {
    const others = allPokemon.filter(p => p.name !== 'Glurak');
    if (others.length === 0) return;
    const shiny = others[Math.floor(Math.random() * others.length)];
    currentShinyName = shiny.name;

    document.getElementById('shinySprite').src = getShinyImageUrl(shiny.nr);
    document.getElementById('shinyName').textContent = shiny.name;
    document.getElementById('shinyTypes').innerHTML = shiny.types.map(t => 
        `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
    ).join(' ');
}

function initShinyEncounter() {
    const container = document.getElementById('shinyContainer');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    loadRandomShiny();

    document.getElementById('shinyRerollBtn').addEventListener('click', loadRandomShiny);
    document.getElementById('shinyFightBtn').addEventListener('click', () => {
        if (!currentShinyName) return;
        const playerLevel = parseInt(document.getElementById('glurakLevelInput').value) || 50;
        const enemyLevel = parseInt(document.getElementById('shinyLevelInput').value) || 50;

        document.getElementById('playerLevelSlider').value = playerLevel;
        document.getElementById('playerLevelValue').textContent = playerLevel;
        document.getElementById('enemyLevelSlider').value = enemyLevel;
        document.getElementById('enemyLevelValue').textContent = enemyLevel;

        startBattle('Glurak', currentShinyName, true);
    });
}

// --- Legendäre Begegnung (unverändert) ---
let currentLegiName = null;
let lastLegiName = null;
const legendaryPokemon = ['Mewtu', 'Mew', 'Arktos', 'Zapdos', 'Lavados'];

function loadRandomLegi() {
    if (legendaryPokemon.length === 0) return;
    let available = legendaryPokemon;
    if (lastLegiName && legendaryPokemon.length > 1) {
        available = legendaryPokemon.filter(name => name !== lastLegiName);
    }
    const chosenName = available[Math.floor(Math.random() * available.length)];
    const legi = allPokemon.find(p => p.name === chosenName);
    if (!legi) return;
    currentLegiName = legi.name;
    lastLegiName = legi.name;

    document.getElementById('legiSprite').src = getPokemonImageUrl(legi.nr);
    document.getElementById('legiName').textContent = legi.name;
    document.getElementById('legiTypes').innerHTML = legi.types.map(t => 
        `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
    ).join(' ');
}

function initLegiEncounter() {
    const container = document.getElementById('legiContainer');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    loadRandomLegi();

    document.getElementById('legiRerollBtn').addEventListener('click', loadRandomLegi);
    document.getElementById('legiFightBtn').addEventListener('click', () => {
        if (!currentLegiName) return;
        const playerLevel = parseInt(document.getElementById('legiGlurakLevelInput').value) || 50;
        const enemyLevel = parseInt(document.getElementById('legiLevelInput').value) || 70;

        document.getElementById('playerLevelSlider').value = playerLevel;
        document.getElementById('playerLevelValue').textContent = playerLevel;
        document.getElementById('enemyLevelSlider').value = enemyLevel;
        document.getElementById('enemyLevelValue').textContent = enemyLevel;

        startBattle('Glurak', currentLegiName, false);
    });
}

// --- Trainer Kampf (mit Trainer-Sprite und Intro) ---
const trainerClasses = [
    { name: 'Ass-Trainer', types: [], statThreshold: 500, sizeWeights: [0, 0.05, 0.3, 0.4, 0.2, 0.05, 0] },
    { name: 'Schönheit', types: ['Normal', 'Wasser', 'Pflanze'], sizeWeights: [0, 0.1, 0.4, 0.3, 0.15, 0.05, 0] },
    { name: 'Biker', types: ['Gift', 'Feuer', 'Kampf'], sizeWeights: [0, 0.05, 0.3, 0.4, 0.2, 0.05, 0] },
    { name: 'Vogelfänger', types: ['Flug'], sizeWeights: [0, 0.15, 0.4, 0.3, 0.1, 0.05, 0] },
    { name: 'Käfersammler', types: ['Käfer'], sizeWeights: [0, 0.1, 0.5, 0.3, 0.1, 0, 0] },
    { name: 'Einbrecher', types: ['Feuer'], sizeWeights: [0, 0.05, 0.3, 0.4, 0.2, 0.05, 0] },
    { name: 'Medium', types: ['Geist', 'Psycho'], sizeWeights: [0, 0.05, 0.2, 0.5, 0.2, 0.05, 0] },
    { name: 'Rowdy', types: ['Kampf'], sizeWeights: [0, 0.1, 0.5, 0.3, 0.1, 0, 0] },
    { name: 'Ingenieur', types: ['Elektro'], sizeWeights: [0, 0.05, 0.3, 0.4, 0.2, 0.05, 0] },
    { name: 'Angler', types: ['Wasser'], sizeWeights: [0, 0.2, 0.5, 0.2, 0.1, 0, 0] },
    { name: 'Spieler', types: [], sizeWeights: [0, 0.1, 0.5, 0.3, 0.1, 0, 0] },
    { name: 'Gentleman', types: ['Normal'], sizeWeights: [0, 0.05, 0.2, 0.5, 0.2, 0.05, 0] },
    { name: 'Wanderer', types: ['Gestein', 'Boden'], sizeWeights: [0, 0.1, 0.4, 0.3, 0.15, 0.05, 0] },
    { name: 'Jongleur', types: ['Psycho', 'Gift'], sizeWeights: [0, 0.15, 0.4, 0.3, 0.1, 0.05, 0] },
    { name: 'Göre', types: [], sizeWeights: [0, 0.2, 0.5, 0.2, 0.1, 0, 0] },
    { name: 'Pokémaniac', types: [], rare: true, sizeWeights: [0, 0, 0.2, 0.4, 0.3, 0.1, 0] },
    { name: 'Psycho', types: ['Psycho'], sizeWeights: [0, 0.05, 0.3, 0.5, 0.1, 0.05, 0] },
    { name: 'Rocker', types: ['Elektro'], sizeWeights: [0, 0.1, 0.4, 0.3, 0.15, 0.05, 0] },
    { name: 'Matrose', types: ['Wasser', 'Kampf'], sizeWeights: [0, 0.1, 0.4, 0.3, 0.15, 0.05, 0] },
    { name: 'Forscher', types: ['Gift', 'Elektro'], sizeWeights: [0, 0.05, 0.2, 0.5, 0.2, 0.05, 0] },
    { name: 'Streber', types: [], sizeWeights: [0, 0.1, 0.5, 0.3, 0.1, 0, 0] },
    { name: 'Schwimmer', types: ['Wasser'], sizeWeights: [0, 0.15, 0.5, 0.25, 0.1, 0, 0] },
    { name: 'Dompteur', types: [], statThreshold: 400, preferPhysical: true, sizeWeights: [0, 0.05, 0.3, 0.4, 0.2, 0.05, 0] },
    { name: 'Knirps', types: ['Normal', 'Flug'], sizeWeights: [0, 0.3, 0.5, 0.15, 0.05, 0, 0] }
];

let currentTrainerClass = null;
let currentTrainerEnemyName = null;
window._currentTrainerTeam = [];

function getTeamSize(trainerClass) {
    const weights = trainerClass.sizeWeights || [0, 0.1, 0.5, 0.3, 0.1, 0, 0];
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return i + 1;
    }
    return 3;
}

function getTrainerEnemyPokemon(trainerClass, excludeNames = []) {
    let candidates = allPokemon.filter(p => p.name !== 'Glurak' && !excludeNames.includes(p.name));
    const cls = trainerClasses.find(tc => tc.name === trainerClass);
    if (!cls) return null;

    if (cls.types && cls.types.length > 0) {
        const typeSet = cls.types.map(t => t.toLowerCase());
        candidates = candidates.filter(p => p.types.some(t => typeSet.includes(t.toLowerCase())));
    }

    if (cls.rare) {
        const legendList = ['Mewtu', 'Mew', 'Arktos', 'Zapdos', 'Lavados'];
        candidates = candidates.filter(p => legendList.includes(p.name));
    }

    if (cls.statThreshold) {
        candidates = candidates.filter(p => p.sum >= cls.statThreshold);
    }

    if (cls.preferPhysical) {
        candidates.sort((a, b) => (b.atk - a.atk));
        const topAttack = candidates[0]?.atk || 0;
        candidates = candidates.filter(p => p.atk >= topAttack - 10);
    }

    if (candidates.length === 0) {
        candidates = allPokemon.filter(p => p.name !== 'Glurak' && !excludeNames.includes(p.name));
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
}

function generateEnemyTeam(trainerClassName, teamSize) {
    const teamNames = [];
    for (let i = 0; i < teamSize; i++) {
        const enemy = getTrainerEnemyPokemon(trainerClassName, teamNames);
        if (enemy) teamNames.push(enemy.name);
    }
    return teamNames;
}

function updateTrainerInfo() {
    if (!currentTrainerClass) return;
    const cls = trainerClasses.find(tc => tc.name === currentTrainerClass);
    if (!cls) return;

    const typeInfo = document.getElementById('trainerTypeInfo');
    if (cls.types && cls.types.length > 0) {
        typeInfo.innerHTML = `<strong>Bevorzugte Typen:</strong> ${cls.types.join(', ')}`;
    } else if (cls.rare) {
        typeInfo.innerHTML = '<strong>Typ:</strong> Legendär (seltene Pokémon)';
    } else {
        typeInfo.innerHTML = '<strong>Typ:</strong> Keine Spezialisierung';
    }

    const teamSize = getTeamSize(cls);
    window._currentTrainerTeamSize = teamSize;
    window._currentTrainerTeam = generateEnemyTeam(currentTrainerClass, teamSize);

    const partyInfo = document.getElementById('trainerPartyInfo');
    partyInfo.innerHTML = `Teamgröße: ${window.getTeamBallDisplay(teamSize, 0)} (${teamSize} Pokémon)`;

    // Team-Vorschau
    const previewDiv = document.getElementById('trainerTeamPreview');
    if (previewDiv) {
        previewDiv.innerHTML = '';
        window._currentTrainerTeam.forEach((name, idx) => {
            const poke = allPokemon.find(p => p.name === name);
            if (poke) {
                const card = document.createElement('div');
                card.className = 'trainer-team-card';
                card.innerHTML = `
                    <img src="${getPokemonImageUrl(poke.nr)}" width="60" height="60">
                    <div>${poke.name}</div>
                    <div>${poke.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join(' ')}</div>
                `;
                previewDiv.appendChild(card);
            }
        });
    }

    // Trainer-Sprite aktualisieren
    updateTrainerSprite();
}

function updateTrainerEnemyDisplay() {
    if (!currentTrainerEnemyName) return;
    const enemy = allPokemon.find(p => p.name === currentTrainerEnemyName);
    if (!enemy) return;
    document.getElementById('trainerSprite').src = getPokemonImageUrl(enemy.nr);
    document.getElementById('trainerEnemyName').textContent = enemy.name;
    document.getElementById('trainerEnemyTypes').innerHTML = enemy.types.map(t => 
        `<span class="type-badge ${getTypeClass(t)}">${t}</span>`
    ).join(' ');
}

function updateTrainerEnemyLevel() {
    const glurakLevel = parseInt(document.getElementById('trainerGlurakLevelInput').value) || 50;
    const reduction = Math.floor(Math.random() * 5) + 3; // 3 bis 7
    const enemyLevel = Math.max(1, glurakLevel - reduction);
    document.getElementById('trainerEnemyLevelDisplay').textContent = enemyLevel;
}

function loadRandomTrainerEnemy() {
    if (!currentTrainerClass) return;
    if (window._currentTrainerTeam.length > 0) {
        currentTrainerEnemyName = window._currentTrainerTeam[0];
    } else {
        const enemy = getTrainerEnemyPokemon(currentTrainerClass);
        if (enemy) currentTrainerEnemyName = enemy.name;
    }
    updateTrainerEnemyDisplay();
}

function initTrainerBattle() {
    const container = document.getElementById('trainerContainer');
    if (!container || container.dataset.initialized) return;
    container.dataset.initialized = 'true';

    if (!document.getElementById('trainerTeamPreview')) {
        const previewDiv = document.createElement('div');
        previewDiv.id = 'trainerTeamPreview';
        previewDiv.style.cssText = 'display:flex; flex-wrap:wrap; gap:16px; justify-content:center; margin-top:20px;';
        document.getElementById('trainerEncounterCard').after(previewDiv);
    }

    // Trainer-Sprite-Bild im UI (neben dem Pokémon-Sprite)
    if (!document.getElementById('trainerSpriteImage')) {
        const trainerSpriteImg = document.createElement('img');
        trainerSpriteImg.id = 'trainerSpriteImage';
      trainerSpriteImg.style.cssText = 'width:150px; height:150px; image-rendering:pixelated; border-radius:50%; background:#1e2a3a; padding:8px; margin:0 10px;';
        const encounterCard = document.getElementById('trainerEncounterCard');
        if (encounterCard) {
            encounterCard.insertBefore(trainerSpriteImg, encounterCard.firstChild);
        }
    }

    const select = document.getElementById('trainerClassSelect');
    select.innerHTML = '';
    trainerClasses.forEach(tc => {
        const option = document.createElement('option');
        option.value = tc.name;
        option.textContent = tc.name;
        select.appendChild(option);
    });

    select.addEventListener('change', function() {
        currentTrainerClass = this.value;
        updateTrainerInfo();
        loadRandomTrainerEnemy();
        updateTrainerEnemyLevel();
    });

    const levelInput = document.getElementById('trainerGlurakLevelInput');
    levelInput.addEventListener('input', () => {
        updateTrainerEnemyLevel();
    });

    document.getElementById('trainerRerollBtn').addEventListener('click', () => {
        if (!currentTrainerClass) return;
        updateTrainerInfo();
        loadRandomTrainerEnemy();
        updateTrainerEnemyLevel();
    });

    document.getElementById('trainerFightBtn').addEventListener('click', () => {
    if (!currentTrainerClass || window._currentTrainerTeam.length === 0) return;
    const playerLevel = parseInt(levelInput.value) || 50;
    const reduction = Math.floor(Math.random() * 5) + 3; // 3 bis 7
    const enemyLevel = Math.max(1, playerLevel - reduction);

        document.getElementById('playerLevelSlider').value = playerLevel;
        document.getElementById('playerLevelValue').textContent = playerLevel;
        document.getElementById('enemyLevelSlider').value = enemyLevel;
        document.getElementById('enemyLevelValue').textContent = enemyLevel;

        startBattle('Glurak', window._currentTrainerTeam, false, currentTrainerClass);
    });

    select.value = trainerClasses[0].name;
    currentTrainerClass = trainerClasses[0].name;
    updateTrainerInfo();
    loadRandomTrainerEnemy();
    updateTrainerEnemyLevel();
}

// --- Event Listener (unverändert) ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnPokemon').addEventListener('click', () => setActiveTable('pokemon'));
    document.getElementById('btnMoves').addEventListener('click', () => setActiveTable('moves'));
    document.getElementById('btnItems').addEventListener('click', () => setActiveTable('items'));
    document.getElementById('btnDebugItems').addEventListener('click', () => setActiveTable('debugitems'));
    document.getElementById('btnTree').addEventListener('click', () => setActiveTable('tree'));
    document.getElementById('btnShiny').addEventListener('click', () => setActiveTable('shiny'));
    document.getElementById('btnTrainer').addEventListener('click', () => setActiveTable('trainer'));
    document.getElementById('searchInput').addEventListener('input', updateSearch);
    document.querySelector('#pokemonModal .close').addEventListener('click', () => document.getElementById('pokemonModal').style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === document.getElementById('pokemonModal')) document.getElementById('pokemonModal').style.display = 'none'; });
    document.getElementById('battleCloseBtn').addEventListener('click', closeBattle);
    document.getElementById('battleOverlay').addEventListener('click', function(e) { if (e.target === this) closeBattle(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('battleOverlay').classList.contains('active')) closeBattle(); });
    document.getElementById('playerLevelSlider').addEventListener('input', function() { document.getElementById('playerLevelValue').textContent = this.value; updateLevelLive(); });
    document.getElementById('enemyLevelSlider').addEventListener('input', function() { document.getElementById('enemyLevelValue').textContent = this.value; updateLevelLive(); });
    document.getElementById('playerEditMovesBtn').addEventListener('click', () => openMoveEditor('player'));
    document.getElementById('enemyEditMovesBtn').addEventListener('click', () => openMoveEditor('enemy'));
    document.getElementById('playerEditItemBtn').addEventListener('click', () => openMoveEditor('player'));
    document.getElementById('enemyEditItemBtn').addEventListener('click', () => openMoveEditor('enemy'));
    document.getElementById('saveMoveChanges').onclick = () => {
        const editor = window._pendingEditor; if (!editor || !battleState) return;
        const selects = document.querySelectorAll('#editorMovesContainer .move-select');
        const newMoveIds = []; for (let i = 0; i < selects.length; i++) { const val = selects[i].value; if (val) newMoveIds.push(parseInt(val)); }
        if (newMoveIds.length < 4) { alert("Bitte wähle für jeden der 4 Slots eine Attacke aus."); return; }
        const itemSelect = document.getElementById('editorItemSelect');
        const newItemName = itemSelect.value || null;
        applyMovesToBattle(editor.pokemonKey, newMoveIds, newItemName);
        document.getElementById('moveEditorModal').style.display = 'none';
    };
    document.getElementById('cancelMoveChanges').onclick = () => document.getElementById('moveEditorModal').style.display = 'none';
    document.getElementById('closeMoveEditor').onclick = () => document.getElementById('moveEditorModal').style.display = 'none';
    window.addEventListener('click', (e) => { if (e.target === document.getElementById('moveEditorModal')) document.getElementById('moveEditorModal').style.display = 'none'; if (e.target === document.getElementById('metronomeModal')) document.getElementById('metronomeModal').style.display = 'none'; });
    document.getElementById('movesTableBody').addEventListener('contextmenu', function(e) { const row = e.target.closest('.move-row'); if (row) { e.preventDefault(); const moveId = parseInt(row.getAttribute('data-move-id')); const moveName = row.getAttribute('data-move-name'); if (moveId) showMoveContextPopup(moveId, moveName, e); } });
    document.getElementById('pokemonTableBody').addEventListener('contextmenu', function(e) { const row = e.target.closest('.pokemon-row'); if (row) { e.preventDefault(); showPokemonContextPopup(e, row.dataset.pokemonName); } });
    document.getElementById('battlePlayerPoke').addEventListener('contextmenu', function(e) { if (battleState) { e.preventDefault(); showPokemonContextPopup(e, battleState.player.name); } });
    document.getElementById('battleEnemyPoke').addEventListener('contextmenu', function(e) { if (battleState) { e.preventDefault(); showPokemonContextPopup(e, battleState.enemy.name); } });
    document.addEventListener('click', function(e) { if (!e.target.closest('#contextPopup') && !e.target.closest('.pokemon-row') && !e.target.closest('.battle-pokemon') && !e.target.closest('.move-row')) hideContextPopup(); });
    document.addEventListener('contextmenu', function(e) { if (!e.target.closest('.pokemon-row') && !e.target.closest('.battle-pokemon') && !e.target.closest('.move-row')) hideContextPopup(); });

    document.getElementById('btnRefreshDebugItems').addEventListener('click', renderDebugItems);

    renderPokemonTable(false);
    setActiveTable('pokemon');
    loadAllPokemonDetails();
    initTreeDebug();
});