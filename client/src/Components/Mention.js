import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function Mention(props) {
  return (
    <Card style={{ height: "200px" }}>
      <CardActionArea>
        <Grid container>
          <Grid item xs={4}>
            <CardMedia
              style={{
                width: "220px",
                maxWidth: "90%",
                height: "190px",
                display: "inline-block",
                margin: "5px",
              }}
              image={props.image}
            />
          </Grid>

          <Grid item xs={8}>
            <CardContent
              style={{
                padding: 0,
                margin: "16px 16px 16px 0px",
              }}
            >
              <Typography noWrap gutterBottom variant="h5" component="h2">
                {props.title}
              </Typography>

              <Typography
                gutterBottom
                variant="subtitle1"
                component="small"
                style={{ color: "#D3D3D3" }}
              >
                {props.platform}
              </Typography>

              <p
                style={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {props.content}
              </p>
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
