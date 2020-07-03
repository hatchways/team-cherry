import React, { Component } from "react";
import Header from "../Components/Header";
import Mention from "../Components/Mention";
import Grid from "@material-ui/core/Grid";
import SwitchSelector from "react-switch-selector";
import { withStyles } from "@material-ui/core/styles";

const useStyles = () => ({
  RootGridContainer: {
    marginTop: "25px",
  },
  SwitchSelector: {
    height: "2.8em",
    width: "30%",
    fontWeight: 400,
  },
});

class Main extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Header />
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
                  // onChange={onChange}
                  options={[
                    {
                      label: "Most recent",
                      value: {
                        foo: true,
                      },
                      selectedBackgroundColor: "#6583f2",
                      selectedFontColor: "white",
                    },
                    {
                      label: "Most popular",
                      value: "bar",
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
                platform="Reddit"
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

            <Grid item>
              <Mention
                title="PalPay invested $500 million in Company ABC"
                platform="Facebook"
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
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(Main);
