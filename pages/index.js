import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";
import Container from '@material-ui/core/Container'

const Index = () => (
    <Layout
        mainTitle="My Home Page built with Next JS"
        footer={`Copyright ${new Date().getFullYear()}`}
    >
        <Head>
            <title>Home Page</title>
        </Head>


{/*         <Link href="/about">
            <a>About page</a>
        </Link> */}
            <Container maxWidth="lg" className="container">
                <h2>Utiliza o menu do topo para navegar ou faz <Link as='/login' href='/login'>login</Link></h2>
                {/* <h3>Estado actual: <span style={{ color: 'red' }}>{displayStatus}</span></h3> */}
            </Container>
    </Layout>
);

export default Index;
