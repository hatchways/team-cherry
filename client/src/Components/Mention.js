import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  Card: {
    height: "200px",
    boxShadow: 0,
  },
  CardMedia: {
    width: "220px",
    maxWidth: "90%",
    height: "190px",
    display: "inline-block",
    margin: "5px",
  },
  CardContent: { padding: 0, margin: "16px 16px 16px 0px" },
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
    <Card className={classes.Card} elevation={0}>
      <CardActionArea>
        <Grid container>
          <Grid item xs={4}>
            <CardMedia className={classes.CardMedia} image={props.image} />
          </Grid>

          <Grid item xs={8}>
            <CardContent className={classes.CardContent}>
              <Typography noWrap gutterBottom variant="h5" component="h2">
                {props.title}
              </Typography>

              <Typography
                gutterBottom
                variant="subtitle1"
                component="small"
                className={classes.fontColorForPlatform}
              >
                {props.platform}
              </Typography>

              <p className={classes.paragraphInMentions}>{props.content}</p>
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
