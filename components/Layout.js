import Nav from "./Nav"
import { MuiThemeProvider } from "@material-ui/core/styles"
import theme from "./Theme"

const Layout = ({ mainTitle, footer, children }) => (
    <MuiThemeProvider theme={theme}>
        <Nav mainTitle={mainTitle} />
        {children}
        <hr />
        <h3 className="footer">{footer}</h3>
    </MuiThemeProvider>
);

export default Layout;
