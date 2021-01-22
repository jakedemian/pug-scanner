import {makeStyles} from '@material-ui/styles';
import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react';
import {Icon, IconButton, TextField, Typography} from '@material-ui/core';
import PlayerCard from '../components/PlayerCard';
import logo from '../assets/images/logo.png';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import GroupSummary from "../components/GroupSummary";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from "@material-ui/lab/AlertTitle";

const useStyles = makeStyles({
    root: {
        height: "100vh",
        display: "flex",
        justifyContent: "center"
    },
    wrapper: {
        width: 850
    },
    mainTextField: {
        width: "100%",
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: "#fca503"
        },
        "& .MuiOutlinedInput-root": {
            color: "white",
            backgroundColor: "#111",
            "& textarea::placeholder": {
                color: "#eee"
            }
        }
    },
    cardWrapper: {
        marginTop: 16,
        width: "100%"
    },
    cardGrid: {
        display: "grid",
        gridTemplateColumns: "50% 50%",
    }
});

// Primepriest-Stormrage;Orillun-Stormrage;Kupunch-Stormrage;Vespe-Stormrage;Fancymoose-Stormrage;Bigoofta-Stormrage

// _group:Primepriest-Stormrage
// _applicants:Kmalock-Quel'Thalas;Dunnmor-MoonGuard;Manwarrior-MoonGuard;
//















// TODO
/*

- add role played in recent keys
- hovering a score should show the dps/healer/tank score breakdown
- add a x/10 to loading animation.  eg 6/22 players loaded

*/
// TODO













const Homepage = props => {
    const classes = useStyles();
    const inputRef = useRef(null);

    const [pastedString, setPastedString] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [failedCharacters, setFailedCharacters] = useState([]);
    const [players, setPlayers] = useState([]);
    const [applicants, setApplicants] = useState([]);

    const [groupSectionShow, setGroupSectionShow] = useState(true);
    const [appSectionShow, setAppSectionShow] = useState(true);

    const [scoreColors, setScoreColors] = useState([]);

    const getScoreColor = score => {
        if(!scoreColors && scoreColors.length == 0 && isNaN(Number(score))){
            return "#0e0e0e";
        }

        for(const scoreData of scoreColors){
            if(score < scoreData.score){
                continue;
            }
            return scoreData.rgbHex;
        }
    };

    const getScoreTextColor = score => {
        // get background color as int array
        if(!scoreColors && scoreColors.length == 0 && isNaN(Number(score))){
            return "#FFFFFF";
        }

        let colorIntArray = [];
        for(const scoreData of scoreColors){
            if(score < scoreData.score){
                continue;
            }

            colorIntArray = scoreData.rgbInteger;
        }

        const brightness = Math.round(((parseInt(colorIntArray[0]) * 299) +
            (parseInt(colorIntArray[1]) * 587) +
            (parseInt(colorIntArray[2]) * 114)) / 1000);

        return (brightness > 125) ? '#000' : '#fff';
    };

    const fetchScoreColors = async () => {
        let url = "https://raider.io/api/v1/mythic-plus/score-tiers?season=current";
        let res = await axios.get(url);
        setScoreColors(res.data);
    };

    const fetchPlayers = async () => {
        setIsFetching(true);
        const groupStringStart = pastedString.indexOf("_group:") + "_group:".length;
        const groupStringEnd = pastedString.substr(groupStringStart).indexOf("\n");
        const groupString = pastedString.substr(groupStringStart, groupStringEnd);

        let groupNamesArray = groupString.split(";");
        let groupNameData = [];

        for (let i = 0; i < groupNamesArray.length; i++) {
            if(groupNamesArray[i].trim().length === 0){
                continue;
            }

            let character = groupNamesArray[i].split("-");
            groupNameData.push({
                "name": character[0],
                "realm": character[1]
            })
        }

        let playersArray = [];

        let failed = [];
        let url = "https://raider.io/api/v1/characters/profile?region=us&fields=gear,guild,covenant,mythic_plus_ranks,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs&";
        for (let i = 0; i < groupNameData.length; i++) {
            let thisUrl = url + "realm=" + groupNameData[i].realm + "&name=" + groupNameData[i].name;

            let res;
            try {
                res = await axios.get(thisUrl);
            } catch (err) {
                failed.push(groupNameData[i].name + "-" + groupNameData[i].realm);
                console.error(err);
                continue;
            }

            playersArray.push(res.data);
        }
        setPlayers(playersArray);


        // move this to a getapplicants function
        if(pastedString.indexOf("_applicants:") > -1) {
            const applicantsStart = pastedString.indexOf("_applicants:") + "_applicants:".length;
            const applicantsEnd = pastedString.substr(applicantsStart).indexOf("\n");
            const applicantsString = pastedString.substr(applicantsStart, applicantsEnd);

            let applicantNamesArray = applicantsString.split(";");
            let applicantNameData = [];

            for (let i = 0; i < applicantNamesArray.length; i++) {
                if (applicantNamesArray[i].trim().length === 0) {
                    continue;
                }

                let character = applicantNamesArray[i].split("-");
                applicantNameData.push({
                    "name": character[0],
                    "realm": character[1]
                })
            }

            let applicantsArray = [];
            for (let i = 0; i < applicantNameData.length; i++) {
                let thisUrl = url + "realm=" + applicantNameData[i].realm + "&name=" + applicantNameData[i].name;

                let res;
                try {
                    res = await axios.get(thisUrl);
                } catch (err) {
                    failed.push(applicantNameData[i].name + "-" + applicantNameData[i].realm);
                    console.error(err);
                    continue;
                }

                applicantsArray.push(res.data);
            }

            if (failed.length > 0) {
                setFailedCharacters(failed);
                console.log("Failed to load the following characters: ", failedCharacters);
            }
            setApplicants(applicantsArray);

        } else {
            setApplicants([]);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        console.log("pasted string is", pastedString);
        if (!!pastedString) {
            fetchPlayers();
        }
    }, [pastedString]);

    useEffect(() => {
        fetchScoreColors();
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <div>
                    <img src={logo} className="inline"/>
                    <div className="inline-block" style={{transform: "translateY(7px)"}}>
                        <Typography className="text-gray-500 italic">v0.4</Typography>
                    </div>
                </div>
                <TextField
                    ref={inputRef}
                    className={classes.mainTextField}
                    placeholder="Paste /ps string here"
                    autoFocus
                    multiline
                    rows={4}
                    variant="outlined"
                    value={pastedString}
                    onKeyPress={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onPaste={(e) => {
                        if (pastedString !== e.clipboardData.getData('Text')) {
                            // only set if not exactly the same, otherwise it doesnt work right
                            setPastedString(e.clipboardData.getData('Text'));
                            setFailedCharacters([]);
                        }
                        e.stopPropagation();
                    }}
                />
                {!!pastedString && (
                    <div>
                        <Button
                            className="text-white"
                            onClick={() => {
                                setPastedString("");
                                inputRef.current.querySelector("textarea").value = "";
                                setPlayers([]);
                                setApplicants([]);
                                setFailedCharacters([]);
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                )}

                {failedCharacters.length > 0 && (
                    <Alert severity="warning">
                        <AlertTitle>Failed to load the following characters:</AlertTitle>
                        {failedCharacters.map((character, index) => {
                            return (
                                <Typography key={index} variant="caption" className="block">{character}</Typography>
                            )
                        })}
                    </Alert>
                )}

                <div className={classes.cardWrapper}>
                    {isFetching ? (
                        <div className="w-full flex flex-col items-center justify-center">
                            <CircularProgress style={{color: "#fca503"}}/>
                            <Typography className="text-white">Retreiving character info...</Typography>
                        </div>
                    ) : (
                        <div>
                            <GroupSummary players={players} getScoreColor={getScoreColor} getScoreTextColor={getScoreTextColor}/>

                            {!!players && !!players.length > 0 && (
                                <div className="mt-16">
                                    <div className="flex justify-start items-center">
                                        <Typography variant="h5" className="text-white">Your Group</Typography>
                                        <IconButton style={{outline: "none"}} onClick={() => setGroupSectionShow(!groupSectionShow)}><Icon style={{color: "#323232"}}>{groupSectionShow ? 'visibility' : 'visibility_off'}</Icon></IconButton>
                                        {!groupSectionShow && players.length > 0 && <Typography style={{color: "#323232"}}>{`${players.length} hidden player(s)`}</Typography>}
                                    </div>
                                    {groupSectionShow && (
                                        <div className={classes.cardGrid}>
                                            {players.map((player, index) => {
                                                return (
                                                    <div key={index} className={classes.cardWrapper}>
                                                        <PlayerCard player={player} getScoreColor={getScoreColor}/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                            </div>
                            )}

                            {!!applicants && !!applicants.length > 0 && (
                            <div className="mt-16">
                                <div className="flex justify-start items-center">
                                    <Typography variant="h5" className="text-white">Group Finder Applicants</Typography>
                                    <IconButton style={{outline: "none"}} onClick={() => setAppSectionShow(!appSectionShow)}><Icon style={{color: "#323232"}}>{appSectionShow ? 'visibility' : 'visibility_off'}</Icon></IconButton>
                                    {!appSectionShow && applicants.length > 0 && <Typography style={{color: "#323232"}}>{`${applicants.length} hidden player(s)`}</Typography>}
                                </div>
                                {appSectionShow && (
                                    <div className={classes.cardGrid}>
                                        {applicants.map((player, index) => {
                                            return (
                                                <div key={index} className={classes.cardWrapper}>
                                                    <PlayerCard player={player} getScoreColor={getScoreColor}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
