import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';
import {CovenantColors, ClassColors} from '../utilities/ColorMaps';
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import wowLogo from '../assets/images/world-of-warcraft.svg';
import raiderioLogo from '../assets/images/raiderio.svg';
import Link from "@material-ui/core/Link";

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
    },
    expandButton: {
        border: "none",
        outline: "none",
        width: "100%",
        "&:focus": {
            outline: "none"
        }
    },
    linkIcon: {
        width: 20,
        height: 20,
        margin: "0 2px"
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
    };

    return (
        <Card className={classes.root}>
            <div>
                <div className="flex justify-between items-center p-4">
                    <div className="flex flex-col justify-center items-center">
                        <img src={player.thumbnail_url} style={{border: `1px solid ${ClassColors[player.class]}`}}/>
                        <div className={classes.ilvlBox} style={{color: ClassColors[player.class], borderColor: ClassColors[player.class]}}>
                            <Typography>{player.gear.item_level_equipped}</Typography>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-between items-center">
                            <Typography variant="h6" style={{color: ClassColors[player.class]}}>{player.name}</Typography>
                            <Typography variant="caption" className="ml-4" style={{color: ClassColors[player.class]}}>{player.class}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            {player.guild && <Typography variant="caption"  className="italic">{"<" + player.guild.name + ">"}</Typography>}
                            <Typography variant="caption" className="italic font-thin ml-2 text-gray-500">{player.realm}</Typography>
                        </div>

                        <Typography variant="caption" style={{color: CovenantColors[player.covenant.name]}}>{player.covenant.name} (R{player.covenant.renown_level})</Typography>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <Typography>{player.raid_progression["castle-nathria"].summary}</Typography>
                        <Typography className="font-bold" style={{color: getScoreColor(playerScore)}}>{playerScore}</Typography>
                        <div className="flex justify-center items-center">
                            <Link target="_blank" href={`https://worldofwarcraft.com/en-us/character/${player.region}/${player.realm.toLowerCase()}/${player.name.toLowerCase()}`}><img className={classes.linkIcon} src={wowLogo}/></Link>
                            <Link target="_blank" href={`https://raider.io/characters/${player.region}/${player.realm.toLowerCase()}/${player.name}`}><img className={classes.linkIcon} src={raiderioLogo}/></Link>
                        </div>
                    </div>
                </div>
            </div>
            <Button className={`${classes.expandButton}`}><Icon className="text-white">expand_more</Icon></Button>
        </Card>
    );
}

export default PlayerCard;
