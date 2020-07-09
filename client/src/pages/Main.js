import React, { Component } from "react";

import Mention from "../Components/Mention";
import axios from 'axios'
import SwitchSelector from "react-switch-selector";
import { withStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Switch,
  Avatar,
  ListItemAvatar,
  Divider,
  Grid,
  ListItemSecondaryAction,
} from "@material-ui/core/";
import { uuid } from 'uuidv4';

const useStyles = (theme) => ({
  rightPart: {
    marginTop: "8em",
  },
  SwitchSelector: {
    height: "2.8em",
    width: "30%",
    fontWeight: 400,
  },
  leftPanelGrid: {
    height: "calc(100vh - 5.4em)",
    position: "fixed",
    marginTop: "5.4em",
  },
  leftPanelList: {
    background: "white",
    width: "100%",
  },
  platformItem: {
    height: "6em",
  },
  platformFont: {
    fontWeight: 800,
  },
  platformListItemAvatar: {
    marginRight: "7px",
  },
  platformAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  instruction: {
    textAlign: "center",
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 36,
    height: 19,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(17px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#6583f2",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#6583f2",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 17,
    height: 17,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "#bdc7d4",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

class Main extends Component {
  constructor(props) {
    super(props);

    // Get the params in the URL so we can know which platforms are selected.
    let currentUrlParams = new URLSearchParams(window.location.search);
    let selectedPlatformsInURL = currentUrlParams.get("platforms");
    let splitSelectedPlatforms = [];
    if (selectedPlatformsInURL) {
      splitSelectedPlatforms = selectedPlatformsInURL.split(",");
    }

    this.state = {
      allPlatforms: ["Reddit", "Twitter", "Facebook"],
      platformSelected: [...splitSelectedPlatforms],
      mentions: [],
    };
  }

  sortByPopularity(mentions) {
    mentions.sort((a, b) => {
      return b.popularity - a.popularity
    })
    return mentions
  }

  sortByDate(mentions) {
    mentions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    return mentions
  }

  sortToggle(event) {
    let sortedMentions = this.state.mentions
    if (event === 'Most Recent') {
      sortedMentions = this.sortByDate(this.state.mentions)
    }
    else {
      sortedMentions = this.sortByPopularity(this.state.mentions)
    }
    this.setState({
      mentions: sortedMentions
    })
  }

  render() {
    const { classes } = this.props;

    const handlePlatformToggle = async (value) => {
      if (value.target.checked) {
        await this.setState({
          platformSelected: [...this.state.platformSelected, value.target.name],
        });
      } else {
        let index = this.state.platformSelected.indexOf(value.target.name);
        let temp = this.state.platformSelected;
        temp.splice(index, 1);
        await this.setState({
          platformSelected: temp,
        });
      }

      // Add the selected platforms in to the query params.
      let currentUrlParams = new URLSearchParams();
      currentUrlParams.set("platforms", this.state.platformSelected);
      this.props.history.push(
        window.location.pathname + "?" + currentUrlParams.toString()
      );
    };

    return (
      <div>
        <Grid container spacing={0} className={classes.RootGridContainer}>
          <Grid item xs={4} container></Grid>

          <Grid item xs={6} container direction={"column"} spacing={2}>
            <Grid
              item
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <h1>My mentions</h1>
              <div className={classes.SwitchSelector}>
                <SwitchSelector
                  onChange={(event) => { this.sortToggle(event) }}
                  options={[
                    {
                      label: "Most recent",
                      value: "Most Recent",
                      selectedBackgroundColor: "#6583f2",
                      selectedFontColor: "white",
                    },
                    {
                      label: "Most popular",
                      value: "Most popular",
                      selectedBackgroundColor: "#6583f2",
                      selectedFontColor: "white",
                    },
                  ]}
                  backgroundColor={"#eaeefd"}
                  fontColor={"#6583f2"}
                />
              </div>
            </Grid>

            <Grid item>
              <Mention
                title="PalPay invested $500 million in Company ABC"
                platform="Twitter"
                content="Heat oil in a (14- to 16-inch) paella pan or a large, deep
                skillet over medium-high heat. Add chicken, shrimp and chorizo,
                and cook, stirring occasionally until lightly browned, 6 to 8
                minutes. Transfer shrimp to a large plate and set aside, leaving
                chicken and chorizo in the pan. Add pimentón, bay leaves,
                garlic, tomatoes, onion, salt and pepper, and cook, stirring
                often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a
                boil. broth and remaining 4 1/2 cups chicken broth; bring to a
                boil."
                image="/imgs/dog.jpg"
              />
            </Grid>

            {this.state.mentions.map((current) => {
              return (
                <Grid>
                  <Mention
                    key={uuid()}
                    title={current.title}
                    platform={current.platform}
                    content={current.content}
                    image={current.image}
                  />
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(Main);
