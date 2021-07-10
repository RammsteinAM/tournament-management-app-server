import { generateGameCreateData, getMultipleSetScores, splitGameKey } from "../../helpers";
import { arrayAlreadyHasArray, shuffle } from "../../utils/arrayUtils";
import { GameData, GameInsertData, GamesData, TournamentGameCreateData } from "../game/game.types";
import { PlayerModificationData } from "../player/player.types";
import { TournamentData } from "./tournament.types";

export const getPlayersLives = (tournamentGames: GamesData, tournamentPlayers: number[], numberOfDefaultLives: number, playerModifications: PlayerModificationData[]) => {
    const playerInitialLives = tournamentPlayers.reduce((acc: { [id: number]: number }, val) => {
        acc[val] = numberOfDefaultLives;
        const modifiedNumberOfLives = playerModifications.find(m => m.playerId === val).initialNumberOfLives;
        const isRemoved = playerModifications.find(m => m.playerId === val).removed;
        if (modifiedNumberOfLives) {
            acc[val] = modifiedNumberOfLives;
        }       
        if (isRemoved) {
            acc[val] = 0;
        }
        return acc;
    }, {});

    const playerLives = tournamentGames.reduce((acc, val) => {
        if (!val.scores1 || !val.scores2 || val.scores1.length === 0 || val.scores2.length === 0) {
            return acc;
        }
        const { score1, score2 } = getMultipleSetScores(val.scores1, val.scores2);

        if (!val.player1 || !val.player2) {
            return acc;
        }

        const id1_0 = val.player1[0] && val.player1[0].id;
        const id1_1 = val.player1[1] && val.player1[1].id;
        const id2_0 = val.player2[0] && val.player2[0].id;
        const id2_1 = val.player2[1] && val.player2[1].id;

        // SINGLE, TEAM, MONSTER DYP
        if (id1_0 && id2_0 && typeof acc[id1_0] === 'number' && typeof acc[id2_0] === 'number' && !id1_1 && !id2_1) {
            if (score1 > score2) {
                acc[id2_0]--;
            }
            if (score1 < score2) {
                acc[id1_0]--;
            }
        }

        // DYP, MONSTER DYP
        else if (id1_0 && id2_0 && id1_1 && id2_1) {
            if (score1 > score2) {
                acc[id2_0]--;
                acc[id2_1]--;
            }
            if (score1 < score2) {
                acc[id1_0]--;
                acc[id1_1]--;
            }
        }

        return acc;
    }, playerInitialLives);

    return playerLives;
};

export const getShuffledNextRoundParticipants = (lastRoundParticipantIds: number[], lastRoundAliveParticipantIds: number[], waitingParticipantIds: number[]) => {
    const nextRoundParticipantIds: number[] = [...waitingParticipantIds, ...shuffle(lastRoundAliveParticipantIds)];
    if (nextRoundParticipantIds.length % 2 === 1) {
        // If even number of players, remove a player that played in the last round.
        nextRoundParticipantIds.pop();
    }

    const lastRoundOpponents = lastRoundParticipantIds.reduce((acc: { [id: number]: number }, val, i: number, arr) => {
        if (i % 2 === 0) {
            acc[val] = arr[i + 1];
        }
        if (i % 2 === 1) {
            acc[val] = arr[i - 1];
        }
        return acc;
    }, {})
    const shuffledNextRoundParticipantIds: number[] = [];
    let i = nextRoundParticipantIds.length - 1;
    while (i >= 0) {
        if (lastRoundOpponents[nextRoundParticipantIds[i]] !== nextRoundParticipantIds[i - 1]) {
            shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 1]);
            i = i - 2;
            continue;
        }
        if (lastRoundOpponents[nextRoundParticipantIds[i]] === nextRoundParticipantIds[i - 1]) {
            shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 2], nextRoundParticipantIds[i - 1], nextRoundParticipantIds[i - 3]);
            i = i - 4;
            continue;
        }
        break;
    }

    return shuffledNextRoundParticipantIds;
}

export const getShuffledNextRoundDYPParticipants = (lastRoundParticipantIds: [number, number][], lastRoundAliveParticipantIds: [number, number][], waitingParticipantIds: [number, number][]) => {
    const nextRoundParticipantIds: [number, number][] = [...waitingParticipantIds, ...shuffle(lastRoundAliveParticipantIds)];
    if (nextRoundParticipantIds.length % 2 === 1) {
        // If even number of players, remove a player that played in the last round.
        nextRoundParticipantIds.pop();
    }

    const lastRoundOpponents = lastRoundParticipantIds.reduce((acc: { [id: number]: number }, val: [number, number], i: number, arr: [number, number][]) => {
        if (i % 2 === 0) {
            acc[val[0]] = arr[i + 1][0];
        }
        if (i % 2 === 1) {
            acc[val[0]] = arr[i - 1][0];
        }
        return acc;
    }, {})
    const shuffledNextRoundParticipantIds: [number, number][] = [];
    let i = nextRoundParticipantIds.length - 1;
    while (i >= 0) {
        if (lastRoundOpponents[nextRoundParticipantIds[i][0]] !== nextRoundParticipantIds[i - 1][0]) {
            shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 1]);
            i = i - 2;
            continue;
        }
        if (lastRoundOpponents[nextRoundParticipantIds[i][0]] === nextRoundParticipantIds[i - 1][0]) {
            shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 2], nextRoundParticipantIds[i - 1], nextRoundParticipantIds[i - 3]);
            i = i - 4;
            continue;
        }
        break;
    }

    return shuffledNextRoundParticipantIds;
}

const swapParticipantsToNonRepetitivePairs = (lastRoundTeammates: { [id: number]: number }, shuffledNextRoundParticipantIds: number[]) => {
    const arrLength = shuffledNextRoundParticipantIds.length;
    const tempLastElement = shuffledNextRoundParticipantIds[arrLength - 1];
    const randomIndex = Math.floor(Math.random() * (arrLength - 2));
    shuffledNextRoundParticipantIds[arrLength - 1] = shuffledNextRoundParticipantIds[randomIndex]
    shuffledNextRoundParticipantIds[randomIndex] = tempLastElement;
}

export const getShuffledNextRoundMonsterDYPParticipants = (lastRoundParticipantIds: number[], lastRoundAliveParticipantIds: number[], waitingParticipantIds: number[]) => {
    const nextRoundParticipantIds: number[] = [...waitingParticipantIds, ...shuffle(lastRoundAliveParticipantIds)];
    if (nextRoundParticipantIds.length > 4) {
        // Remove a player that played in the last round until the number of players will be a factor of 4. Maximum 3 iterations are possible.
        for (let i = 0; i < 3; i++) {
            if (nextRoundParticipantIds.length % 4 === 0) {
                break;
            }
            nextRoundParticipantIds.pop();
        }
    }
    else if (nextRoundParticipantIds.length === 3) {
        nextRoundParticipantIds.pop();
    }

    shuffle(nextRoundParticipantIds);
    if (nextRoundParticipantIds.length >= 4) {
        // const lastRoundOpponents = lastRoundParticipantIds.reduce((acc: { [id: number]: [number, number] }, val: number, i: number, arr: number[]) => {
        //     if (i % 4 === 0) {
        //         acc[val] = [arr[i + 2], arr[i + 3]];
        //     }
        //     if ((i - 1) % 4 === 0) {
        //         acc[val] = [arr[i + 1], arr[i + 2]];
        //     }
        //     if ((i - 2) % 4 === 0) {
        //         acc[val] = [arr[i - 2], arr[i - 1]];
        //     }
        //     if ((i - 3) % 4 === 0) {
        //         acc[val] = [arr[i - 3], arr[i - 2]];
        //     }
        //     return acc;
        // }, {})
        const lastRoundTeammates = lastRoundParticipantIds.reduce((acc: { [id: number]: number }, val: number, i: number, arr: number[]) => {
            if (i % 2 === 0) {
                acc[val] = arr[i + 1];
            }
            if (i % 2 === 1) {
                acc[val] = arr[i - 1];
            }
            return acc;
        }, {})
        const shuffledNextRoundParticipantIds: number[] = [];
        let i = nextRoundParticipantIds.length - 1;
        while (i >= 0) {
            if (lastRoundTeammates[nextRoundParticipantIds[i]] !== nextRoundParticipantIds[i - 1]) {
                shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 1]);
                i = i - 2;
                continue;
            }

            if (lastRoundTeammates[nextRoundParticipantIds[i]] === nextRoundParticipantIds[i - 1]) {
                if (nextRoundParticipantIds[i - 2] && nextRoundParticipantIds[i - 3]) {

                    shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 2], nextRoundParticipantIds[i - 1], nextRoundParticipantIds[i - 3]);
                    if (lastRoundTeammates[nextRoundParticipantIds[i - 1]] === nextRoundParticipantIds[i - 3]) {
                        swapParticipantsToNonRepetitivePairs(lastRoundTeammates, shuffledNextRoundParticipantIds);
                    }
                    i = i - 4;
                }
                else {
                    shuffledNextRoundParticipantIds.push(nextRoundParticipantIds[i], nextRoundParticipantIds[i - 1]);
                    /*
                    Since in the last round next two participants were teammates,
                    none of them could be anyone elses pair, therefore we can
                    swap one of them with any other participant.
                    */
                    swapParticipantsToNonRepetitivePairs(lastRoundTeammates, shuffledNextRoundParticipantIds);
                    i = i - 2;
                }
                continue;
            }
            break;
        }
        return shuffledNextRoundParticipantIds;
    } else if (nextRoundParticipantIds.length === 2) {
        return [...nextRoundParticipantIds]
    }
}

export const generateLMSGameCreateData = (tournamentGames: GamesData, dbTournament: TournamentData): TournamentGameCreateData => {
    const tournamentPlayerIds: number[] = dbTournament.players.map(player => player.id);

    const normalizedGames = tournamentGames.reduce((acc: { [index: string]: GameData }, val: GameData) => {
        if (!val.index) {
            return acc;
        }
        acc[val.index] = val;
        return acc;
    }, {});

    const lastRoundNumber = Object.values(normalizedGames).map(game => splitGameKey(game.index).round).sort(function (a, b) { return b - a })[0];

    const isDYP: boolean = !!normalizedGames['1-1'].player1[1]?.id && !!normalizedGames['1-1'].player2[1]?.id;

    const isMonsterDYP = dbTournament.monsterDYP;

    const playerModification = dbTournament.playerModification;

    const playerLives = getPlayersLives(tournamentGames, tournamentPlayerIds, dbTournament.numberOfLives, playerModification);

    const aliveFilterCallback = (id: number) => {
        return playerLives[id] > 0
    }

    const aliveFilterCallback2D = (pair: [number, number]) => {
        return playerLives[pair[0]] > 0 && playerLives[pair[1]] > 0
    }

    if (isMonsterDYP) {
        const lastRoundParticipantIds: number[] = tournamentGames.reduce(
            (acc: number[], val) => {
                if (!val.player1 || !val.player2) {
                    return acc;
                }
                if (splitGameKey(val.index).round === lastRoundNumber) {
                    if (val.player1[0] && val.player2[0]) {
                        if (val.player1[1] && val.player2[1]) {
                            acc.push(val.player1[0].id, val.player1[1].id, val.player2[0].id, val.player2[1].id);
                        } else {
                            acc.push(val.player1[0].id, val.player2[0].id);
                        }
                    }
                }
                return acc;
            },
            []
        );

        const waitingParticipantIds = tournamentPlayerIds.filter(id => {
            return playerLives[id] > 0 && lastRoundParticipantIds.indexOf(id) === -1
        });

        const lastRoundAliveParticipantIds: number[] = lastRoundParticipantIds.filter(aliveFilterCallback);

        const shuffledNextRoundParticipantIds = getShuffledNextRoundMonsterDYPParticipants(lastRoundParticipantIds, lastRoundAliveParticipantIds, waitingParticipantIds);

        const nextGames: GameInsertData[] = shuffledNextRoundParticipantIds.reduce((acc: GameInsertData[], val: number, i: number, arr: number[]) => {
            if (arr.length >= 4) {
                if (!arr[i + 1] || i % 4 !== 0) {
                    return acc;
                }
                acc.push({
                    player1: [{ id: arr[i] }, { id: arr[i + 1] }],
                    player2: [{ id: arr[i + 2] }, { id: arr[i + 3] }],
                    index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 4)}`
                })
            } else {
                if (!arr[i + 1] || i % 2 !== 0) {
                    return acc;
                }
                acc.push({
                    player1: [{ id: arr[i] }],
                    player2: [{ id: arr[i + 1] }],
                    index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 2)}`
                })
            }
            return acc;
        }, []);

        const gameCreateData = generateGameCreateData(nextGames);

        return gameCreateData;
    }
    if (isDYP) {
        const pairs = tournamentGames.reduce((acc: [number, number][], val: GameData) => {
            if (!val.index || splitGameKey(val.index).round > 1) {
                return acc;
            }
            acc.push([val.player1[0].id, val.player1[1].id], [val.player2[0].id, val.player2[1].id])
            return acc;
        }, [])

        const lastRoundParticipantIds: [number, number][] = tournamentGames.reduce(
            (acc: [number, number][], val) => {
                if (!val.player1 || !val.player2) {
                    return acc;
                }
                if (splitGameKey(val.index).round === lastRoundNumber) {
                    acc.push([val.player1[0].id, val.player1[1].id], [val.player2[0].id, val.player2[1].id]);

                }
                return acc;
            },
            []
        )

        const waitingParticipantIds: [number, number][] = pairs.filter(pair => {
            return playerLives[pair[0]] > 0 && playerLives[pair[1]] > 0 && !arrayAlreadyHasArray(lastRoundParticipantIds, pair)
        })

        const lastRoundAliveParticipantIds: [number, number][] = lastRoundParticipantIds.filter(aliveFilterCallback2D)

        const shuffledNextRoundParticipantIds = getShuffledNextRoundDYPParticipants(lastRoundParticipantIds, lastRoundAliveParticipantIds, waitingParticipantIds);

        const nextGames: GameInsertData[] = shuffledNextRoundParticipantIds.reduce((acc: GameInsertData[], val: [number, number], i: number, arr: [number, number][]) => {
            if (!arr[i + 1] || i % 2 === 1) {
                return acc;
            }
            acc.push({
                player1: [{ id: val[0] }, { id: val[1] }],
                player2: [{ id: arr[i + 1][0] }, { id: arr[i + 1][1] }],
                index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 2)}`
            })
            return acc;
        }, []);
        const gameCreateData = generateGameCreateData(nextGames);
        return gameCreateData;
    }

    const lastRoundParticipantIds: number[] = tournamentGames.reduce(
        (acc: number[], val) => {
            if (!val.player1 || !val.player2) {
                return acc;
            }
            if (splitGameKey(val.index).round === lastRoundNumber) {
                acc.push(val.player1[0].id, val.player2[0].id);
            }
            return acc;
        },
        []
    )

    const waitingParticipantIds = tournamentPlayerIds.filter(id => {
        return playerLives[id] > 0 && lastRoundParticipantIds.indexOf(id) === -1
    })

    const lastRoundAliveParticipantIds = lastRoundParticipantIds.filter(aliveFilterCallback)

    const shuffledNextRoundParticipantIds = getShuffledNextRoundParticipants(lastRoundParticipantIds, lastRoundAliveParticipantIds, waitingParticipantIds);

    const nextGames: GameInsertData[] = shuffledNextRoundParticipantIds.reduce((acc: GameInsertData[], val: number, i: number, arr: number[]) => {
        if (!arr[i + 1] || i % 2 === 1) {
            return acc;
        }
        acc.push({
            player1: [{ id: val }],
            player2: [{ id: arr[i + 1] }],
            index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 2)}`
        })
        return acc;
    }, []);

    const gameCreateData = generateGameCreateData(nextGames);

    return gameCreateData;
}