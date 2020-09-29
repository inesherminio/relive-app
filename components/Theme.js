import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
    palette: {
        primary: {
            skin: "#FCD5BD",
            blue: "#9C82BB",
            main: "#632A57",
            yellow: "#FBCD72",
            lightBlue: "#A7D5BE"
        },
        secondary: {
            light: '#92e3bf',
            main: "#EC837C"
        },
        error: {
            light: '#fe518e',
            main: '#ff0000'
        }
    },
    typography: {
        fontWeightMedium: 500,
        body1: {
            fontSize: "1.5em"
        },
        subtitle1: {
            fontSize: "1.3em"
        },
        button: {
            fontSize: "1em",
            lineHeight: "1.75em"
        }
    },
    shape: {
        borderRadius: 5
    },
    h1: {
        fontSize: "5em"
    },
    // overrides global material components styles
    overrides: {
        MuiCircularProgress: {
            indeterminate: {
                animation: 'unset'
            }
        },
        MuiListItem: {
            root: {
                paddingTop: '3px',
                paddingBottom: '3px',
            }
        },
        MuiTypography: {
            body1: {
                lineHeight: 1.2,
                fontSize: '1.2em'
            }
        },
        MuiChip: {
            root: {
                margin: '0 4px'
            },
            colorSecondary: {
                color: '#fff'
            }
        },
        MuiButton: {
            root: {
                minWidth: '0px',
                fontFamily: 'Camphor, Open Sans, Segoe UI, sans-serif',
                borderRadius: '33px',
                textTransform: 'unset',
                padding: '12px 32px'
                // padding: '16px'
            },
            containedPrimary: {
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                color: '#fff',
                margin: '0 16px'
            },
            containedSecondary: {
                color: '#fff',
                background: '#3ecf8e',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                // background: 'linear-gradient(160deg, #3ecf8e 5%, #93a3ef 95%)',
                // background: 'radial-gradient(#3ecf8e 70%, #93a3ef 95%)',
                fontWeight: 700,
                margin: '0 16px'
            },
        },
    }
});