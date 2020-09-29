import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";
import Container from '@material-ui/core/Container'

const Index = (props) => (
    <Layout
        mainTitle="My Home Page built with Next JS"
        footer={`Copyright ${new Date().getFullYear()}`}
        signedIn={props.signedIn}
    >
        <Head>
            <title>Home Page</title>
        </Head>


        {/*         <Link href="/about">
            <a>About page</a>
        </Link> */}
        <Container maxWidth="lg" className="container">
            {props.signedIn ?
                <h2>Utiliza o menu do topo para navegar</h2>
                :
                <h2>Começa por fazer <Link as='/login' href='/login'>login</Link></h2>
            }

            {/* <h3>Estado actual: <span style={{ color: 'red' }}>{displayStatus}</span></h3> */}
        </Container>
    </Layout>
);

export default Index;
