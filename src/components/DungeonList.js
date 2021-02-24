import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import {Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
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
    }
});

const DungeonList = props => {
    const classes = useStyles();
    const {
        run,
        dateString,
        index,
        stars
    } = props;
    return (
        <ListItem key={index} dense className={classes.dungeonListItem}>
            <Link className="w-full flex justify-between items-center" href={run.url} target="_blank">
                <div style={{width: 60}} className="text-left">
                    <Typography variant="caption" className={"italic text-gray-500"}>{dateString}</Typography>
                </div>
                <div style={{width: 100}} className="text-right">
                    <Typography variant="caption">{run.short_name} +{run.mythic_level}</Typography>
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
};

export default DungeonList;