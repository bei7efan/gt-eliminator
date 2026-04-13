<template>
    <div :class="['gt-eliminator-item-teams', customClasses.teams]" :style="getTeamsContainerStyle()" v-if="bracketNode.team1 || bracketNode.team2">
        <div
            :class="['gt-eliminator-team', 'gt-eliminator-team1', customClasses.team, getTeamClass(bracketNode.team1)]"
            :style="getTeamStyle(bracketNode.team1)"
            @click="handleTeamClick(bracketNode.team1)"
        >
            <slot name="team" :team="bracketNode.team1">
                <div class="team-content">
                    <div class="team-name">{{ bracketNode.team1 ? bracketNode.team1.name : placeholderText }}</div>
                    <div v-if="bracketNode.team1 && bracketNode.team1.points" class="team-points">{{ bracketNode.team1.points }}</div>
                </div>
            </slot>
        </div>

        <!-- Match info slot -->
        <div class="gt-eliminator-match-info">
            <slot name="match-info" :match="bracketNode">
                <!-- Default content if slot is not provided -->
                <div v-if="bracketNode.time || bracketNode.venue || bracketNode.matchId" class="match-info-content">
                    <div v-if="bracketNode.time" class="match-time">{{ bracketNode.time }}</div>
                    <div v-if="bracketNode.venue" class="match-venue">{{ bracketNode.venue }}</div>
                    <div v-if="bracketNode.matchId" class="match-id">Match {{ bracketNode.matchId }}</div>
                </div>
            </slot>
        </div>

        <div
            :class="['gt-eliminator-team', 'gt-eliminator-team2', customClasses.team, getTeamClass(bracketNode.team2)]"
            :style="getTeamStyle(bracketNode.team2)"
            @click="handleTeamClick(bracketNode.team2)"
        >
            <slot name="team" :team="bracketNode.team2">
                <div class="team-content">
                    <div class="team-name">{{ bracketNode.team2 ? bracketNode.team2.name : placeholderText }}</div>
                    <div v-if="bracketNode.team2 && bracketNode.team2.points" class="team-points">{{ bracketNode.team2.points }}</div>
                </div>
            </slot>
        </div>
    </div>
    
    <!-- For root nodes with only games (like ranking structure) -->
    <div v-else-if="bracketNode.games && bracketNode.games.length > 0" class="gt-eliminator-games-container">
        <!-- This container will just hold the child nodes -->
    </div>
</template>

<script setup>


const props = defineProps({
    bracketNode: { type: Object, default: () => ({}) },
    styles: { type: Object, default: () => ({}) },
    customClasses: { type: Object, default: () => ({}) },
    placeholderText: { type: String, default: 'TBD' },
    matchInfoBg: { type: String, default: '#ffffff' },
    matchInfoFontColor: { type: String, default: '#000000' },
    itemWidth: { type: String, default: '120px' }
});

const emit = defineEmits(['team-click']);

const getTeamClass = (team) => {
    if (!team || team.winner === null || team.winner === undefined) {
        return "";
    }
    let clazz = team.winner ? "winner" : "defeated";
    if (props.customClasses.winner && team.winner) {
        clazz += ` ${props.customClasses.winner}`;
    }
    if (props.customClasses.defeated && !team.winner) {
        clazz += ` ${props.customClasses.defeated}`;
    }
    return clazz;
};

const getTeamsContainerStyle = () => {
    return {
        backgroundColor: props.styles.backgroundColor || '#ffffff',
        color: props.styles.textColor || '#020817',
        borderRadius: props.styles.borderRadius || '6px',
        fontSize: props.styles.fontSize || '14px',
        border: `1px solid ${props.styles.borderColor || '#e2e8f0'}`,
        overflow: 'hidden',
        '--match-info-bg': props.matchInfoBg,
        '--match-info-font-color': props.matchInfoFontColor,
        width: props.itemWidth
    };
};

const getBaseTeamStyle = () => {
    return {
        padding: props.styles.teamPadding || props.styles.playerPadding || '8px 12px',
        borderBottom: `1px solid ${props.styles.borderColor || '#e2e8f0'}`,
        backgroundColor: props.styles.backgroundColor || '#501696',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };
};

const getPlaceholderTeamStyle = (style) => {
    style.color = '#9ca3af';
    style.fontStyle = 'italic';
    style.cursor = 'default';
    style['--team-hover-color'] = 'transparent';
    return style;
};

const getWinnerDefeatedStyle = (team, style) => {
    const winner = team.winner === true;
    const defeated = team.winner === false;
    
    if (winner) {
        style.backgroundColor = props.styles.winnerColor || '#501696';
    } else if (defeated) {
        style.backgroundColor = props.styles.defeatedColor || '#6b7280';
    }
    
    const hoverColor = winner 
        ? (props.styles.winnerTeamHover || 'rgba(0, 0, 0, 0.1)')
        : (props.styles.defeatedTeamHover || 'rgba(0, 0, 0, 0.1)');
    
    style['--team-hover-color'] = hoverColor;
    return style;
};

const getTeamStyle = (team) => {
    const style = getBaseTeamStyle();

    if (!team || !team.name) {
        return getPlaceholderTeamStyle(style);
    }

    return getWinnerDefeatedStyle(team, style);
};

const handleTeamClick = (team) => {
    if (team && team.name) {
        emit('team-click', team);
    }
};
</script>

<style>
    .gt-eliminator-item-teams { display: flex; flex-direction: column; width: 100%; }
    .gt-eliminator-team { border-bottom: none !important; }
    .gt-eliminator-team:hover { background-color: var(--team-hover-color) !important; }
    
    .team-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    .team-name {
        flex: 1;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px 8px;
        text-align: center;
    }
    
    .team-points {
        font-size: 0.9em;
        opacity: 0.8;
        margin-left: 8px;
    }

    .gt-eliminator-match-info {
        padding: 4px 8px;
        background-color: var(--match-info-bg, rgba(0, 0, 0, 0.1));
        color: var(--match-info-font-color, #000000);
        font-size: 0.7em;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .match-info-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 6px;
    }

    .match-time,
    .match-venue,
    .match-id {
        opacity: 0.8;
        flex: 1;
    }
</style>