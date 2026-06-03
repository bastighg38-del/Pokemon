// kampf.js – Vollständige Kampf-Engine mit allen Item-Effekten (final)
// NEU: teamBallDisplay, schwarze Bälle für besiegte Pokémon, Bild-/Namensupdate beim Wechsel

window.battleState = null;

// --- Statistik-Berechnung (Gen 1) ---
function calcStatGen1(base, iv, level, isHP = false) {
    const statExp = 65535;
    let x = Math.min(63, Math.floor((Math.sqrt(Math.max(0, statExp - 1)) + 1) / 4));
    let stat = Math.floor((((base + iv) * 2 + x) * level) / 100);
    if (isHP) stat += level + 10;
    else stat += 5;
    return stat;
}

window.getStatsForLevel = function(pokemon, level) {
    const ivHP = 15, ivOther = 15;
    return {
        hp: calcStatGen1(pokemon.hp, ivHP, level, true),
        atk: calcStatGen1(pokemon.atk, ivOther, level),
        def: calcStatGen1(pokemon.def, ivOther, level),
        spa: calcStatGen1(pokemon.spa, ivOther, level),
        spd: calcStatGen1(pokemon.spd, ivOther, level),
        spe: calcStatGen1(pokemon.spe, ivOther, level),
    };
};

// --- Stat-Stufen ---
function getStatStageMultiplier(stage) {
    if (stage < -6) stage = -6;
    if (stage > 6) stage = 6;
    const stages = { '-6': 0.25, '-5': 0.28, '-4': 0.33, '-3': 0.4, '-2': 0.5, '-1': 0.66, 0: 1, 1: 1.5, 2: 2, 3: 2.5, 4: 3, 5: 3.5, 6: 4 };
    return stages[stage] || 1;
}

function getBoostedStat(statValue, stage, pokemon, statName) {
    let value = statValue * getStatStageMultiplier(stage);
    if (pokemon && pokemon.status && pokemon.status.type === 'burn' && statName === 'atk') {
        value = Math.floor(value / 2);
    }
    if (pokemon && pokemon.status && pokemon.status.type === 'paralyze' && statName === 'spe') {
        value = Math.floor(value / 4);
    }
    return Math.floor(value);
}

function getCritChance(pokemon) {
    if (!pokemon) return 0.125;
    let baseCrit = pokemon.criticalUp ? 0.25 : 0.125;
    if (pokemon.item && pokemon.item.name === 'Scope-Linse') {
        baseCrit = 0.25;
    }
    if (pokemon.item && pokemon.item.name === 'Lansatbeere (Lansat Berry)') {
        return 0.5;
    }
    return baseCrit;
}

function getEffectiveSpeed(pokemon) {
    let speed = getBoostedStat(pokemon.spe, pokemon.boosts?.spe || 0, pokemon, 'spe');
    if (pokemon.status && pokemon.status.type === 'paralyze') speed = Math.floor(speed / 4);
    return Math.max(1, speed);
}

function getCurrentAccuracyStage(pokemon) { return pokemon.boosts?.spez || 0; }

function getAccuracyMultiplier(stage) {
    const stages = { '-6': 0.33, '-5': 0.38, '-4': 0.43, '-3': 0.5, '-2': 0.6, '-1': 0.75, 0: 1, 1: 1.33, 2: 1.67, 3: 2, 4: 2.33, 5: 2.67, 6: 3 };
    return stages[Math.max(-6, Math.min(6, stage))] || 1;
}

// --- Typ-Effektivität ---
window.typeEffectiveness = {
    normal: { gestein: 0.5, geist: 0, stahl: 0.5 },
    feuer: { feuer: 0.5, wasser: 0.5, gestein: 0.5, pflanze: 2, eis: 2, käfer: 2, drache: 0.5, stahl: 2 },
    wasser: { feuer: 2, wasser: 0.5, pflanze: 0.5, boden: 2, gestein: 2, drache: 0.5 },
    elektro: { wasser: 2, elektro: 0.5, pflanze: 0.5, boden: 0, flug: 2, drache: 0.5 },
    pflanze: { feuer: 0.5, wasser: 2, pflanze: 0.5, gift: 0.5, boden: 2, flug: 0.5, käfer: 0.5, gestein: 2, drache: 0.5, stahl: 0.5 },
    eis: { feuer: 0.5, wasser: 0.5, pflanze: 2, eis: 0.5, boden: 2, flug: 2, drache: 2, stahl: 0.5 },
    kampf: { normal: 2, eis: 2, gift: 0.5, flug: 0.5, psycho: 0.5, käfer: 0.5, gestein: 2, geist: 0, stahl: 2, unlicht: 2 },
    gift: { pflanze: 2, gift: 0.5, boden: 0.5, gestein: 0.5, geist: 0.5, käfer: 2, stahl: 0 },
    boden: { feuer: 2, pflanze: 0.5, elektro: 2, gift: 2, gestein: 2, flug: 0, käfer: 0.5, stahl: 2 },
    flug: { pflanze: 2, kampf: 2, käfer: 2, elektro: 0.5, gestein: 0.5, stahl: 0.5 },
    psycho: { kampf: 2, gift: 2, psycho: 0.5, käfer: 0.5, geist: 0, stahl: 0.5, unlicht: 0 },
    käfer: { pflanze: 2, kampf: 0.5, gift: 2, flug: 0.5, psycho: 2, geist: 0.5, feuer: 0.5, stahl: 0.5, unlicht: 2 },
    gestein: { feuer: 2, eis: 2, kampf: 0.5, boden: 0.5, flug: 2, käfer: 2, stahl: 0.5 },
    geist: { normal: 0, psycho: 2, geist: 2, kampf: 0, unlicht: 0.5, stahl: 0.5 },
    drache: { drache: 2, stahl: 0.5 },
    unlicht: { psycho: 2, geist: 2, kampf: 0.5, unlicht: 0.5, stahl: 0.5 },
    stahl: { feuer: 0.5, wasser: 0.5, elektro: 0.5, eis: 2, gestein: 2, stahl: 0.5, fee: 2 },
    fee: { kampf: 2, drache: 2, gift: 0.5, stahl: 0.5, feuer: 0.5 }
};

function getTypeMultiplier(moveType, defenderTypes) {
    let mult = 1;
    const mt = moveType?.toLowerCase();
    if (!mt || !defenderTypes) return mult;
    for (const dt of defenderTypes) {
        const dl = dt.toLowerCase();
        if (typeEffectiveness[mt] && typeEffectiveness[mt][dl] !== undefined) mult *= typeEffectiveness[mt][dl];
    }
    return mult;
}

// Item Type Boost Map
const itemTypeBoostMap = {
    'Schwarzgurt': 'kampf', 'Schwarze Brille': 'unlicht', 'Holzkohle': 'feuer', 'Magnet': 'elektro',
    'Metallmantel': 'stahl', 'Wunderkern': 'pflanze', 'Mystikwasser': 'wasser', 'Niemals-Eis': 'eis',
    'Giftstich': 'gift', 'Spitzschnabel': 'flug', 'Seidenschal': 'normal', 'Silberstaub': 'käfer',
    'Weicher Sand': 'boden', 'Spuktafel': 'geist', 'Zauberlöffel': 'psycho', 'Seegesang': 'wasser'
};

function getItemTypeBoost(item, moveType) {
    if (!item || !moveType) return 1.0;
    const boostedType = itemTypeBoostMap[item.name];
    if (boostedType && moveType.toLowerCase() === boostedType) return 1.2;
    return 1.0;
}

// --- Schadensberechnung ---
function calculateDamage(attacker, defender, move, level) {
    const movePower = move.Stärke;
    let accuracy = move['Genauigkeit in %'];
    const accStage = getCurrentAccuracyStage(attacker);
    let accMult = getAccuracyMultiplier(accStage);
    if (defender.item && defender.item.name === 'Blendpuder') {
        accMult *= 0.9;
    }
    if (typeof accuracy === 'number' && accuracy < 100) {
        const effectiveAcc = Math.min(100, accuracy * accMult);
        if (Math.random() * 100 > effectiveAcc) return { damage: 0, hit: false, message: 'verfehlt!' };
    }
    if (movePower === 'K.O.') {
        const koChance = typeof accuracy === 'number' ? accuracy : 30;
        if (Math.random() * 100 <= koChance) return { damage: defender.currentHp, hit: true, ko: true, message: 'K.O.-Treffer!' };
        return { damage: 0, hit: false, message: 'verfehlt!' };
    }
    let effectivePower = 0;
    if (typeof movePower === 'number') effectivePower = movePower;
    else if (typeof movePower === 'string') {
        if (movePower.includes('Level')) effectivePower = level;
        else if (movePower.includes('Gewicht')) effectivePower = 60;
        else if (movePower.includes('Superzahn')) effectivePower = Math.max(1, Math.floor(defender.currentHp / 2));
        else if (movePower.includes('Psywelle')) effectivePower = 20 + Math.floor(Math.random() * 81);
        else if (movePower.includes('KP')) { const m = movePower.match(/(\d+)/); effectivePower = m ? parseInt(m[1]) : 40; }
        else effectivePower = 50;
    }
    if (effectivePower <= 0) return { damage: 0, hit: true, message: 'kein Schaden' };
    const cat = (move.Kategorie || '').toLowerCase();
    let attackStat, defenseStat;
    if (cat === 'spezial') {
        attackStat = getBoostedStat(attacker.spa, attacker.boosts?.spez || 0, attacker, 'spa');
        defenseStat = getBoostedStat(defender.spd, defender.boosts?.spez || 0, defender, 'spd');
    } else {
        attackStat = getBoostedStat(attacker.atk, attacker.boosts?.atk || 0, attacker, 'atk');
        defenseStat = getBoostedStat(defender.def, defender.boosts?.def || 0, defender, 'def');
    }
    let damage = Math.floor((((2 * level / 5 + 2) * effectivePower * attackStat / defenseStat) / 50) + 2);
    const critChance = getCritChance(attacker);
    const isCritical = Math.random() < critChance;
    if (isCritical) damage = Math.floor(damage * 1.8);
    const typeMult = getTypeMultiplier(move.Typ, defender.types);
    damage = Math.floor(damage * typeMult);
    if (attacker.types.map(t => t.toLowerCase()).includes((move.Typ || '').toLowerCase())) damage = Math.floor(damage * 1.5);
    const itemBoost = getItemTypeBoost(attacker.item, move.Typ);
    damage = Math.floor(damage * itemBoost);
    let screenActive = false;
    const sideDef = (defender === battleState?.player) ? 'playerSide' : 'enemySide';
    if (battleState) {
        if (cat === 'spezial' && battleState[sideDef]?.lightScreen > 0) screenActive = true;
        if (cat === 'physisch' && battleState[sideDef]?.reflect > 0) screenActive = true;
    }
    if (screenActive) damage = Math.floor(damage / 2);
    if (battleState && battleState.weather) {
        const w = battleState.weather;
        if (w.type === 'rain' && (move.Typ?.toLowerCase() === 'wasser')) damage = Math.floor(damage * 1.5);
        if (w.type === 'rain' && (move.Typ?.toLowerCase() === 'feuer')) damage = Math.floor(damage * 0.5);
        if (w.type === 'sun' && (move.Typ?.toLowerCase() === 'feuer')) damage = Math.floor(damage * 1.5);
        if (w.type === 'sun' && (move.Typ?.toLowerCase() === 'wasser')) damage = Math.floor(damage * 0.5);
    }
    damage = Math.floor(damage * (0.85 + Math.random() * 0.15));
    damage = Math.max(1, damage);
    let msg = `${damage} Schaden`;
    if (isCritical) msg = `Kritischer Treffer! ${msg}`;
    if (typeMult > 1.5) msg = `Sehr effektiv! ${msg}`;
    if (typeMult < 0.5 && typeMult > 0) msg = `Nicht sehr effektiv... ${msg}`;
    if (typeMult === 0) msg = `Keine Wirkung!`;
    return { damage, hit: true, critical: isCritical, typeMult, message: msg };
}

// --- UI-Hilfsfunktionen (Kampf) ---
function addBattleLog(icon, msg) {
    const log = document.getElementById('battleLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry log-info';
    entry.innerHTML = `<span>${icon} ${msg}</span>`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function getStatusIcon(status, confusion) {
    let html = '';
    if (status) {
        switch (status.type) {
            case 'sleep': html += '<i class="fas fa-moon status-icon-sleep" title="Schläft"></i>'; break;
            case 'paralyze': html += '<i class="fas fa-bolt status-icon-paralyze" title="Paralysiert"></i>'; break;
            case 'burn': html += '<i class="fas fa-fire status-icon-burn" title="Verbrennung"></i>'; break;
            case 'poison': html += '<i class="fas fa-skull status-icon-poison" title="Vergiftet"></i>'; break;
            case 'toxic': html += '<i class="fas fa-biohazard status-icon-toxic" title="Toxin"></i>'; break;
            case 'freeze': html += '<i class="fas fa-snowflake status-icon-freeze" title="Eingefroren"></i>'; break;
            default: html += '<i class="fas fa-question-circle"></i>';
        }
    }
    if (confusion) html += '<i class="fas fa-dizzy status-icon-confusion" title="Verwirrt"></i>';
    return html || '';
}

function updateStatusIcons() {
    if (!battleState) return;
    document.getElementById('playerStatusIcons').innerHTML = getStatusIcon(battleState.player.status, battleState.player.confusion);
    document.getElementById('enemyStatusIcons').innerHTML = getStatusIcon(battleState.enemy.status, battleState.enemy.confusion);
}

function setPokemonStatus(target, type) {
    if (target.status) return false;
    if (target.item) {
        if (target.item.name === 'Prunibeere (Lum Berry)') {
            addBattleLog('🍇', `${target.name} isst ${target.item.name} und heilt alle Statusveränderungen!`);
            target.item = null;
            updateItemDisplay(target === battleState.player ? 'playerItemDisplay' : 'enemyItemDisplay', target);
            return false;
        }
        const berryCures = {
            'sleep': 'Maronbeere (Chesto Berry)',
            'paralyze': 'Prunusbeere (Cheri Berry)',
            'poison': 'Pirsifbeere (Pecha Berry)',
            'toxic': 'Pirsifbeere (Pecha Berry)',
            'burn': 'Tsitrubeere (Rawst Berry)',
            'freeze': 'Fragiabeere (Aspear Berry)',
            'confusion': 'Persimbeere (Persim Berry)'
        };
        const cureBerry = berryCures[type];
        if (cureBerry && target.item.name === cureBerry) {
            addBattleLog('🍇', `${target.name} isst ${target.item.name} und wird von ${getStatusText(type)} geheilt!`);
            target.item = null;
            updateItemDisplay(target === battleState.player ? 'playerItemDisplay' : 'enemyItemDisplay', target);
            return false;
        }
    }
    target.status = { type };
    if (type === 'sleep') target.status.sleepTurns = Math.floor(Math.random() * 4) + 1;
    if (type === 'freeze') target.status.freezeTurns = Math.floor(Math.random() * 5) + 1;
    if (type === 'toxic') target.status.toxicCounter = 0;
    return true;
}

function healStatus(target) {
    if (target.status) { addBattleLog('💚', `${target.name} wurde von ${getStatusText(target.status.type)} geheilt.`); target.status = null; }
    if (target.confusion) { target.confusion = false; addBattleLog('💚', `${target.name} ist nicht mehr verwirrt.`); }
}

function getStatusText(type) { const t = { sleep:'Schlaf', paralyze:'Paralyse', poison:'Vergiftung', toxic:'Toxin', burn:'Verbrennung', freeze:'Einfrieren', confusion:'Verwirrung' }; return t[type] || type; }
function getStatusEmoji(type) { const e = { sleep:'💤', paralyze:'⚡', poison:'☠️', toxic:'☣️', burn:'🔥', freeze:'❄️', confusion:'🌀' }; return e[type] || ''; }

function getWeatherDamage(pokemon, weather) {
    if (!weather) return 0;
    if (weather.type === 'sandstorm') { const immune = ['gestein', 'boden', 'stahl']; if (!pokemon.types.some(t => immune.includes(t.toLowerCase()))) return Math.floor(pokemon.maxHp / 16); }
    if (weather.type === 'hail') { if (!pokemon.types.some(t => t.toLowerCase() === 'eis')) return Math.floor(pokemon.maxHp / 16); }
    return 0;
}

function updateItemDisplay(elementId, pokemon) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (pokemon.item) {
        const spriteUrl = getItemSpriteUrl(pokemon.item.name);
        el.innerHTML = `<img src="${spriteUrl}" title="${pokemon.item.name}" alt="${pokemon.item.name}" class="battle-item-icon">`;
    } else {
        el.innerHTML = '';
    }
}

function checkAutomaticBerry(pokemon, side) {
    if (!pokemon.item || pokemon.currentHp <= 0) return;
    const hpPercent = pokemon.currentHp / pokemon.maxHp;
    const item = pokemon.item;
    const sideName = side === 'player' ? 'playerItemDisplay' : 'enemyItemDisplay';

    if (hpPercent <= 0.25) {
        const pinchBerries = {
            'Apikobeere (Apicot Berry)': { stat: 'spez', stage: 1 },
            'Ganlobeere (Ganlon Berry)': { stat: 'def', stage: 1 },
            'Lydzibeere (Liechi Berry)': { stat: 'atk', stage: 1 },
            'Petayabeere (Petaya Berry)': { stat: 'spez', stage: 1 },
            'Sternfbeere (Starf Berry)': { stat: 'random', stage: 2 },
            'Lansatbeere (Lansat Berry)': { effect: 'critUp' }
        };
        if (pinchBerries[item.name]) {
            const b = pinchBerries[item.name];
            addBattleLog('🍇', `${pokemon.name} aktiviert ${item.name}!`);
            if (b.stat === 'random') {
                const stats = ['atk', 'def', 'spe', 'spez'];
                const randomStat = stats[Math.floor(Math.random() * stats.length)];
                modifyBoost(pokemon, randomStat, b.stage);
            } else if (b.effect === 'critUp') {
                pokemon.criticalUp = true;
                addBattleLog('🎯', `${pokemon.name}s Volltrefferquote wurde stark erhöht!`);
            } else {
                modifyBoost(pokemon, b.stat, b.stage);
            }
            pokemon.item = null;
            updateItemDisplay(sideName, pokemon);
            return;
        }
    }

    if (hpPercent <= 0.5 && item.name === 'Orangbeere (Oran Berry)') {
        pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + 10);
        addBattleLog('🍇', `${pokemon.name} isst Orangbeere und heilt 10 KP!`);
        pokemon.item = null;
        updateItemDisplay(sideName, pokemon);
        return;
    }

    if (hpPercent <= 0.5 && item.name === 'Sinelbeere (Sitrus Berry)') {
        const heal = Math.floor(pokemon.maxHp / 4);
        pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + heal);
        addBattleLog('🍇', `${pokemon.name} isst Sinelbeere und heilt ${heal} KP!`);
        pokemon.item = null;
        updateItemDisplay(sideName, pokemon);
        return;
    }

    const healBerries = ['Amrenabeere (Aguav Berry)', 'Figybeere (Figy Berry)', 'Yapabeere (Iapapa Berry)', 'Magobeere (Mago Berry)', 'Wikibeere (Wiki Berry)'];
    if (hpPercent <= 0.5 && healBerries.includes(item.name)) {
        const heal = Math.floor(pokemon.maxHp / 8);
        pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + heal);
        addBattleLog('🍇', `${pokemon.name} isst ${item.name} und heilt ${heal} KP!`);
        pokemon.item = null;
        updateItemDisplay(sideName, pokemon);
    }
}

function handlePreTurnStatus(pokemon, side) {
    if (!pokemon.status && !pokemon.confusion && !pokemon.leechSeed && !(pokemon.bind && pokemon.bind.turnsLeft > 0)) return true;
    let canAct = true;
    if (pokemon.status) {
        const status = pokemon.status;
        if (status.type === 'sleep') {
            status.sleepTurns--;
            if (status.sleepTurns <= 0) { addBattleLog('💤', `${pokemon.name} ist aufgewacht!`); pokemon.status = null; updateStatusIcons(); }
            else { addBattleLog('💤', `${pokemon.name} schläft! (${status.sleepTurns} Runde(n) übrig)`); canAct = false; }
        }
        if (status.type === 'freeze') {
            if (Math.random() < 0.2 || (status.freezeTurns && status.freezeTurns <= 0)) { addBattleLog('❄️', `${pokemon.name} ist aufgetaut!`); pokemon.status = null; updateStatusIcons(); }
            else { addBattleLog('❄️', `${pokemon.name} ist eingefroren!`); if (status.freezeTurns) status.freezeTurns--; canAct = false; }
        }
        if (status.type === 'paralyze' && canAct && Math.random() < 0.25) { addBattleLog('⚡', `${pokemon.name} ist paralysiert und kann nicht angreifen!`); canAct = false; }
    }
    if (pokemon.confusion && canAct) {
        pokemon.confusionTurns = (pokemon.confusionTurns || 3) - 1;
        if (pokemon.confusionTurns <= 0) { pokemon.confusion = false; addBattleLog('🌀', `${pokemon.name} ist nicht mehr verwirrt.`); }
        else {
            addBattleLog('🌀', `${pokemon.name} ist verwirrt!`);
            if (Math.random() < 0.5) {
                const dmg = Math.floor(pokemon.maxHp / 8);
                pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
                addBattleLog('🌀', `${pokemon.name} verletzt sich selbst und verliert ${dmg} KP!`);
                const s = side === 'player' ? ['battlePlayerHPBar', 'battlePlayerHPText'] : ['battleEnemyHPBar', 'battleEnemyHPText'];
                updateHPBar(s[0], s[1], pokemon.currentHp, pokemon.maxHp);
                if (pokemon.currentHp <= 0) { endBattle(side === 'player' ? 'enemy' : 'player'); return false; }
                canAct = false;
            }
        }
    }
    if (pokemon.status && (pokemon.status.type === 'burn' || pokemon.status.type === 'poison' || pokemon.status.type === 'toxic')) {
        let damage = 0;
        if (pokemon.status.type === 'poison') damage = Math.floor(pokemon.maxHp / 8);
        else if (pokemon.status.type === 'burn') damage = Math.floor(pokemon.maxHp / 16);
        else if (pokemon.status.type === 'toxic') { pokemon.status.toxicCounter = (pokemon.status.toxicCounter || 0) + 1; damage = Math.floor(pokemon.maxHp * pokemon.status.toxicCounter / 16); }
        pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
        const emoji = pokemon.status.type === 'burn' ? '🔥' : (pokemon.status.type === 'toxic' ? '☣️' : '☠️');
        addBattleLog(emoji, `${pokemon.name} leidet unter ${getStatusText(pokemon.status.type)} und verliert ${damage} KP!`);
        const s = side === 'player' ? ['battlePlayerHPBar', 'battlePlayerHPText'] : ['battleEnemyHPBar', 'battleEnemyHPText'];
        updateHPBar(s[0], s[1], pokemon.currentHp, pokemon.maxHp);
        if (pokemon.currentHp <= 0) { endBattle(side === 'player' ? 'enemy' : 'player'); return false; }
    }
    if (pokemon.leechSeed && canAct) {
        const drain = Math.floor(pokemon.maxHp / 8);
        pokemon.currentHp = Math.max(0, pokemon.currentHp - drain);
        const drainer = pokemon.leechSeed.drainer;
        drainer.currentHp = Math.min(drainer.maxHp, drainer.currentHp + drain);
        addBattleLog('🌱', `${pokemon.name} verliert ${drain} KP durch Egelsamen! ${drainer.name} heilt ${drain} KP.`);
        updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
        updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
        if (pokemon.currentHp <= 0) { endBattle(side === 'player' ? 'enemy' : 'player'); return false; }
    }
    if (pokemon.bind && pokemon.bind.turnsLeft > 0 && canAct) {
        const dmg = Math.floor(pokemon.maxHp * pokemon.bind.damageFraction);
        pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
        addBattleLog('🌀', `${pokemon.name} ist umklammert und verliert ${dmg} KP!`);
        pokemon.bind.turnsLeft--;
        if (pokemon.bind.turnsLeft <= 0) delete pokemon.bind;
        const s = side === 'player' ? ['battlePlayerHPBar', 'battlePlayerHPText'] : ['battleEnemyHPBar', 'battleEnemyHPText'];
        updateHPBar(s[0], s[1], pokemon.currentHp, pokemon.maxHp);
        if (pokemon.currentHp <= 0) { endBattle(side === 'player' ? 'enemy' : 'player'); return false; }
        canAct = false;
    }
    return canAct;
}

function modifyBoost(target, stat, delta) {
    if (!target.boosts) target.boosts = { atk: 0, def: 0, spe: 0, spez: 0 };
    if (target.item && target.item.name === 'Weißkraut' && delta < 0) {
        addBattleLog('🍃', `${target.name} nutzt Weißkraut und widersteht der Senkung!`);
        target.item = null;
        updateItemDisplay(target === battleState.player ? 'playerItemDisplay' : 'enemyItemDisplay', target);
        return;
    }
    if (target.mistActive && delta < 0) { addBattleLog('🌫️', `Weißnebel schützt ${target.name} vor Status-Senkungen!`); return; }
    const old = target.boosts[stat] || 0;
    const next = Math.max(-6, Math.min(6, old + delta));
    if (next === old) return;
    target.boosts[stat] = next;
    const dir = next > old ? 'steigt' : 'sinkt';
    const labels = { atk: 'Angriff', def: 'Verteidigung', spe: 'Initiative', spez: 'Genauigkeit/Fluchtwert' };
    addBattleLog('↕️', `${target.name} ${labels[stat]} ${dir} um ${Math.abs(delta)} Stufe(n)! (jetzt ${next>0?'+'+next:next})`);
    updateBoostDisplay();
}

function applyStatusMove(user, target, move, effect) {
    if (!effect || !effect.statusMove) return;
    const sMove = effect.statusMove;
    const tgt = effect.target === 'self' ? user : target;
    addBattleLog('✨', `${user.name} setzt ${move.Name} ein.`);
    if (sMove === 'protect') {
        if (user.lastUsedMove && user.lastUsedMove.ID === move.ID && user.protectSuccessive) {
            const successChance = 1 / Math.pow(3, user.protectCount || 1);
            if (Math.random() > successChance) { addBattleLog('🛡️', 'Schutzschild schlug fehl!'); user.protectCount = (user.protectCount || 1) + 1; user.protectSuccessive = true; return; }
        }
        user.isProtected = true;
        user.protectCount = (user.protectSuccessive ? (user.protectCount || 1) + 1 : 1);
        user.protectSuccessive = true;
        addBattleLog('🛡️', `${user.name} schützt sich!`);
        return;
    }
    user.protectSuccessive = false;
    if (sMove === 'substitute') {
        const cost = Math.floor(user.maxHp / 4);
        if (user.currentHp <= cost || user.substituteHP > 0) { addBattleLog('⚠️', 'Nicht genug KP oder Delegator bereits aktiv!'); return; }
        user.currentHp -= cost; user.substituteHP = cost; user.substituteMaxHP = cost;
        addBattleLog('🛡️', `${user.name} opfert ${cost} KP für einen Delegator!`);
        updateSubstituteBar(user);
        updateHPBar(user === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', user === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', user.currentHp, user.maxHp);
        return;
    }
    if (sMove === 'heal' && effect.healStatus) {
        const oldHp = user.currentHp; user.currentHp = user.maxHp; const healed = user.maxHp - oldHp;
        healStatus(user); addBattleLog('💚', `${user.name} wurde vollständig geheilt! (+${healed} KP)`);
        setPokemonStatus(user, 'sleep'); user.status.sleepTurns = 2;
        addBattleLog('💤', `${user.name} schläft für 2 Runden!`);
        updateHPBar(user === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', user === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', user.currentHp, user.maxHp);
        updateStatusIcons();
        return;
    }
    if (sMove === 'heal' || effect.healPercent) {
        const healAmount = Math.floor(user.maxHp * ((effect.healPercent || 50) / 100));
        const oldHp = user.currentHp; user.currentHp = Math.min(user.maxHp, user.currentHp + healAmount);
        addBattleLog('💚', `${user.name} setzt ${move.Name} ein und heilt ${user.currentHp - oldHp} KP.`);
        updateHPBar(user === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', user === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', user.currentHp, user.maxHp);
        return;
    }
    if (sMove === 'roar') { addBattleLog('🦁', `Brüller! ${target.name} flieht! Der Kampf ist beendet.`); endBattle(user === battleState.player ? 'player' : 'enemy'); return; }
    if (sMove === 'teleport') { addBattleLog('💨', `${user.name} setzt Teleport ein und beendet den Kampf!`); endBattle(user === battleState.player ? 'enemy' : 'player'); return; }
    if (sMove === 'transform') {
        user.types = [...target.types]; user.atk = target.atk; user.def = target.def; user.spa = target.spa; user.spd = target.spd; user.spe = target.spe; user.nr = target.nr;
        user.boosts = { atk: 0, def: 0, spe: 0, spez: 0 }; user.moves = target.moves.map(m => ({ ...m })); user.movePP = new Array(user.moves.length).fill(5);
        addBattleLog('🔄', `${user.name} verwandelt sich in ${target.name}!`);
        renderBattleUI();
        return;
    }
    if (sMove === 'conversion') {
        if (user.moves.length > 0) { const randomMove = user.moves[Math.floor(Math.random() * user.moves.length)]; const newType = randomMove.Typ; user.types = [newType]; addBattleLog('🔄', `${user.name} ändert seinen Typ zu ${newType}!`); renderBattleUI(); }
        return;
    }
    if (sMove === 'mimic') {
        if (target.moves.length > 0) {
            const randomMove = target.moves[Math.floor(Math.random() * target.moves.length)];
            const emptySlot = user.moves.findIndex((m, i) => user.movePP[i] <= 0 || m.ID === '165');
            if (emptySlot >= 0) { user.moves[emptySlot] = { ...randomMove }; user.movePP[emptySlot] = randomMove.AP || 5; }
            else { const replaceIdx = Math.floor(Math.random() * 4); user.moves[replaceIdx] = { ...randomMove }; user.movePP[replaceIdx] = randomMove.AP || 5; }
            addBattleLog('🐒', `${user.name} kopiert ${randomMove.Name} von ${target.name}!`);
            if (user === battleState.player) renderMoveButtons();
        }
        return;
    }
    if (sMove === 'disable') {
        if (target.lastUsedMoveIndex !== undefined && target.lastUsedMoveIndex >= 0) { target.disabledMoveIndex = target.lastUsedMoveIndex; target.disabledTurns = Math.floor(Math.random() * 4) + 2; addBattleLog('🚫', `${target.name}s Attacke ${target.moves[target.lastUsedMoveIndex]?.Name} wurde deaktiviert!`); }
        return;
    }
    if (sMove === 'leechSeed') { if (target.leechSeed) { addBattleLog('🌱', `${target.name} ist bereits von Egelsamen betroffen!`); return; } target.leechSeed = { drainer: user }; addBattleLog('🌱', `${target.name} wurde mit Egelsamen bepflanzt!`); updateSeedIndicators(); return; }
    if (sMove === 'mist') { user.mistActive = true; user.mistTurns = 5; addBattleLog('🌫️', `${user.name} ist von Weißnebel umgeben! (Status-Senkungen verhindert)`); return; }
    if (sMove === 'lightScreen') { const side = user === battleState.player ? 'playerSide' : 'enemySide'; battleState[side].lightScreen = 5; addBattleLog('🛡️', `Lichtschild aktiv! (Spezial-Schaden halbiert für 5 Runden)`); return; }
    if (sMove === 'reflect') { const side = user === battleState.player ? 'playerSide' : 'enemySide'; battleState[side].reflect = 5; addBattleLog('🛡️', `Reflektor aktiv! (Physischer Schaden halbiert für 5 Runden)`); return; }
    if (sMove === 'haze') {
        battleState.player.boosts = { atk: 0, def: 0, spe: 0, spez: 0 }; battleState.enemy.boosts = { atk: 0, def: 0, spe: 0, spez: 0 };
        battleState.player.mistActive = false; battleState.enemy.mistActive = false;
        battleState.playerSide.lightScreen = 0; battleState.playerSide.reflect = 0;
        battleState.enemySide.lightScreen = 0; battleState.enemySide.reflect = 0;
        addBattleLog('🌫️', 'Dunkelnebel! Alle Statuswerte wurden zurückgesetzt!');
        updateBoostDisplay();
        return;
    }
    if (sMove === 'metronome') { battleState._metronomeUser = user; battleState._metronomeTarget = target; battleState.isPlayerTurn = false; openMetronomeSelection(); return; }
    if (sMove === 'mirrorMove') {
        if (target.lastUsedMove && target.lastUsedMove.Kategorie !== 'Status') {
            const copiedMove = { ...target.lastUsedMove };
            addBattleLog('🪞', `Spiegeltrick kopiert: ${copiedMove.Name}!`);
            const res = calculateDamage(user, target, copiedMove, user.level);
            if (res.hit) { target.currentHp = Math.max(0, target.currentHp - res.damage); addBattleLog('⚔️', `${res.message}`); }
        } else addBattleLog('🪞', 'Spiegeltrick schlug fehl! Keine Attacke zum kopieren.');
        updateHPBar(target === battleState.player ? 'battlePlayerHPBar' : 'battleEnemyHPBar', target === battleState.player ? 'battlePlayerHPText' : 'battleEnemyHPText', target.currentHp, target.maxHp);
        return;
    }
    if (sMove === 'sandstorm') { battleState.weather = { type: 'sandstorm', turnsLeft: 5 }; addBattleLog('🏜️', 'Ein Sandsturm tobt! (5 Runden)'); updateWeatherDisplay(); return; }
    if (sMove === 'raindance') { battleState.weather = { type: 'rain', turnsLeft: 5 }; addBattleLog('🌧️', 'Es regnet! (5 Runden)'); updateWeatherDisplay(); return; }
    if (sMove === 'sunnyday') { battleState.weather = { type: 'sun', turnsLeft: 5 }; addBattleLog('☀️', 'Die Sonne brennt! (5 Runden)'); updateWeatherDisplay(); return; }
    if (sMove === 'hail') { battleState.weather = { type: 'hail', turnsLeft: 5 }; addBattleLog('🌨️', 'Ein Hagelsturm tobt! (5 Runden)'); updateWeatherDisplay(); return; }
    if (sMove === 'accuracyDown') { modifyBoost(tgt, 'spez', -(effect.stages || 1)); return; }
    if (sMove === 'splash') { addBattleLog('💦', `${user.name} platschert hilflos! Nichts passiert.`); return; }
    if (sMove === 'criticalUp') { user.criticalUp = true; addBattleLog('🎯', `${user.name}s Volltrefferquote wurde erhöht! (25% Krit)`); updateCritInfo(); return; }
    if (sMove === 'evasionUp') { modifyBoost(tgt, 'spez', effect.stages || 1); return; }
    const statBoosts = { attackUp: { stat: 'atk', delta: effect.stages || 1 }, attackDown: { stat: 'atk', delta: -(effect.stages || 1) }, defenseUp: { stat: 'def', delta: effect.stages || 1 }, defenseDown: { stat: 'def', delta: -(effect.stages || 1) }, speedUp: { stat: 'spe', delta: effect.stages || 1 }, speedDown: { stat: 'spe', delta: -(effect.stages || 1) }, specialUp: { stat: 'spez', delta: effect.stages || 1 }, specialDown: { stat: 'spez', delta: -(effect.stages || 1) } };
    if (statBoosts[sMove]) { modifyBoost(tgt, statBoosts[sMove].stat, statBoosts[sMove].delta); return; }
    const statusMap = { sleep: true, paralyze: true, poison: true, burn: true, freeze: true, toxic: true };
    if (sMove === 'confusion') { if (!tgt.confusion) { tgt.confusion = true; tgt.confusionTurns = Math.floor(Math.random() * 3) + 2; addBattleLog('🌀', `${tgt.name} ist verwirrt!`); updateStatusIcons(); } return; }
    if (statusMap[sMove]) { if (setPokemonStatus(tgt, sMove)) { addBattleLog(getStatusEmoji(sMove), `${tgt.name} ist ${getStatusText(sMove)}!`); updateStatusIcons(); } }
}

function applySecondaryEffect(target, effectType) {
    if (effectType === 'confusion') { if (!target.confusion) { target.confusion = true; target.confusionTurns = Math.floor(Math.random() * 3) + 2; addBattleLog('🌀', `${target.name} ist verwirrt!`); updateStatusIcons(); } return; }
    if (effectType === 'flinch') { target.flinch = true; addBattleLog('😵', `${target.name} zuckt zurück!`); return; }
    const statusMap = { burn: true, paralyze: true, poison: true, freeze: true, sleep: true };
    if (statusMap[effectType]) { if (setPokemonStatus(target, effectType)) { addBattleLog(getStatusEmoji(effectType), `${target.name} ist ${getStatusText(effectType)}!`); updateStatusIcons(); } return; }
    if (effectType === 'defenseDown') modifyBoost(target, 'def', -1);
    else if (effectType === 'attackDown') modifyBoost(target, 'atk', -1);
    else if (effectType === 'speedDown') modifyBoost(target, 'spe', -1);
    else if (effectType === 'specialDown') modifyBoost(target, 'spez', -1);
}

function thawTargetIfFireMove(target, moveType) {
    if (target.status && target.status.type === 'freeze' && moveType?.toLowerCase() === 'feuer') { target.status = null; addBattleLog('🔥', `${target.name} wurde durch Feuer aufgetaut!`); updateStatusIcons(); return true; }
    return false;
}

function applyShellBell(attacker, damage) {
    if (attacker.item && attacker.item.name === 'Muschelglocke') {
        const heal = Math.floor(damage / 8);
        if (heal > 0) {
            attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
            addBattleLog('🔔', `${attacker.name} heilt ${heal} KP durch Muschelglocke!`);
        }
    }
}

function applyEnigmaBerry(defender, typeMult) {
    if (defender.item && defender.item.name === 'Enigmabeere (Enigma Berry)' && typeMult > 1) {
        const heal = Math.floor(defender.maxHp / 4);
        defender.currentHp = Math.min(defender.maxHp, defender.currentHp + heal);
        addBattleLog('🍇', `${defender.name} isst Enigmabeere und heilt ${heal} KP!`);
        defender.item = null;
        updateItemDisplay(defender === battleState.player ? 'playerItemDisplay' : 'enemyItemDisplay', defender);
    }
}

function applyFocusBand(pokemon, side) {
    if (pokemon.item && pokemon.item.name === 'Fokusband' && pokemon.currentHp <= 0 && pokemon.maxHp > 1) {
        if (Math.random() < 0.1) {
            pokemon.currentHp = 1;
            addBattleLog('🎗️', `${pokemon.name} überlebt dank Fokusband mit 1 KP!`);
            pokemon.item = null;
            updateItemDisplay(side === 'player' ? 'playerItemDisplay' : 'enemyItemDisplay', pokemon);
            return true;
        }
    }
    return false;
}

function applyLeppaBerry(pokemon, side) {
    if (!pokemon.item || pokemon.item.name !== 'Leppabeere (Leppa Berry)') return false;
    for (let i = 0; i < pokemon.movePP.length; i++) {
        if (pokemon.movePP[i] < (pokemon.moves[i]?.AP || 0)) {
            pokemon.movePP[i] = Math.min(pokemon.movePP[i] + 10, pokemon.moves[i]?.AP || 0);
            addBattleLog('🍇', `${pokemon.name} isst Leppabeere und stellt AP von ${pokemon.moves[i]?.Name} wieder her!`);
            pokemon.item = null;
            updateItemDisplay(side === 'player' ? 'playerItemDisplay' : 'enemyItemDisplay', pokemon);
            return true;
        }
    }
    return false;
}

function applyQuickClaw(pokemon) {
    if (pokemon.item && pokemon.item.name === 'Schnellklaue') {
        return Math.random() < 0.2;
    }
    return false;
}

// --- UI-Update-Funktionen ---
function updateBoostDisplay() {
    if (!battleState) return;
    document.getElementById('battlePlayerBoosts').textContent = getBoostString(battleState.player.boosts);
    document.getElementById('battleEnemyBoosts').textContent = getBoostString(battleState.enemy.boosts);
    updateAccuracyInfo(); updateCritInfo();
}

function getBoostString(boosts) {
    if (!boosts) return '';
    const parts = [], l = { atk:'Ang', def:'Vert', spe:'Init', spez:'Gen/Flucht' };
    for (const k of ['atk','def','spe','spez']) if (boosts[k] !== 0) parts.push(`${l[k]} ${boosts[k]>0?'+'+boosts[k]:boosts[k]}`);
    return parts.length ? 'Boosts: '+parts.join(', ') : '';
}

function updateWeatherDisplay() {
    if (!battleState) return;
    const w = battleState.weather, el = document.getElementById('weatherDisplay');
    if (w && w.turnsLeft > 0) { const icons = { rain:'🌧️ Regen', sun:'☀️ Sonne', sandstorm:'🏜️ Sandsturm', hail:'🌨️ Hagel' }; el.innerHTML = `<span class="weather-indicator">${icons[w.type]||w.type} (${w.turnsLeft} Runden)</span>`; }
    else el.innerHTML = '';
}

function updateAccuracyInfo() {
    if (!battleState) return;
    const pAcc = getCurrentAccuracyStage(battleState.player), eAcc = getCurrentAccuracyStage(battleState.enemy);
    document.getElementById('battlePlayerAccuracy').textContent = `Genauigkeit: ${getAccuracyMultiplier(pAcc).toFixed(2)}x`;
    document.getElementById('battleEnemyAccuracy').textContent = `Genauigkeit: ${getAccuracyMultiplier(eAcc).toFixed(2)}x`;
}

function updateCritInfo() {
    if (!battleState) return;
    const pCrit = getCritChance(battleState.player), eCrit = getCritChance(battleState.enemy);
    document.getElementById('battlePlayerCrit').textContent = `Krit-Chance: ${(pCrit*100).toFixed(1)}%${battleState.player.criticalUp?' ⭐':''}`;
    document.getElementById('battleEnemyCrit').textContent = `Krit-Chance: ${(eCrit*100).toFixed(1)}%${battleState.enemy.criticalUp?' ⭐':''}`;
}

function updateHPBar(barId, textId, current, max) {
    const bar = document.getElementById(barId), text = document.getElementById(textId);
    const pct = Math.max(0, Math.min(100, (current/max)*100));
    bar.style.width = pct+'%'; text.textContent = `${current} / ${max}`;
    bar.classList.remove('low','mid'); if (pct<=25) bar.classList.add('low'); else if (pct<=50) bar.classList.add('mid');
}

function updateSubstituteBar(pokemon) {
    const isPlayer = pokemon === battleState?.player;
    const barContainer = document.getElementById(isPlayer?'playerSubstituteBar':'enemySubstituteBar');
    const barInner = document.getElementById(isPlayer?'playerSubHPBar':'enemySubHPBar');
    const barText = document.getElementById(isPlayer?'playerSubHPText':'enemySubHPText');
    if (pokemon.substituteHP > 0) { barContainer.style.display='block'; const pct = Math.max(0, Math.min(100, (pokemon.substituteHP/pokemon.substituteMaxHP)*100)); barInner.style.width = pct+'%'; barText.textContent = `Delegator: ${pokemon.substituteHP}/${pokemon.substituteMaxHP}`; }
    else barContainer.style.display='none';
}

function updateSeedIndicators() {
    if (!battleState) return;
    document.getElementById('playerSeedIndicator').textContent = battleState.player.leechSeed ? '🌱 Egelsamen' : '';
    document.getElementById('enemySeedIndicator').textContent = battleState.enemy.leechSeed ? '🌱 Egelsamen' : '';
}

window.sleep = ms => new Promise(r => setTimeout(r, ms));

// --- Pokéball-Anzeige (NEU: schwarze Bälle für besiegte) ---
window.getTeamBallDisplay = function(total, fainted) {
    const normalBall = getItemSpriteUrl('Pokéball');
    let html = '';
    for (let i = 0; i < total; i++) {
        const isFainted = i < fainted;
        const style = isFainted
            ? 'width:30px;height:30px;vertical-align:middle;margin-right:4px;filter:brightness(0.3) grayscale(100%);'
            : 'width:30px;height:30px;vertical-align:middle;margin-right:4px;';
        html += `<img src="${normalBall}" style="${style}">`;
    }
    return html;
};

// --- Kampfablauf (mit Team-Wechsel + Bild-/Namensupdate) ---
function endBattle(winner) {
    if (!battleState || battleState.battleOver) return;

    if (winner === 'player' && battleState.enemyTeam && battleState.enemyIndex < battleState.enemyTeam.length - 1) {
        // Nächstes Gegner-Pokémon
        battleState.enemyIndex++;
        const nextEnemy = battleState.enemyTeam[battleState.enemyIndex];
        battleState.enemy = nextEnemy;
        addBattleLog('🔄', `Der Trainer schickt ${nextEnemy.name} (Lv.${nextEnemy.level}) in den Kampf!`);

        // Bild, Name, Typen aktualisieren
        document.getElementById('battleEnemyName').textContent = `${nextEnemy.name} Lv.${nextEnemy.level}`;
        document.getElementById('battleEnemyImg').src = nextEnemy.isShiny ? getShinyImageUrl(nextEnemy.nr) : getPokemonImageUrl(nextEnemy.nr);
        document.getElementById('battleEnemyTypes').innerHTML = nextEnemy.types.map(t => `<span class="type-badge ${getTypeClass(t)}">${t}</span>`).join('');

        updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', nextEnemy.currentHp, nextEnemy.maxHp);
        updateSubstituteBar(nextEnemy);
        updateItemDisplay('enemyItemDisplay', nextEnemy);
        updateStatusIcons();
        updateBoostDisplay();
        updateAccuracyInfo();
        updateCritInfo();
        updateSeedIndicators();
        document.getElementById('battleResult').style.display = 'none';
        // Schwarze Bälle für besiegte Pokémon
        document.getElementById('enemyPartyDisplay').innerHTML = window.getTeamBallDisplay(
            battleState.enemyTeam.length,
            battleState.enemyIndex
        );
        battleState.isPlayerTurn = true;
        renderMoveButtons();
        return;
    }

    // Kampfende
    battleState.battleOver = true;
    battleState.isPlayerTurn = false;
    const resDiv = document.getElementById('battleResult');
    resDiv.style.display = 'block';
    resDiv.className = 'battle-result ' + (winner === 'player' ? 'win' : 'lose');
    resDiv.innerHTML = winner === 'player'
        ? `🎉 SIEG! ${battleState.player.name} gewinnt!`
        : `💔 NIEDERLAGE! ${battleState.player.name} wurde besiegt...`;
    document.getElementById('battleMoveButtons').innerHTML = '';
    updateStatusIcons();
    document.getElementById('enemyPartyDisplay').textContent = '';
}

window.closeBattle = function() { document.getElementById('battleOverlay').classList.remove('active'); battleState = null; };

function updateLevelLive() {
    if (!battleState || battleState.battleOver) return;
    const pl = parseInt(document.getElementById('playerLevelSlider').value), el = parseInt(document.getElementById('enemyLevelSlider').value);
    const pp = allPokemon.find(p => p.name === battleState.player.name), ep = allPokemon.find(p => p.name === battleState.enemy.name);
    if (pp) { const ns = getStatsForLevel(pp, pl); const r = battleState.player.currentHp / battleState.player.maxHp; Object.assign(battleState.player, ns); battleState.player.level = pl; battleState.player.maxHp = ns.hp; battleState.player.currentHp = Math.max(1, Math.floor(ns.hp * r)); }
    if (ep) { const ns = getStatsForLevel(ep, el); const r = battleState.enemy.currentHp / battleState.enemy.maxHp; Object.assign(battleState.enemy, ns); battleState.enemy.level = el; battleState.enemy.maxHp = ns.hp; battleState.enemy.currentHp = Math.max(1, Math.floor(ns.hp * r)); }
    renderBattleUI();
}

function determineTurnOrder(playerMove, enemyMove) {
    const playerPrio = playerMove?.Priorität || 0;
    const enemyPrio = enemyMove?.Priorität || 0;
    const playerQuick = applyQuickClaw(battleState.player);
    const enemyQuick = applyQuickClaw(battleState.enemy);
    if (playerQuick && !enemyQuick) return 'player';
    if (enemyQuick && !playerQuick) return 'enemy';
    if (playerPrio !== enemyPrio) return playerPrio > enemyPrio ? 'player' : 'enemy';
    const playerSpeed = getEffectiveSpeed(battleState.player);
    const enemySpeed = getEffectiveSpeed(battleState.enemy);
    if (playerSpeed !== enemySpeed) return playerSpeed > enemySpeed ? 'player' : 'enemy';
    return Math.random() < 0.5 ? 'player' : 'enemy';
}

async function executePlayerTurn(idx) {
    if (!battleState || battleState.battleOver || !battleState.isPlayerTurn) return;
    battleState.isPlayerTurn = false;
    document.getElementById('battleMoveButtons').innerHTML = '';
    const move = battleState.player.moves[idx];
    if (!move || battleState.player.movePP[idx] <= 0) { battleState.isPlayerTurn = true; renderMoveButtons(); return; }
    if (battleState.player.disabledMoveIndex === idx && battleState.player.disabledTurns > 0) {
        addBattleLog('🚫', 'Diese Attacke ist deaktiviert!');
        battleState.isPlayerTurn = true; renderMoveButtons(); return;
    }
    battleState.player.lastUsedMoveIndex = idx;
    battleState.player.lastUsedMove = move;
    const canAct = handlePreTurnStatus(battleState.player, 'player');
    if (!canAct) {
        updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
        updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
        updateSubstituteBar(battleState.player); updateSubstituteBar(battleState.enemy);
        if (battleState.battleOver) return;
        await sleep(500);
        executeEnemyTurnDirect();
        return;
    }
    const enemyAvail = battleState.enemy.moves.map((m,i)=>i).filter(i=>battleState.enemy.movePP[i]>0 && !(battleState.enemy.disabledMoveIndex===i && battleState.enemy.disabledTurns>0));
    const enemyMove = enemyAvail.length>0 ? battleState.enemy.moves[enemyAvail[Math.floor(Math.random()*enemyAvail.length)]] : getMoveById(165);
    const turnOrder = determineTurnOrder(move, enemyMove);
    if (turnOrder === 'player') {
        await executeSingleAction(battleState.player, battleState.enemy, move, idx, 'player');
        if (battleState.battleOver) return;
        await sleep(400);
        if (!battleState.battleOver && !battleState.enemy.flinch) {
            executeEnemyTurnDirect();
        } else if (battleState.enemy.flinch) {
            addBattleLog('😵', `${battleState.enemy.name} zuckt zurück und kann nicht angreifen!`);
            battleState.enemy.flinch = false;
            endTurnWrapup();
        }
    } else {
        battleState._pendingPlayerAction = { idx, move };
        executeEnemyTurnDirect();
    }
}

async function executeSingleAction(attacker, defender, move, moveIndex, side) {
    const effect = getMoveEffect(parseInt(move.ID));
    const cat = (move.Kategorie || '').toLowerCase();
    attacker.lastUsedMove = move; attacker.lastUsedMoveIndex = moveIndex;
    attacker.movePP[moveIndex]--;
    if (attacker.disabledTurns > 0) {
        attacker.disabledTurns--;
        if (attacker.disabledTurns <= 0) { attacker.disabledMoveIndex = -1; addBattleLog('✅', `${attacker.name}s Attacke ist wieder verfügbar!`); }
    }
    if (defender.isProtected && (effect?.statusMove !== 'protect')) {
        addBattleLog('🛡️', `${defender.name} hat sich geschützt! Kein Schaden.`);
        attacker.protectSuccessive = false;
        return;
    }
    defender.isProtected = false;
    if (effect && effect.protect) return;
    thawTargetIfFireMove(defender, move.Typ);
    let damageResult = { damage: 0, hit: false, message: '' };
    let totalDmg = 0;
    if (effect && effect.multiHit) {
        let hits = effect.multiHit[0] + Math.floor(Math.random()*(effect.multiHit[1]-effect.multiHit[0]+1));
        for (let h=0; h<hits; h++) {
            const res = calculateDamage(attacker, defender, move, attacker.level);
            if (res.hit) totalDmg += res.damage;
        }
        damageResult = { damage: totalDmg, hit: totalDmg > 0, message: `${hits} Treffer! ${totalDmg} Schaden.` };
    } else if (effect && effect.bind) {
        const res = calculateDamage(attacker, defender, move, attacker.level);
        if (res.hit) {
            totalDmg = res.damage;
            defender.bind = { turnsLeft: Math.floor(Math.random()*2)+4, damageFraction: 1/8 };
        }
        damageResult = res;
    } else if (cat === 'status' || (effect && effect.statusMove)) {
        applyStatusMove(attacker, defender, move, effect);
        updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
        updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
        updateSubstituteBar(battleState.player); updateSubstituteBar(battleState.enemy);
        if (battleState.player.currentHp <= 0) { endBattle('enemy'); return; }
        if (battleState.enemy.currentHp <= 0) { endBattle('player'); return; }
        return;
    } else {
        const res = calculateDamage(attacker, defender, move, attacker.level);
        damageResult = res;
        totalDmg = res.damage;
    }
    if (damageResult.hit && totalDmg > 0) {
        if (defender.substituteHP > 0) {
            const subDmg = Math.min(defender.substituteHP, totalDmg);
            defender.substituteHP -= subDmg;
            const remainingDmg = totalDmg - subDmg;
            if (remainingDmg > 0) defender.currentHp = Math.max(0, defender.currentHp - remainingDmg);
            addBattleLog('🛡️', `Delegator absorbiert ${subDmg} Schaden! ${remainingDmg>0?remainingDmg+' Schaden geht durch.':''}`);
            if (defender.substituteHP <= 0) { addBattleLog('💨', 'Der Delegator wurde zerstört!'); defender.substituteHP = 0; }
            updateSubstituteBar(defender);
        } else {
            defender.currentHp = Math.max(0, defender.currentHp - totalDmg);
        }
        addBattleLog('⚔️', `${attacker.name} setzt ${move.Name} ein: ${damageResult.message}`);
        applyEnigmaBerry(defender, damageResult.typeMult);
        applyShellBell(attacker, totalDmg);
        if (effect?.secondary && Math.random()*100 < effect.secondary.chance) applySecondaryEffect(defender, effect.secondary.effect);
        if (effect?.recoilPercent) { const r = Math.floor(totalDmg * effect.recoilPercent / 100); attacker.currentHp = Math.max(0, attacker.currentHp - r); addBattleLog('↩️', `Rückstoß! ${r} Schaden.`); }
        if (effect?.healPercent) { const h = Math.floor(totalDmg * effect.healPercent / 100); attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + h); addBattleLog('💚', `Absorbiert ${h} KP.`); }
    } else {
        addBattleLog('💨', `${move.Name} verfehlt!`);
    }
    updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
    updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
    updateSubstituteBar(battleState.player); updateSubstituteBar(battleState.enemy);
    if (battleState.player.currentHp <= 0) {
        if (applyFocusBand(battleState.player, 'player')) {
            updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
        } else {
            endBattle('enemy'); return;
        }
    }
    if (battleState.enemy.currentHp <= 0) {
        if (applyFocusBand(battleState.enemy, 'enemy')) {
            updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
        } else {
            endBattle('player'); return;
        }
    }
    checkAutomaticBerry(attacker, side);
    checkAutomaticBerry(defender, side === 'player' ? 'enemy' : 'player');
}

async function executeEnemyTurnDirect() {
    if (!battleState || battleState.battleOver) return;
    if (battleState._metronomeUser) return;
    if (battleState._pendingPlayerAction) {
        const pa = battleState._pendingPlayerAction; battleState._pendingPlayerAction = null;
        const canAct = handlePreTurnStatus(battleState.enemy, 'enemy');
        if (!canAct) {
            updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
            updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
            if (battleState.battleOver) return;
        } else {
            const enemyAvail = battleState.enemy.moves.map((m,i)=>i).filter(i=>battleState.enemy.movePP[i]>0 && !(battleState.enemy.disabledMoveIndex===i && battleState.enemy.disabledTurns>0));
            const enemyIdx = enemyAvail.length>0 ? enemyAvail[Math.floor(Math.random()*enemyAvail.length)] : -1;
            if (enemyIdx >= 0) {
                const enemyMove = battleState.enemy.moves[enemyIdx]; battleState.enemy.lastUsedMove = enemyMove; battleState.enemy.lastUsedMoveIndex = enemyIdx;
                await executeSingleAction(battleState.enemy, battleState.player, enemyMove, enemyIdx, 'enemy');
            }
        }
        if (battleState.battleOver) return;
        await sleep(400);
        const pCanAct = handlePreTurnStatus(battleState.player, 'player');
        if (!pCanAct) {
            updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
            updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
            if (battleState.battleOver) return;
            endTurnWrapup();
        } else if (battleState.player.flinch) {
            addBattleLog('😵', `${battleState.player.name} zuckt zurück und kann nicht angreifen!`);
            battleState.player.flinch = false;
            endTurnWrapup();
        } else {
            await executeSingleAction(battleState.player, battleState.enemy, pa.move, pa.idx, 'player');
            if (battleState.battleOver) return;
            endTurnWrapup();
        }
        return;
    }
    const canAct = handlePreTurnStatus(battleState.enemy, 'enemy');
    if (!canAct) {
        updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
        updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
        updateSubstituteBar(battleState.player); updateSubstituteBar(battleState.enemy);
        if (battleState.battleOver) return;
        endTurnWrapup();
        return;
    }
    const available = battleState.enemy.moves.map((m,i)=>i).filter(i=>battleState.enemy.movePP[i]>0 && !(battleState.enemy.disabledMoveIndex===i && battleState.enemy.disabledTurns>0));
    if (available.length === 0) { endTurnWrapup(); return; }
    const idx = available[Math.floor(Math.random()*available.length)];
    const move = battleState.enemy.moves[idx];
    await executeSingleAction(battleState.enemy, battleState.player, move, idx, 'enemy');
    if (battleState.battleOver) return;
    endTurnWrapup();
}

function endTurnWrapup() {
    if (!battleState || battleState.battleOver) return;
    if (battleState.playerSide.lightScreen > 0) battleState.playerSide.lightScreen--;
    if (battleState.playerSide.reflect > 0) battleState.playerSide.reflect--;
    if (battleState.enemySide.lightScreen > 0) battleState.enemySide.lightScreen--;
    if (battleState.enemySide.reflect > 0) battleState.enemySide.reflect--;
    if (battleState.player.mistTurns > 0) { battleState.player.mistTurns--; if (battleState.player.mistTurns <= 0) { battleState.player.mistActive = false; addBattleLog('🌫️', 'Weißnebel von ' + battleState.player.name + ' hat sich aufgelöst.'); } }
    if (battleState.enemy.mistTurns > 0) { battleState.enemy.mistTurns--; if (battleState.enemy.mistTurns <= 0) { battleState.enemy.mistActive = false; addBattleLog('🌫️', 'Weißnebel von ' + battleState.enemy.name + ' hat sich aufgelöst.'); } }
    if (battleState.player.protectSuccessive && !battleState.player.isProtected) battleState.player.protectSuccessive = false;
    if (battleState.enemy.protectSuccessive && !battleState.enemy.isProtected) battleState.enemy.protectSuccessive = false;
    battleState.player.isProtected = false; battleState.enemy.isProtected = false;
    if (battleState.weather) {
        battleState.weather.turnsLeft--;
        if (battleState.weather.turnsLeft <= 0) { addBattleLog('🌤️', `Das Wetter hat sich beruhigt.`); battleState.weather = null; }
        updateWeatherDisplay();
    }
    if (battleState.weather) {
        const pDmg = getWeatherDamage(battleState.player, battleState.weather);
        const eDmg = getWeatherDamage(battleState.enemy, battleState.weather);
        if (pDmg > 0) { battleState.player.currentHp = Math.max(0, battleState.player.currentHp - pDmg); addBattleLog('💨', `${battleState.player.name} nimmt ${pDmg} Wetterschaden.`); }
        if (eDmg > 0) { battleState.enemy.currentHp = Math.max(0, battleState.enemy.currentHp - eDmg); addBattleLog('💨', `${battleState.enemy.name} nimmt ${eDmg} Wetterschaden.`); }
    }
    if (battleState.player.item && battleState.player.item.name === 'Überreste') {
        const heal = Math.floor(battleState.player.maxHp / 16);
        battleState.player.currentHp = Math.min(battleState.player.maxHp, battleState.player.currentHp + heal);
        addBattleLog('🔄', `${battleState.player.name} heilt ${heal} KP durch Überreste.`);
    }
    if (battleState.enemy.item && battleState.enemy.item.name === 'Überreste') {
        const heal = Math.floor(battleState.enemy.maxHp / 16);
        battleState.enemy.currentHp = Math.min(battleState.enemy.maxHp, battleState.enemy.currentHp + heal);
        addBattleLog('🔄', `${battleState.enemy.name} heilt ${heal} KP durch Überreste.`);
    }
    applyLeppaBerry(battleState.player, 'player');
    applyLeppaBerry(battleState.enemy, 'enemy');
    checkAutomaticBerry(battleState.player, 'player');
    checkAutomaticBerry(battleState.enemy, 'enemy');
    updateHPBar('battlePlayerHPBar', 'battlePlayerHPText', battleState.player.currentHp, battleState.player.maxHp);
    updateHPBar('battleEnemyHPBar', 'battleEnemyHPText', battleState.enemy.currentHp, battleState.enemy.maxHp);
    if (battleState.player.currentHp <= 0) { endBattle('enemy'); return; }
    if (battleState.enemy.currentHp <= 0) { endBattle('player'); return; }
    battleState.isPlayerTurn = true;
    renderMoveButtons();
    updateAccuracyInfo(); updateCritInfo(); updateWeatherDisplay();
}