import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        color: "white",
        display: "flex"
    },
    groupInfoBlock: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        padding: "4px 8px",
        width: 128,
        marginLeft: 8
    }
}));

const GroupSummary = props => {
    const classes = useStyles();
    const {players, getScoreColor} = props;
    const [avgScore, setAvgScore] = useState(null);
    const [avgIlvl, setAvgIlvl] = useState(null);

    useEffect(() => {
        if(!!players && players.length > 0){
            let scoreAcc = 0;
            for(const player of players){
                if(!!player?.mythic_plus_scores_by_season?.[0]?.scores?.all){
                    scoreAcc += player.mythic_plus_scores_by_season[0].scores.all;
                }
            }
            setAvgScore(scoreAcc / players.length);

            let ilvlAcc = 0;
            for(const player of players){
                if(!!player?.gear?.item_level_equipped){
                    ilvlAcc += player.gear.item_level_equipped;
                }
            }
            setAvgIlvl(ilvlAcc / players.length);
        } else {
            setAvgScore(null);
            setAvgIlvl(null);
        }
    }, [players]);


    return !!players && players.length > 0 ? (
        <div className="text-white flex justify-start items-center">
            <div className={classes.groupInfoBlock} style={{backgroundColor: getScoreColor(avgScore?.toFixed(1))}}>
                <Typography variant="caption">Avg Score</Typography>
                <Typography>{avgScore?.toFixed(1)}</Typography>
            </div>
            <div className={classes.groupInfoBlock} style={{backgroundColor: "#0e0e0e"}}>
                <Typography variant="caption">Avg ilvl</Typography>
                <Typography>{avgIlvl?.toFixed(1)}</Typography>
            </div>
        </div>
    ) : null;
};

export default GroupSummary;
