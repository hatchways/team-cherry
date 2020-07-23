import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Button,
} from "@material-ui/core";
import Mention from "../Mention";

const MentionDialog = ({ open, handleClose, mention, toggleLike }) => {
  return (
    <Dialog open={open} maxWidth="md" fullWidth={true}>
      <DialogContent>
        <Mention
          inList={false}
          id={mention.id}
          handleLikeToggle={toggleLike}
          liked={true}
          image={mention.imageUrl}
          title={mention.title}
          platform={mention.platform}
          content={mention.content}
          popularity={mention.popularity}
          date={mention.date}
        />
      </DialogContent>

      <Divider></Divider>

      <DialogActions>
        <a href={`${mention.url}`} style={{ textDecoration: "none" }}>
          <Button>Original Post</Button>
        </a>
        <Button onClick={() => handleClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MentionDialog;
