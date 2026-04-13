<template>
    <div :class="['gt-eliminator-wrapper', wrapperClass, { 'gt-eliminator-battle-royale': isBattleRoyale }]" :style="wrapperInlineStyle" v-if="recursiveBracket">
        <div class="gt-eliminator-main-content">
            <div class="gt-eliminator-tournament-container">
                <!-- Round titles row -->
                <div class="gt-eliminator-round-titles-row" v-if="!isBattleRoyale" :style="getRoundTitleRowStyle()">
                    <div 
                        v-for="(round, index) in rounds" 
                        :key="index"
                        class="gt-eliminator-round-title-column"
                        :style="getRoundTitleColumnStyle()"
                    >
                        <div class="gt-eliminator-round-title" :style="getRoundTitleStyle()">
                            {{ round.name || getRoundTitle(round, index, rounds.length) }}
                        </div>
                    </div>
                </div>

                <!-- Bracket matches row -->
                <div class="gt-eliminator-bracket-row">
                    <battle-royale-view
                        v-if="isBattleRoyale"
                        :rounds="rounds"
                        :styles="computedStyles"
                        :custom-classes="customClasses"
                        :placeholder-text="placeholderText"
                        @team-click="handleTeamClick"
                    >
                        <template #team="{ team }">
                            <slot name="team" :team="team" />
                        </template>
                    </battle-royale-view>

                    <team-node
                        v-else
                        :bracket-node="recursiveBracket"
                        :styles="computedStyles"
                        :custom-classes="customClasses"
                        :placeholder-text="placeholderText"
                        :match-info-bg="matchInfoBg"
                        :match-info-font-color="matchInfoFontColor"
                        :item-width="itemWidth"
                        @team-click="handleTeamClick"
                    >
                        <template #team="{ team }">
                            <slot name="team" :team="team" />
                        </template>
                    </team-node>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import TeamNode from "./components/TeamNode.vue";
import BattleRoyaleView from "./components/BattleRoyaleView.vue";
import recursiveBracketModule from "./lib/recursiveBracket.js";

const props = defineProps({
    rounds: { type: Array, default: () => [] },
    flatTree: { type: Array, default: () => [] },
    wrapperClass: { type: String, default: '' },
    wrapperStyle: { type: Object, default: () => ({}) },
    customClasses: { type: Object, default: () => ({}) },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#ffffff' },
    winnerColor: { type: String, default: '#501696' },
    defeatedColor: { type: String, default: '#501696' },
    spacing: { type: String, default: '12px' },
    borderRadius: { type: String, default: '6px' },
    fontSize: { type: String, default: '14px' },
    playerPadding: { type: String, default: '8px 12px' },
    connectionColor: { type: String, default: '#85E642' },
    connectionWidth: { type: String, default: '24px' },
    connectionThickness: { type: String, default: '1px' },
    borderColor: { type: String, default: '#501696' },
    roundTitleColor: { type: String, default: '#64748b' },
    roundTitleBgColor: { type: String, default: '#f8fafc' },
    roundTitleBorderColor: { type: String, default: '#e2e8f0' },
    roundTitleWidth: { type: String, default: '200rpx' },
    roundTitleSpacing: { type: String, default: '' },
    rankingCount: { type: Number, default: 2 },
    placeholderText: { type: String, default: 'TBD' },
    scrollbarColor: { type: String, default: '#cbd5e1' },
    scrollbarTrackColor: { type: String, default: '#f1f5f9' },
    winnerTeamHover: { type: String, default: 'rgba(0, 0, 0, 0.1)' },
    defeatedTeamHover: { type: String, default: 'rgba(0, 0, 0, 0.1)' },
    brTabBg: { type: String, default: '#1A1A1A' },
    brTabTextColor: { type: String, default: '#ffffff' },
    brTabActiveBg: { type: String, default: '#8200DB' },
    brTabActiveTextColor: { type: String, default: '#ffffff' },
    brListBg: { type: String, default: '#000000' },
    brListTextColor: { type: String, default: '#ffffff' },
    brTableHeadBg: { type: String, default: '#1C1C1C' },
    brTableHeadTextColor: { type: String, default: '#ffffff' },
    brRowDividerColor: { type: String, default: '#1C1C1C' },
    brListRowBg: { type: String, default: '' },
    brListRowHoverBg: { type: String, default: '' },
    teamPadding: { type: String, default: '8px 12px' },
    matchInfoBg: { type: String, default: '#ffffff' },
    matchInfoFontColor: { type: String, default: '#000000' },
    itemWidth: { type: String, default: '120px' }
});

const emit = defineEmits(['team-click']);

const getRoundTitle = (round, index, totalRounds) => {
    // First try to get round title from the first match in the round
    if (round.matches && round.matches.length > 0 && round.matches[0].round) {
        return round.matches[0].round;
    }
    // Fallback to default naming if no round property in matches
    if (totalRounds === 1) { return 'Final'; }
    if (index === totalRounds - 1) { return 'Final'; }
    if (index === totalRounds - 2) { return 'Semi Final'; }
    if (index === totalRounds - 3) { return 'Quarter Final'; }
    return `Round ${index + 1}`;
};

const getRoundTitleColumnStyle = () => {
    // 使用 roundTitleWidth 作为标题宽度
    const width = props.roundTitleWidth || '200rpx';
    return { minWidth: width, width: width };
};

const getRoundTitleRowStyle = () => {
    // 计算轮次标题行的间距
    let spacing = props.roundTitleSpacing;
    if (!spacing) {
        // 默认间距为 itemWidth 的 1/3
        const itemWidth = props.itemWidth || '120px';
        const widthMatch = itemWidth.match(/^(\d+)(px|rpx)$/);
        if (widthMatch) {
            const width = parseInt(widthMatch[1]);
            const unit = widthMatch[2];
            const defaultSpacing = Math.round(width / 3);
            spacing = `${defaultSpacing}${unit}`;
        } else {
            spacing = '40px'; // 默认间距
        }
    }
    return { gap: spacing };
};

const getRoundTitleStyle = () => ({
    color: props.roundTitleColor,
    fontSize: props.fontSize,
    fontWeight: '600',
    backgroundColor: props.roundTitleBgColor,
    border: `1px solid ${props.roundTitleBorderColor}`,
    borderRadius: '6px',
    padding: '8px 16px',
    whiteSpace: 'nowrap',
    textAlign: 'center'
});

const handleTeamClick = (team) => emit('team-click', team);

const countNumberedTeams = (game) => {
    if (!game || typeof game !== 'object') { return 0; }
    return Object.keys(game)
        .map((key) => (/^team(\d+)$/.test(key) && game[key] ? 1 : 0))
        .reduce((a, b) => a + b, 0);
};

const hasMultiTeamsInGame = (game) => {
    const hasMultiTeamsArray = Array.isArray(game?.teams) && game.teams.length > 2;
    const numberedTeamsCount = countNumberedTeams(game);
    return hasMultiTeamsArray || numberedTeamsCount > 2;
};

const hasMultiTeamsInRound = (round) => {
    const games = round.games || round.matches || [];
    return games.some(hasMultiTeamsInGame);
};

const isBattleRoyale = computed(() => {
    if (!Array.isArray(props.rounds) || props.rounds.length === 0) { 
        return false; 
    }
    return props.rounds.some(hasMultiTeamsInRound);
});

const recursiveBracket = computed(() => {
    if (props.flatTree && props.flatTree.length > 0) {
        return recursiveBracketModule.transformFlatTree(props.flatTree);
    }
    return recursiveBracketModule.transform(props.rounds, props.placeholderText, props.rankingCount);
});

const computedStyles = computed(() => ({
    backgroundColor: props.backgroundColor,
    textColor: props.textColor,
    winnerColor: props.winnerColor,
    defeatedColor: props.defeatedColor,
    spacing: props.spacing,
    borderRadius: props.borderRadius,
    fontSize: props.fontSize,
    playerPadding: props.playerPadding,
    connectionColor: props.connectionColor,
    connectionWidth: props.connectionWidth,
    connectionThickness: props.connectionThickness,
    borderColor: props.borderColor,
    roundTitleColor: props.roundTitleColor,
    roundTitleBgColor: props.roundTitleBgColor,
    roundTitleBorderColor: props.roundTitleBorderColor,
    scrollbarColor: props.scrollbarColor,
    scrollbarTrackColor: props.scrollbarTrackColor,
    winnerTeamHover: props.winnerTeamHover,
    defeatedTeamHover: props.defeatedTeamHover,
    brTabBg: props.brTabBg,
    brTabTextColor: props.brTabTextColor,
    brTabActiveBg: props.brTabActiveBg,
    brTabActiveTextColor: props.brTabActiveTextColor,
    brListBg: props.brListBg,
    brListTextColor: props.brListTextColor,
    brTableHeadBg: props.brTableHeadBg,
    brTableHeadTextColor: props.brTableHeadTextColor,
    brRowDividerColor: props.brRowDividerColor,
    brListRowBg: props.brListRowBg,
    brListRowHoverBg: props.brListRowHoverBg,
    teamPadding: props.teamPadding
}));

const wrapperInlineStyle = computed(() => ({
    ...props.wrapperStyle,
    '--scrollbar-color': computedStyles.value.scrollbarColor || '#cbd5e1',
    '--scrollbar-track-color': computedStyles.value.scrollbarTrackColor || '#f1f5f9'
}));
</script>

<style>
.gt-eliminator-wrapper {
    display: flex;
    align-items: flex-start;
    position: relative;
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    padding: 20px;
    box-sizing: border-box;
}

.gt-eliminator-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.gt-eliminator-wrapper::-webkit-scrollbar-track {
    background: var(--scrollbar-track-color, #f1f5f9);
    border-radius: 4px;
}

.gt-eliminator-wrapper::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color, #cbd5e1);
    border-radius: 4px;
}

.gt-eliminator-wrapper::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-color-hover, #94a3b8);
}

.gt-eliminator-main-content {
    display: flex;
    align-items: center;
    min-width: max-content;
}

.gt-eliminator-tournament-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.gt-eliminator-round-titles-row {
    display: flex;
    align-items: center;
    margin-left: 48px;
    margin-bottom: 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.gt-eliminator-round-titles-row::-webkit-scrollbar { display: none; }

.gt-eliminator-round-title-column {
    display: flex;
    justify-content: center;
    min-width: 180px;
    flex-shrink: 0;
}

.gt-eliminator-round-title {
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 16px;
    white-space: nowrap;
    text-align: center;
    width: 100%;
}

.gt-eliminator-bracket-row {
    display: flex;
    align-items: center;
}

.gt-eliminator-battle-royale .gt-eliminator-main-content { 
    width: 100% !important; 
    min-width: 100% !important; 
}
.gt-eliminator-battle-royale .gt-eliminator-tournament-container,
.gt-eliminator-battle-royale .gt-eliminator-bracket-row,
.gt-eliminator-battle-royale .gt-eliminator-wrapper { 
    width: 100% !important; 
    min-width: 100% !important; 
}
</style>