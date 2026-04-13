<template>
    <div :class="['gt-eliminator-item', customClasses.item]" :style="getItemStyle()" v-if="teamsArePresent">
        <div :class="[getNodeClass(bracketNode), customClasses.itemParent]" :style="getNodeStyle()">
            <game-teams
                :bracket-node="bracketNode"
                :styles="styles"
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
            </game-teams>
        </div>

        <div v-if="bracketNode.games && (bracketNode.games[0] || bracketNode.games[1])" class="gt-eliminator-item-children">
            <div :class="['gt-eliminator-item-child', customClasses.itemChild]" :style="getChildStyle()" v-if="bracketNode.games[0]">
                <!-- eslint-disable-next-line vue/no-undef-components -->
                <team-node
                    :bracket-node="bracketNode.games[0]"
                    :styles="styles"
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
            <div :class="['gt-eliminator-item-child', customClasses.itemChild]" :style="getChildStyle()" v-if="bracketNode.games[1]">
                <!-- eslint-disable-next-line vue/no-undef-components -->
                <team-node
                    :bracket-node="bracketNode.games[1]"
                    :styles="styles"
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
        
        <!-- Special handling for final round connection lines -->
        <div v-if="isFinalRound" class="gt-eliminator-final-connections">
            <div class="gt-eliminator-final-connection-line" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import GameTeams from "./GameTeams.vue";

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

// Define component name for self-referencing
defineOptions({
    name: 'team-node'
});

const teamsArePresent = computed(() => {
    return props.bracketNode.team1 || props.bracketNode.team2 || (props.bracketNode.games && props.bracketNode.games.length > 0);
});

const isFinalRound = computed(() => {
    return props.bracketNode.games && props.bracketNode.games.length > 0 && !props.bracketNode.hasParent;
});

const getNodeClass = (node) => {
    if (node.games && (node.games[0] || node.games[1])) { return "gt-eliminator-item-parent"; }
    if (node.hasParent) { return "gt-eliminator-item-child"; }
    return "";
};

const getItemStyle = () => {
    return {
        fontSize: props.styles.fontSize || '14px',
        '--connection-color': props.styles.connectionColor || '#e2e8f0',
        '--connection-width': props.styles.connectionWidth || '24px',
        '--connection-thickness': props.styles.connectionThickness || '1px',
        '--connection-vertical-extra': `${(parseInt(props.styles.spacing) || 12) * 2}px`
    };
};

const getNodeStyle = () => {
    const spacingValue = parseInt(props.styles.spacing) || 12;
    return { marginLeft: `${spacingValue * 4}px` };
};

const getChildStyle = () => {
    return { marginTop: props.styles.spacing || '12px', marginBottom: props.styles.spacing || '12px' };
};

const handleTeamClick = (team) => {
    emit('team-click', team);
};
</script>

<style>
    .gt-eliminator-item { display: flex; flex-direction: row-reverse; --connection-color: #e2e8f0; --connection-width: 24px; --connection-thickness: 1px; }
    .gt-eliminator-item-parent { position: relative; margin-left: 48px; display: flex; align-items: center; }
    .gt-eliminator-item-parent:after { position: absolute; content: ""; width: var(--connection-width); height: var(--connection-thickness); left: 0; top: 50%; background-color: var(--connection-color); transform: translateX(-100%); }
    .gt-eliminator-item-children { display: flex; flex-direction: column; justify-content: center; }
    .gt-eliminator-item-child { display: flex; align-items: flex-start; justify-content: flex-end; margin-top: 12px; margin-bottom: 12px; position: relative; }
    .gt-eliminator-item-child:before { content: ""; position: absolute; background-color: var(--connection-color); right: 0; top: 50%; transform: translateX(100%); width: var(--connection-width); height: var(--connection-thickness); }
    .gt-eliminator-item-child:after { content: ""; position: absolute; background-color: var(--connection-color); right: calc(-1 * var(--connection-width)); height: calc(50% + var(--connection-vertical-extra)); width: var(--connection-thickness); top: 50%; }
    .gt-eliminator-item-child:last-child:after { transform: translateY(-100%); }
    .gt-eliminator-item-child:only-child:after { display: none; }

    .gt-eliminator-final-connections {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateX(-100%);
        width: var(--connection-width);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .gt-eliminator-final-connection-line {
        width: var(--connection-width);
        height: var(--connection-thickness);
        background-color: var(--connection-color);
        position: relative;
    }

    .gt-eliminator-final-connection-line::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        width: var(--connection-thickness);
        height: calc(50% + var(--connection-vertical-extra));
        background-color: var(--connection-color);
        transform: translateY(-100%);
    }

    .gt-eliminator-final-connection-line::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: var(--connection-thickness);
        height: calc(50% + var(--connection-vertical-extra));
        background-color: var(--connection-color);
        transform: translateY(0);
    }
</style>