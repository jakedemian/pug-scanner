import React, {useState} from 'react';
import {Icon, IconButton, Typography} from "@material-ui/core";
import PlayerCard from "./PlayerCard";
import Utilities from "../utilities/Utilities";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    cardWrapper: {
        marginTop: 16,
        width: "100%"
    }
});

const PlayerList = props => {
    const classes = useStyles();
    const {
        playerData,
        getScoreColor,
        label
    } = props;

    const [groupSectionShow, setGroupSectionShow] = useState(true);

    return <div>
        <div className="mt-16">
            <div className="flex justify-start items-center">
                <Typography variant="h5" className="text-white">{label}</Typography>
                <IconButton style={{outline: "none"}} onClick={() => setGroupSectionShow(!groupSectionShow)}>
                    <Icon style={{color: "#323232"}}>{groupSectionShow ? 'visibility' : 'visibility_off'}</Icon>
                </IconButton>
                {!groupSectionShow && playerData.length > 0 &&
                <Typography style={{color: "#323232"}}>{`${playerData.length} hidden player(s)`}</Typography>}
            </div>

            {groupSectionShow && (
                <div>
                    {playerData.sort((a,b)=> {
                        return b?.mythic_plus_scores_by_season?.[0].scores.all - a?.mythic_plus_scores_by_season?.[0].scores.all
                    }).map((player, index) => {
                        return (
                            <div key={index} className={classes.cardWrapper}>
                                <PlayerCard player={player} getScoreColor={getScoreColor}/>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
};

export default PlayerList;