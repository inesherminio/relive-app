import Nav from "./Nav"
import { MuiThemeProvider } from "@material-ui/core/styles"
import theme from "./Theme"

const Layout = ({ mainTitle, footer, children, signedIn }) => (
    <MuiThemeProvider theme={theme}>
        <Nav mainTitle={mainTitle} signedIn={signedIn} />
        {children}
        <hr />
        <h3 className="footer">{footer}</h3>
    </MuiThemeProvider>
);

export default Layout;
