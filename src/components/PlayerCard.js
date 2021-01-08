import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(25,26,26)",
        width: 600,
        border: "1px solid #333",
        color: "#f6f6f6"
    },
  });

const PlayerCard = props => {
    const classes = useStyles();
    const {player} = props;

    return (
        <Card className={classes.root}>
            <img src={player.thumbnail_url} />
            <Typography>{player.name} - {player.realm}</Typography>
            <Typography>{"<" + player.guild.name + ">"}</Typography>
            <Typography>ilvl {player.gear.item_level_equipped}</Typography>
            <Typography>covenant {player.covenant.name}, renown {player.covenant.renown_level}</Typography>
            <Typography>Raid Prog {player.raid_progression["castle-nathria"].summary}</Typography>
        </Card>
    );
}

export default PlayerCard;
