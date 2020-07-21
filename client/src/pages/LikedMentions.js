import React, { useEffect, useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";

import Mention from "../components/Mention";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: "3%",
  },
}));

const LikedMentions = (props) => {
  const classes = useStyles();
  // this might need to be refactored into a context state
  const [mentions, setMentions] = useState([]);
  useEffect(() => {
    async function getLikedMentions() {
      const res = await axios.get("/api/users/mentions/liked");
      setMentions(res.data.mentions);
    }
    getLikedMentions();
  }, []);

  return (
    <Grid className={classes.container}>
      <h1 style={{ textAlign: "center" }}>Page for liked mentions</h1>
      {mentions.map((m) => {
        const mention = m.Mention;
        return (
          <Mention
            key={mention.id}
            id={mention.id}
            image={mention.imageUrl}
            title={mention.title}
            platform={mention.platform}
            content={mention.content}
            popularity={mention.popularity}
            date={mention.date}
          />
        );
      })}
    </Grid>
  );
};

export default LikedMentions;
