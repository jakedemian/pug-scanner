import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';
import {CovenantColors, ClassColors} from '../utilities/ColorMaps';

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(25,26,26)",
        width: 400,
        border: "1px solid #333",
        color: "#f6f6f6"
    },
    ilvlBox: {
        border: "1px solid white",
        padding: "0 4px",
        borderRadius: 2,
        backgroundColor: "rgb(25,26,26)",
        marginTop: -10
    }
  });

const PlayerCard = props => {
    const classes = useStyles();
    const {player, scoreColors} = props;

    const playerScore = player.mythic_plus_scores_by_season.length > 0 ?
        player.mythic_plus_scores_by_season[0].scores.all :
        0;

    const getScoreColor = score => {
        if(!scoreColors && scoreColors.length == 0){
            return "#FFFFFF";
        }

        for(const scoreData of scoreColors){
            if(score < scoreData.score){
                continue;
            }

            return scoreData.rgbHex;
        }
    }

    return (
        <Card className={classes.root}>
            <div className="flex justify-between items-center p-4">
                <div className="flex flex-col justify-center items-center">
                    <img src={player.thumbnail_url} style={{border: `1px solid ${ClassColors[player.class]}`}}/>
                    <div className={classes.ilvlBox} style={{color: ClassColors[player.class], borderColor: ClassColors[player.class]}}>
                        <Typography>{player.gear.item_level_equipped}</Typography>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6">{player.name}</Typography>
                        <Typography variant="caption" className="ml-4" style={{color: ClassColors[player.class]}}>{player.class}</Typography>
                    </div>
                    <div className="flex justify-between items-center">
                        {player.guild && <Typography variant="caption"  className="italic">{"<" + player.guild.name + ">"}</Typography>}
                        <Typography variant="caption"  className="italic font-thin ml-2">{player.realm}</Typography>
                    </div>

                    <Typography variant="caption" style={{color: CovenantColors[player.covenant.name]}}>{player.covenant.name} (R{player.covenant.renown_level})</Typography>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Typography>{player.raid_progression["castle-nathria"].summary}</Typography>
                    <Typography style={{color: getScoreColor(playerScore)}}>{playerScore}</Typography>
                </div>
            </div>

        </Card>
    );
}

export default PlayerCard;
