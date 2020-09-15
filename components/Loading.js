import Layout from "./Layout";
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

const Loading = ({ message }) => (
    <Layout mainTitle="Loading">
        <Grid container justify='center' style={{ fontSize: '1.5em', fontWeight: 500, color: '#632A57' }}>
            <p>{message}</p>
            <CircularProgress color="secondary" size="3rem" style={{ margin: 'auto 16px'}} />
        </Grid>
    </Layout>
);

export default Loading;
