<template>
    <div class="gt-eliminator-br-battle-royale" :style="getRootVarsStyle()">
        <div class="gt-eliminator-br-scrollbar" v-if="rounds && rounds.length">
            <div class="gt-eliminator-br-tabs">
                <button
                    v-for="(round, rIdx) in rounds"
                    :key="rIdx"
                    class="gt-eliminator-br-tab"
                    :class="{ active: rIdx === roundIndex }"
                    @click="selectRound(rIdx)"
                >
                    {{ getRoundLabel(rIdx, round) }}
                </button>
            </div>
        </div>

        <div class="gt-eliminator-br-scrollbar" v-if="currentRoundTotalMatches > 0">
            <div class="gt-eliminator-br-tabs">
                <button
                    v-for="m in currentRoundTotalMatches"
                    :key="m"
                    class="gt-eliminator-br-tab"
                    :class="{ active: (m - 1) === matchIndex }"
                    @click="selectMatch(m - 1)"
                >
                    Match {{ String(m).padStart(2, '0') }}
                </button>
            </div>
        </div>

        <div class="gt-eliminator-br-table" v-if="currentMatch">
            <div class="gt-eliminator-br-table-head" :style="getTableHeadStyle()">
                <div class="col-no">No</div>
                <div class="col-team">Team</div>
                <div class="col-total">Points</div>
            </div>
            <div class="gt-eliminator-br-list" :style="getTeamsContainerStyle()">
                <div
                    v-for="(team, idx) in currentTeams"
                    :key="team.id || team.name || idx"
                    :class="['gt-eliminator-team', customClasses.team, getTeamClass(team)]"
                    :style="getTeamStyle(team)"
                    @click="handleTeamClick(team)"
                >
                    <div class="col-no">{{ idx + 1 }}</div>
                    <div class="col-team">
                        <slot name="team" :team="team">
                            {{ team?.name || placeholderText }}
                        </slot>
                    </div>
                    <div class="col-total">{{ team.points ?? team.total ?? '' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    rounds: { type: Array, default: () => [] },
    styles: { type: Object, default: () => ({}) },
    customClasses: { type: Object, default: () => ({}) },
    placeholderText: { type: String, default: 'TBD' },
});

const emit = defineEmits(['team-click']);

const roundIndex = ref(0);
const matchIndex = ref(0);

const currentRound = computed(() =>
    props.rounds?.length ? props.rounds[roundIndex.value] || null : null
);

const currentRoundTotalMatches = computed(() => {
    const list = currentRound.value
        ? (currentRound.value.games || currentRound.value.matches || [])
        : [];
    return list.length;
});

const currentMatch = computed(() => {
    if (!currentRound.value) {
        return null;
    }
    const list = currentRound.value.games || currentRound.value.matches || [];
    return list[matchIndex.value] || null;
});

/* ----------------- TEAM HELPERS ------------------ */
const extractNumberedTeams = (match) =>
    Object.keys(match)
        .map((k) => {
            const m = /^team(\d+)$/.exec(k);
            return m ? { idx: parseInt(m[1], 10), value: match[k] } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.idx - b.idx)
        .map((t) => t.value)
        .filter(Boolean);

const normalizeTeam = (t, i) => {
    if (!t || !t.name) {
        return {
            ...(t || {}),
            name: props.placeholderText,
            id: t?.id ?? `placeholder-${i}`,
        };
    }
    return t;
};

const processTeams = (teams) => {
    if (!Array.isArray(teams) || teams.length === 0) {
        return [{ id: null, name: props.placeholderText, points: '' }];
    }
    return teams.map((t, i) => normalizeTeam(t, i));
};

const getTeamsFromMatch = (match) => {
    if (Array.isArray(match.teams) && match.teams.length) {
        return match.teams;
    }
    const numbered = extractNumberedTeams(match);
    if (numbered.length) {
        return numbered;
    }
    if (Array.isArray(match.players)) {
        return match.players;
    }
    return [];
};

const currentTeams = computed(() => {
    if (!currentMatch.value) {
        return [];
    }
    return processTeams(getTeamsFromMatch(currentMatch.value));
});

/* ----------------- STYLES ------------------ */
const getRootVarsStyle = () => ({
    '--br-tab-bg': props.styles.brTabBg || '#1A1A1A',
    '--br-tab-text': props.styles.brTabTextColor || '#ffffff',
    '--br-tab-active-bg': props.styles.brTabActiveBg || '#8200DB',
    '--br-tab-active-text': props.styles.brTabActiveTextColor || '#ffffff',
    '--br-tab-border': 'none',
    '--br-list-bg': props.styles.brListBg || '#000000',
});

const getRoundLabel = (index, round) =>
    round?.name ? round.name : `R${index + 1}`;

const getTeamsContainerStyle = () => ({
    backgroundColor: props.styles.brListBg || '#000000',
    color: props.styles.brListTextColor || '#ffffff',
    borderRadius: props.styles.borderRadius || '6px',
    fontSize: props.styles.fontSize || '14px',
    border: 'none',
    overflow: 'hidden',
    width: '100%',
});

const getTableHeadStyle = () => ({
    backgroundColor: props.styles.brTableHeadBg || '#1C1C1C',
    color: props.styles.brTableHeadTextColor || '#ffffff',
    border: 'none',
});

const getTeamClass = (team) => {
    if (!team || team.winner === null) {
        return '';
    }
    const baseClass = team.winner ? 'winner' : 'defeated';
    const customClass = team.winner
        ? props.customClasses.winner || ''
        : props.customClasses.defeated || '';
    return customClass ? `${baseClass} ${customClass}` : baseClass;
};

const getTeamPadding = () => {
    return props.styles.teamPadding || props.styles.playerPadding || '8px 12px';
};

const getTeamBackground = () => {
    return props.styles.brListRowBg || props.styles.brListBg || '#000000';
};

const getTeamBorder = () => {
    return `1px solid ${props.styles.brRowDividerColor || '#1C1C1C'}`;
};

const getTeamHoverColor = (isPlaceholder) => {
    if (isPlaceholder) {
        return 'transparent';
    }
    return props.styles.brListRowHoverBg || '#2A2A2A';
};

const getBaseTeamStyle = (team) => {
    const isPlaceholder = !team || !team.name || team.name === props.placeholderText;
    
    return {
        padding: getTeamPadding(),
        borderBottom: getTeamBorder(),
        backgroundColor: getTeamBackground(),
        transition: 'background-color 0.2s ease',
        cursor: isPlaceholder ? 'default' : 'pointer',
        '--team-hover-color': getTeamHoverColor(isPlaceholder),
    };
};

const getTeamStyle = (team) => {
    return getBaseTeamStyle(team);
};

/* ----------------- ACTIONS ------------------ */
const selectRound = (idx) => (roundIndex.value = idx);
const selectMatch = (idx) => (matchIndex.value = idx);

const handleTeamClick = (team) => {
    if (team?.name && team.name !== props.placeholderText) {
        emit('team-click', team);
    }
};

const ensureIndexesInBounds = () => {
    roundIndex.value = Math.max(0, Math.min(roundIndex.value, props.rounds.length - 1));
    if (!currentRound.value) {
        matchIndex.value = 0;
        return;
    }
    const list = currentRound.value.games || currentRound.value.matches || [];
    matchIndex.value = Math.max(0, Math.min(matchIndex.value, list.length - 1));
};

watch(() => props.rounds, ensureIndexesInBounds, { immediate: true });
watch(roundIndex, () => {
    matchIndex.value = 0;
    ensureIndexesInBounds();
});
</script>

<style>
.gt-eliminator-br-battle-royale {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    min-width: 100%;
    box-sizing: border-box;
}
.gt-eliminator-br-scrollbar { overflow-x: auto; }
.gt-eliminator-br-tabs { display: flex; gap: 8px; padding-bottom: 6px; }
.gt-eliminator-br-tab {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: var(--br-tab-bg, #1A1A1A);
    color: var(--br-tab-text, #ffffff);
    white-space: nowrap;
    cursor: pointer;
}
.gt-eliminator-br-tab.active {
    background: var(--br-tab-active-bg, #8200DB);
    color: var(--br-tab-active-text, #ffffff);
}
.gt-eliminator-br-table {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    min-width: 100%;
}
.gt-eliminator-br-table-head {
    display: grid;
    grid-template-columns: 60px 1fr 120px;
    padding: 6px 10px;
    font-weight: 600;
    border-radius: 6px;
    width: 100%;
    min-width: 100%;
    box-sizing: border-box;
}
.gt-eliminator-br-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 100%;
    box-sizing: border-box;
}
.gt-eliminator-team {
    display: grid;
    grid-template-columns: 60px 1fr 120px;
    align-items: center;
    background-color: var(--br-list-bg, #000000);
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
    min-width: 100%;
}
.gt-eliminator-team:hover {
    background-color: var(--team-hover-color, var(--br-list-hover-bg, #2A2A2A));
}
.col-no { text-align: left; }
.col-total { text-align: center; padding-right: 8px; }
</style>