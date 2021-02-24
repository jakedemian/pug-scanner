class Utilities {
    getScoreColor = (score, scoreColors) => {
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

    getScoreTextColor = (score, scoreColors) => {
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
}

// i dont think i need a singleton
const instance = new Utilities();
export default instance;
