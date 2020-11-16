import { useState, useEffect } from "react";
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';

import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Error from "./_error";

import PublicIcon from '@material-ui/icons/Public'
import CreateIcon from '@material-ui/icons/Create'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'

import { auth } from '../utils/auth'


/* import WPAPI from 'wpapi'  */
/* const apiPromise = WPAPI.discover( 'https://relive.pt' ).then(function( site ) {
    return site.auth({
        username: 'sergioferras97', ////////////////////////// ENV
        password: 'S@ndw1ch_123'
    });
}); */

/* const WPAPI = require("wpapi"); */

/* const site = new WPAPI({
    endpoint: 'https://relive.pt/wp-json',
    username: 'sergioferras97',
    password: 'S@ndw1ch_123',
    auth: true
}); */

/* const apiPromise = WPAPI.discover( 'https://relive.pt' ).then(function( site ) {
    return site.auth({
        username: 'sergioferras97', ////////////////////////// ENV
        password: 'S@ndw1ch_123'
    });
}); */

/* site.imoveis = site.registerRoute('wp/v2/imoveis');
site.imoveis().then(d => console.log(d)); */

/* wp.users()

    .then(function (res) {
        console.log("1 ", res);
    })

    .catch(function (err) {
        console.log("ERROR 1 ",err);

    }); */

/* const site = new WPAPI({ endpoint: 'https://relive.pt/wp-json' });

site.imoveis = site.registerRoute('imoveis');
site.imoveis().then(d => console.log(d)); */



const Imoveis = (props) => {
    const [properties, setProperties] = useState([]);
    const [imoProperties, setImoProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [ImoError, setImoError] = useState(null);

    /*     const handlePage = async (i) => {
            try {
                const res = await fetch("https://relive.pt/wp-json/wp/v2/imoveis?page=" + i);
                const resJson = await res.json();
                setProperties(resJson.data)
            } catch (err) {
                console.log("ERROR", err);
            }
        }; */

    /*     const handleImages = async (i) => {
            
            try {
                const res = await fetch("https://relive.pt/wp-json/wp/v2/imoveis?page=" + i);
                const resJson = await res.json();
                setProperties(resJson.data)
            } catch (err) {
                console.log("ERROR", err);
            }
        }; */

    const deleteAdvert = (uuid) => {
        axios.delete(`/imovirtual/advert/${uuid}`)
            .then(res => {

            })
            .catch(err => {
                console.log(err)
            })
    }


    useEffect(() => {
        axios.get("/api/imoveis")
            .then(res => {

                axios.get("/imovirtual/adverts/database")
                    .then(res2 => {
                        const newData = []
                        let auxFind = false
                        res.data.map(d => {
                            auxFind = false
                            res2.data.adverts.map(a => {
                                if (a.website == d.id)
                                    return auxFind = a.status
                            })
                            newData.push({
                                ...d,
                                inImovirtual: auxFind,

                            })
                        })
                        console.log(newData)
                        setProperties(newData)
                        /*  setImoProperties(res2.data.adverts || []) */
                        setLoading(false)
                    })
                    .catch(err => {
                        setProperties(res.data)
                        setImoError(true)
                        setLoading(false)
                        console.log(err)
                    })

                /* setProperties(res.data) */
                /* setLoading(false) */
            })
            .catch(err => {
                setError(true)
                console.log(err)
            })
    }, []);

    if (error)
        return <Error message="Could not load Website properties, Please try later" />;
    if (loading)
        return <Loading message="A carregar imoveis" />;
    return (
        <Layout
            mainTitle="Propriedades Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
            signedIn={props.signedIn}
        >
            <Head>
                <title>Propriedades Relive</title>
            </Head>
            <Container maxWidth="lg" className="container">
                <Grid container>
                    <Grid item xs={12}>
                        <h2>Número total de propriedades no Website: {properties.length}</h2>
                        {ImoError &&
                            <h3>Could not load Imovirtual, App connection missing or something wrong</h3>
                        }
                        <List className="lista">
                            {properties.map((b, i) => {
                                const media = b._embedded["wp:featuredmedia"]
                                return (
                                    <Link as={`/imovel/${b.id}`} href={`/imovel/?id=${b.id}`} key={b.id}>
                                        <a className="nostyle">
                                            <ListItem key={b.id} button className="lista-item">
                                                <ListItemAvatar>
                                                    <Avatar
                                                        className="avatar"
                                                        variant="rounded"
                                                        alt={`Propriedade ID:${b.id}`}
                                                        src={media && media[0].source_url}
                                                    />
                                                </ListItemAvatar>
                                                {/* <ListItemText className="lista-text" id={b.id} primary={b.title.rendered} /> */}
                                                <h2 className="lista-text">{b.title.rendered}</h2>
                                                <ListItemSecondaryAction>
                                                    {(b["imovel-estado"].includes(174) || b["imovel-estado"].includes(175)) && /* Vendido ou Arrendado */
                                                        <Chip
                                                            color="primary"
                                                            icon={<CheckCircleIcon />}
                                                            label="Vendido"
                                                        />
                                                    }
                                                    <Chip
                                                        color={b.status === 'publish' ? "primary" : b.status === 'pending' ? "secondary" : "default"}
                                                        icon={b.status === 'publish' ? <PublicIcon /> : <CreateIcon />}
                                                        label={b.status === 'publish' ? "Publicado" : b.status === 'pending' ? "Revisão pendente" : "Rascunho"}
                                                    />
                                                    <Chip
                                                        color={b.inImovirtual ? "primary" : "secondary"}
                                                        icon={b.inImovirtual === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                                                        label={b.inImovirtual === 'active' ? "Imovirtual" : b.inImovirtual ? "Imovirtual " + b.inImovirtual : "Imovirtual"}
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </a>
                                    </Link>
                                )
                            })}
                        </List>
                    </Grid>
                    {/* <Grid item xs={6}>
                        {ImoError ?
                            'Could not load Imovirtual Properties, App connection missing or something wrong'
                            :
                            <>
                                <h2>Número total de propriedades Imovirtual: {imoProperties.length}</h2>
                                <List className="lista">
                                    {imoProperties.map((b, i) => {
                                        return (
                                            <div key={b.uuid}>
                                                <a href={b.state.url} target="_blank">State: {b.state.code}</a>
                                                <p>{b.uuid}</p>
                                                <a onClick={() => deleteAdvert(b.uuid)}>Delete Advert</a>
                                            </div>
                                        )
                                    })}
                                </List>
                            </>
                        }
                    </Grid> */}
                </Grid>
            </Container>
        </Layout>
    );
};

// This gets called on every request
/* export async function getServerSideProps(ctx) {
    const token = auth(ctx);

    let data = []
    try {
        axios.defaults.baseURL = 'https://relive.pt/wp-json'

        await axios.post('/jwt-auth/v1/token', { username: 'sergioferras97', password: process.env.PASS })
            .then(res => {
                axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
            })
            .catch(e => console.log("WTF", e))
        const res = await axios.get("/wp/v2/imoveis?_embed&per_page=100&status=pending,publish,draft");
        data = res.data;
    } catch (err) {
        console.log("ERROR", err.message);
    }
    return { props: { data } }
} */

/* Imoveis.getInitialProps = async () => {

    let data = []
    const images = []
    try {
        console.log("GETTING IMOVEIS FROM WP")
        const res = await axios.get("/wp/v2/imoveis?_embed&per_page=100&status=pending,publish,draft");
        data = res.data;
    } catch (err) {
        console.log("ERROR", err.message);
    }
    return {
        data,
        images
    };
}; */

export default Imoveis;
