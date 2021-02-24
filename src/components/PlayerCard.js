import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';
import {CovenantColors, ClassColors} from '../utilities/ColorMaps';
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import wowLogo from '../assets/images/world-of-warcraft.svg';
import raiderioLogo from '../assets/images/raiderio.svg';
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DungeonList from "./DungeonList";

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(25,26,26)",
        //width: 400,
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
    },
    dungeonStar: {
        color: "#fca503",
        fontSize: 14,
        marginTop: -2
    },
    dungeonListItem: {
        width: "75%",
        height: 18,
        padding: 0,
        "&:hover": {
            backgroundColor: "#fff1"
        }
    },
    longGuildName: {
        fontSize: 10,
        maxWidth: 100,
        textAlign: "center"
    }
  });

const PlayerCard = props => {
    const classes = useStyles();
    const {player, getScoreColor} = props;

    const serverBanList = {
        "Ragnaros": true,
        "Azralon": true
    };

    const playerScore = player.mythic_plus_scores_by_season.length > 0 ?
        player.mythic_plus_scores_by_season[0].scores.all :
        0;

    return (
        <Card className={classes.root} style={{opacity: !!serverBanList[player.realm] ? 0.3 : 1}}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col justify-center item-center">
                    <div className="flex justify-between items-center p-4">
                        <div className="flex flex-col justify-center items-center">
                            <img src={player.thumbnail_url} style={{border: `1px solid ${ClassColors[player.class]}`}}/>
                            <div className={classes.ilvlBox} style={{color: ClassColors[player.class], borderColor: ClassColors[player.class]}}>
                                <Typography>{player.gear.item_level_equipped}</Typography>
                            </div>
                            <Typography
                                variant={'h4'}
                                className={`${playerScore > 0 ? "font-bold" : "italic text-red-500"}`}
                                style={{color: playerScore > 0 && getScoreColor(playerScore)}}
                            >
                                {playerScore > 0 ? playerScore.toFixed(0) : "No Score"}
                            </Typography>
                        </div>
                        <div className="flex flex-col justify-center items-start ml-8">
                            <div className="flex justify-between items-center">
                                <Typography variant="h5" className='font-bold' style={{color: ClassColors[player.class]}}>{player.name}</Typography>
                                <Typography
                                    variant="caption"
                                    className="italic font-thin ml-2"
                                    style={{color: !!serverBanList[player.realm] ? "red" : "#ccc"}}
                                >
                                    {player.realm}
                                </Typography>
                            </div>

                            <div className="flex justify-between items-center">
                                {player.guild && (
                                    <Typography
                                        variant="caption"
                                        className='italic'
                                    >
                                        {"<" + player.guild.name + ">"}
                                    </Typography>
                                )}
                            </div>
                            <Typography variant="caption" style={{color: ClassColors[player.class]}}>{player.class}</Typography>

                            <div className="flex justify-start items-center mt-8">
                                {player.covenant && <Typography className="mr-2" variant="caption" style={{color: CovenantColors[player.covenant.name]}}>{player.covenant.name} (R{player.covenant.renown_level})</Typography>}
                                <Typography className="mr-2">{player.raid_progression["castle-nathria"].summary}</Typography>
                                <div className="flex justify-center items-center">
                                    <Link target="_blank" href={`https://worldofwarcraft.com/en-us/character/${player.region}/${player.realm.toLowerCase()}/${player.name.toLowerCase()}`}><img className={classes.linkIcon} src={wowLogo}/></Link>
                                    <Link target="_blank" href={`https://raider.io/characters/${player.region}/${player.realm.toLowerCase()}/${player.name}`}><img className={classes.linkIcon} src={raiderioLogo}/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex justify-end items-start mt-4">
                    <div>
                        <Typography style={{textAlign: "center"}}>Best Runs</Typography>
                        <List className="w-full flex flex-col justify-center items-center">
                            {player.mythic_plus_best_runs.map((run, index) => {
                                if(index > 2) return; // only show best 3
                                // FIXME MASSIVE DUPLICATE CODE FRAGMENT!!!
                                let stars = [];
                                for(let i = 0; i < run.num_keystone_upgrades; i++){
                                    stars.push(<Icon className={classes.dungeonStar}>star</Icon>);
                                }

                                const date = new Date(run.completed_at);
                                const dateString = `${date.getMonth()+1}/${date.getDate()+1}/${date.getFullYear().toString().substr(2)}`

                                return (
                                    <DungeonList {...{
                                        run, index, stars, dateString
                                    }} />
                                )
                            })}
                        </List>
                    </div>
                    <div>
                        <Typography style={{textAlign: "center"}}>Recent Keys</Typography>
                        <List className="w-full flex flex-col justify-center items-center">
                            {player.mythic_plus_recent_runs.map((run, index) => {
                                if(index >= 6) return; // only show best 3


                                let stars = [];
                                for(let i = 0; i < run.num_keystone_upgrades; i++){
                                    stars.push(<Icon className={classes.dungeonStar}>star</Icon>);
                                }

                                const date = new Date(run.completed_at);
                                const dateString = `${date.getMonth()+1}/${date.getDate()+1}/${date.getFullYear().toString().substr(2)}`

                                return (
                                    <ListItem key={index} dense className={classes.dungeonListItem}>
                                        <Link className="w-full flex justify-between items-center" href={run.url} target="_blank">
                                            <div style={{width: 60}} className="text-left">
                                                <Typography variant="caption" className={"italic text-gray-500"}>{dateString}</Typography>
                                            </div>
                                            <div style={{width: 100}} className="text-right">
                                                <Typography variant="caption" style={{color: run.num_keystone_upgrades === 0 ? "red" : "inherit"}}>{run.short_name} +{run.mythic_level}</Typography>
                                            </div>
                                            <div style={{width: 70}} className="flex justify-end items-center">
                                                {run.num_keystone_upgrades > 0 ? (
                                                    <div className="flex justify-start items-center">
                                                        {stars}
                                                    </div>
                                                ) : (
                                                    <Icon style={{color: "red", fontSize: 14}}>cancel</Icon>
                                                )}
                                            </div>
                                        </Link>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default PlayerCard;
