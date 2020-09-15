import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import { withCookies } from 'react-cookie';
import axios from "axios";
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container';

import Head from "next/head";
import Layout from "../../components/Layout";
import Error from "../_error";


/* 302 Found 
Location: https://yourawesomeapp.com/redirect/oauth?code=7faf9c72733ad3472963fdb3cb24b94e2f641a06&state=whateverStateYouHaveSentPreviously */
const Oauth = (props) => {
    const [error, setError] = useState(false);
    const [waitRequest, setWait] = useState(true);
    const router = useRouter()
    const { cookies } = props
    const { code, state } = router.query
    const csrfState = cookies.get('csrfState')

    useEffect(() => {
        console.log(state, csrfState)
        if(!state)
            return
        if (state !== csrfState) {
            /* ERROR INVALID REQUEST */
            setError(true)
        } else {
            axios.post("/imovirtual/oauth/callback", {
                code: code
            })
                .then(() => {
                    setWait(false)
                })
                .catch(err => setError(true))
        }
    }, [state]);

    if (waitRequest && !error)
        return <h1>Loading...</h1>;
    if (error)
        return <Error message="Invalid request state or something went wrong" />;
    return (
        <Layout
            mainTitle="Relive Imovirtual Authentication"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
        >
            <Head>
                <title>Autenticação com Imovirtual</title>
            </Head>
            <Container maxWidth="lg" className="container">
                <h1>
                    Autenticação com Imovirtual completada!
                </h1>
                <p>
                    Tem acesso às funcionalidades do Imovirtual
                </p>
                <Button variant="contained" color="primary" href="/profile">
                    Ver profile
                </Button>
            </Container>
        </Layout>
    );
};

export default withCookies(Oauth);
