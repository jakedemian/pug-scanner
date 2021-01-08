import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';
import {CovenantColors} from '../utilities/ColorMaps';

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
    const {player} = props;

    

    return (
        <Card className={classes.root}>
            <div className="flex justify-between items-center p-4">
                <div className="flex flex-col justify-center items-center">
                    <img src={player.thumbnail_url} />
                    <div className={classes.ilvlBox}>
                        <Typography>{player.gear.item_level_equipped}</Typography>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Typography variant="h6">{player.name}</Typography>
                    <Typography className="italic">{"<" + player.guild.name + ">"}</Typography>
                    <Typography variant="caption" style={{color: CovenantColors[player.covenant.name]}}>{player.covenant.name} (R{player.covenant.renown_level})</Typography>
                    <Typography variant="caption">{player.realm}</Typography>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Typography>{player.raid_progression["castle-nathria"].summary}</Typography>
                    <Typography>
                        {player.mythic_plus_scores_by_season.length > 0 ? 
                        player.mythic_plus_scores_by_season[0].scores.all :
                        "No score"}
                    </Typography>
                </div>
            </div>
            
        </Card>
    );
}

export default PlayerCard;
