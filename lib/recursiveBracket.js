export default {
    // eslint-disable-next-line complexity
    transform(rounds, placeholderText = 'TBD', rankingCount = 2) {
        if (!rounds) {
            return null;
        }

        const totalRounds = rounds.length;

        let currentRound = [];
        let previousRound = [];

        for (let i = 0; i < totalRounds; i++) {
            const roundGames = (rounds[i].games || rounds[i].matches || []);
            currentRound = roundGames.map((game) => {
                return {
                    ...normalizeGame(game, placeholderText),
                    title: "round " + i,
                    games: [],
                    hasParent: !!rounds[i + 1],
                };
            });

            if (previousRound.length === 0) {
                previousRound = currentRound;
                continue;
            }

            const expectedMatches = Math.ceil(previousRound.length / 2);
            if (currentRound.length < expectedMatches) {
                for (let k = currentRound.length; k < expectedMatches; k++) {
                    currentRound.push({
                        id: `placeholder-${i}-${k}`,
                        title: "round " + i,
                        games: [],
                        hasParent: !!rounds[i + 1],
                        team1: { id: null, name: placeholderText, winner: null, points: 0 },
                        team2: { id: null, name: placeholderText, winner: null, points: 0 }
                    });
                }
            }

            for (let j = 0; j < previousRound.length; j++) {
                const matchForCurrentGame = Math.floor(j / 2);
                if (currentRound[matchForCurrentGame]) {
                    currentRound[matchForCurrentGame].games.push(previousRound[j]);
                }
            }

            previousRound = currentRound;
        }

        // 检查最后一轮是否包含多个比赛（例如5-6名决赛和7-8名决赛）
        const finalRound = rounds[totalRounds - 1];
        const finalGames = finalRound.games || finalRound.matches || [];
        
        // 如果最后一轮包含多个比赛，创建一个根节点来包含所有比赛
        if (finalGames.length > 1) {
            // 创建一个新的根节点
            const newRoot = {
                id: `root-with-multiple-final-${Date.now()}`,
                title: "final",
                games: currentRound,
                hasParent: false
            };
            return newRoot;
        }

        // 如果需要 3、4 名排名
        if (rankingCount >= 4 && totalRounds >= 2) {
            // 获取半决赛的比赛（倒数第二轮）
            const semiFinalRound = rounds[totalRounds - 2];
            if (semiFinalRound) {
                const semiFinalGames = semiFinalRound.games || semiFinalRound.matches || [];
                if (semiFinalGames.length >= 2) {
                    // 创建 3、4 名比赛
                    const thirdPlaceMatch = {
                        id: `third-place-${Date.now()}`,
                        title: "third place",
                        games: [],
                        hasParent: false,
                        team1: {
                            id: null,
                            name: placeholderText,
                            winner: null,
                            points: 0
                        },
                        team2: {
                            id: null,
                            name: placeholderText,
                            winner: null,
                            points: 0
                        },
                        round: "季军赛",
                        time: "2023-06-16",
                        venue: "广州天河体育场",
                        matchId: "8"
                    };

                    // 将半决赛的输家添加到 3、4 名比赛
                    semiFinalGames.forEach((game, index) => {
                        if (index < 2) { // 只处理前两场半决赛
                            const loser = game.team1 && game.team1.winner === false ? game.team1 : 
                                         game.team2 && game.team2.winner === false ? game.team2 : null;
                            if (loser) {
                                if (index === 0) {
                                    thirdPlaceMatch.team1 = { ...loser };
                                } else {
                                    thirdPlaceMatch.team2 = { ...loser };
                                }
                            }
                        }
                    });

                    // 将 3、4 名比赛添加到树结构中
                    if (currentRound[0]) {
                        // 创建一个新的根节点
                        const newRoot = {
                            id: `root-with-third-place-${Date.now()}`,
                            title: "final",
                            games: [currentRound[0], thirdPlaceMatch],
                            hasParent: false
                        };
                        return newRoot;
                    }
                }
            }
        }

        return currentRound[0] || null;
    },
    transformFlatTree(games) {
        const mapOfGamesPerParent = {};
        let root = null;

        games.forEach((game) => {
            if (!game.next && !root) {
                root = game;
                return;
            }

            if (!mapOfGamesPerParent[game.next]) {
                mapOfGamesPerParent[game.next] = [];
            }

            mapOfGamesPerParent[game.next].push(game);
        });

        const tree = {
            ...root,
            title: "round",
            games: [],
            hasParent: false,
        };

        return constructTree(tree, mapOfGamesPerParent, Object.keys(mapOfGamesPerParent).length);
    },
};

function constructTree(tree, mapOfChildren, processedRound) {
    const totalChildren = mapOfChildren[tree.id] || [];

    tree.title = "round " + processedRound;

    for (let i = 0; i < totalChildren.length; i++) {
        const childGame = totalChildren[i];

        const treeChild = {
            ...childGame,
            title: `round ${[processedRound]}`,
            hasParent: true,
            games: [],
        };

        constructTree(treeChild, mapOfChildren, processedRound - 1);

        tree.games.push(treeChild);
    }

    return tree;
}

// eslint-disable-next-line complexity
function normalizeGame(game, placeholderText = 'TBD') {
    const normalized = { ...game };

    if (!normalized.team1 && !normalized.team2) {
        normalized.team1 = { id: null, name: placeholderText, winner: null, points: 0 };
        normalized.team2 = { id: null, name: placeholderText, winner: null, points: 0 };
    } else if (normalized.team1 && !normalized.team2) {
        normalized.team2 = { id: null, name: placeholderText, winner: null, points: 0 };
    } else if (!normalized.team1 && normalized.team2) {
        normalized.team1 = { id: null, name: placeholderText, winner: null, points: 0 };
    }

    const numberedTeams = getNumberedTeams(normalized);
    if (numberedTeams.length > 0) {
        normalized.teams = numberedTeams.map((t) => t.value).filter(Boolean);
    } else if (Array.isArray(normalized.players) && !Array.isArray(normalized.teams)) {
        normalized.teams = normalized.players;
    } else if (normalized.team1 && normalized.team2 && !Array.isArray(normalized.teams)) {
        normalized.teams = [normalized.team1, normalized.team2];
    }

    ensureClassicFields(normalized);
    return normalized;
}

function getNumberedTeams(normalized) {
    return Object.keys(normalized)
        .map((k) => {
            const m = /^team(\d+)$/.exec(k);
            if (m) {
                return { idx: parseInt(m[1], 10), key: k, value: normalized[k] };
            }
            return null;
        })
        .filter(Boolean)
        .sort((a, b) => a.idx - b.idx);
}

function ensureClassicFields(normalized) {
    if (!Array.isArray(normalized.teams)) {
        return;
    }
    if (!normalized.team1 && normalized.teams[0]) {
        normalized.team1 = normalized.teams[0];
    }
    if (!normalized.team2 && normalized.teams[1]) {
        normalized.team2 = normalized.teams[1];
    }
}