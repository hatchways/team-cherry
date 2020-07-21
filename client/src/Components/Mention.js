import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  Card: {
    height: "200px",
    borderRadius: "5px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
    maxWidth: "70%",
    maxHeight: "70%",
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
          {props.platform} | Popularity: {props.popularity} | {props.date}
        </Typography>

        <p className={classes.paragraphInMentions}>{props.content}</p>
      </div>
    </div>
  );
}
