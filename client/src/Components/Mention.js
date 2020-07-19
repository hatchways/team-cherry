import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, ButtonBase } from "@material-ui/core";
import Moment from 'react-moment';

const useStyles = makeStyles(() => ({
  Card: {
    height: "200px",
    width: "100%",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left"
  },
  thumbnailDiv: {
    width: "25%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerDiv: {
    width: "3%",
  },
  thumbnailImg: {
    maxWidth: "90%",
    maxHeight: "90%",
    width: "90%",
    height: "auto"
  },
  contentDiv: {
    width: "69%",
  },
  paragraphInMentions: {
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
  },
  fontColorForPlatform: {
    color: "#D3D3D3",
  },
}));


export default function Mention(props) {
  const classes = useStyles();

  return (
    <ButtonBase className={classes.Card} onClick={(event) => {
      window.open(props.url);
    }}>
      <div className={classes.Card}>
        <div className={classes.thumbnailDiv}>
          {props.image ? (
            <img className={classes.thumbnailImg} src={props.image} alt="" />
          ) : (
              <img
                className={classes.thumbnailImg}
                src={`/imgs/${props.platform}_icon.png`}
                alt=""
              />
            )}
        </div>

        <div className={classes.dividerDiv}></div>

        <div className={classes.contentDiv}>
          <Typography noWrap gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>

          <Typography
            gutterBottom
            variant="subtitle1"
            component="small"
            className={classes.fontColorForPlatform}
          >
            {props.platform} | Popularity: {props.popularity} | <Moment format="YYYY/MM/DD HH:mm">{props.date}</Moment>
          </Typography>

          {
            props.summary ? <p className={classes.paragraphInMentions}>{props.summary}</p> : <p className={classes.paragraphInMentions}>{props.content}</p>
          }
        </div>
      </div>
    </ButtonBase>
  );
}
