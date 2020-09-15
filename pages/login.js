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
import Layout from "../components/Layout";

const Login = (props) => {
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

            mainTitle="Propriedades Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
        >
            <Head>
                <title>Propriedades Relive</title>
            </Head>
            <Container component="main" maxWidth="xs" className="container">
                <div className="paper">
                    <Avatar /* className={classes.avatar} */>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className="form" noValidate onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                        >
                            Sign In
                        </Button>
                        <div>{error}</div>
                    </form>
                </div>
            </Container>
        </Layout>
    );
};

export default withCookies(Login);
