import { useState } from "react";
import { withCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Head from "next/head";
import Layout from "../../components/Layout";

const NewProp = (props) => {
    const [error, setError] = useState('')
    const router = useRouter()
    const { cookies } = props

    const handleSubmit = e => {
        e.preventDefault();
        axios.post('/api/login', { /* //////////////////// */
            username: e.target.username.value,
            password: e.target.password.value,
        })
            .then(res => {
                const { user, token } = res.data.user
                axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
                cookies.set('token', token, { path: '/' })
                cookies.set('username', user.username, { path: '/' })
                router.push('/imoveis')
            })
            .catch(err => {
                setError('Login inválido!')
            })
        /* Then redirect to imoveis with cookie token */
    }

    return (
        <Layout
            mainTitle="Nova propriedade Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
            signedIn={props.signedIn}
        >
            <Head>
                <title>Nova propriedade Relive</title>
            </Head>
            <iframe src="https://relive.pt/submit/?title=Telogo" loading="lazy" style={{ width: '100%', height: '1000px' }} title="Submeter Propriedade Relive">


            </iframe>
            <Container component="main" maxWidth="xs" className="container">

            </Container>
        </Layout>
    );
};

export default withCookies(NewProp);
