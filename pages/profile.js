import { useState, useEffect } from "react";
import moment from 'moment'
import { withCookies } from 'react-cookie';
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import Error from "./_error";

import PublicIcon from '@material-ui/icons/Public'
import CreateIcon from '@material-ui/icons/Create'

const csrfState = Math.random().toString(36).substring(7);

const advertCode = (code) => {
    switch (code) {
        case 'active':
            return <span style={{ color: 'green' }}>Anúncio criado e publicado!</span>
        case 'unpaid':
            return <span style={{ color: 'crimson', fontWeight: 500 }}>Anúncio não criado, falta de slots ou Package</span>
        case 'removed_by_user':
            return <span style={{ color: 'blue' }}>Anúncio removido por utilizador</span>
        case 'outdated_by_package':
            return <span style={{ color: 'crimson', fontWeight: 500 }}>Package expirado, será publicado automaticamente ao activar Imovirtual</span>
        default: /* moderated
        removed_by_moderator
        outdated */
            return <span style={{ color: 'blue' }}>Anuncio sofreu moderação ' + code + ': não está Público</span>
    }
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const Profile = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [authLink, setAuthLink] = useState(null);
    const [prof, setProf] = useState({ data: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { cookies } = props
        cookies.set('csrfState', csrfState, { path: '/' })

        axios.get("/imovirtual/oauth")
            .then(res => {
                setAuthLink(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        axios.get("/imovirtual/profile")
            .then(res => {
                setProf(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
        axios.get("/imovirtual/notifications")
            .then(res => {
                setNotifications(res.data.notifications)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    if (loading)
        return <Loading message="A carregar profile" />;
    return (
        <Layout
            mainTitle="Propriedades Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
            signedIn={props.signedIn}
        >
            <Head>
                <title>Profile Imovirtual</title>
            </Head>
            <Container maxWidth="lg" className="container">
                {/* <h2>Número total de notificações: {notifications.length}</h2> */}
                {authLink &&
                    <Button variant="contained" /* disabled={authLink.status}  */ color="primary" href={authLink.url + csrfState}>
                        {/* ///////////  MUDA DEPENDENDO DO STATUS DA CONECTION COM IMOVIRTUAL (ver se tem tokens?) */}
                        {/*  {authLink.status ? 'Imovirtual já autenticado' : 'Autenticar conta do Imovirtual'} */}
                        Autenticar conta do Imovirtual
                    </Button>
                }

                <h3>Verifica se já possuis a nossa app <a target="_blank" href="https://www.imovirtual.com/contapessoal/definicoes-de-conta/#aplicacoes">aqui</a>, se visualizar a app Relive, revoga e clica em "Autenticar conta do Imovirtual"</h3>


                <h1>Pacotes Imovirtual</h1>
                <TableContainer component={Paper}>
                    <Table className="tabela" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Pacote</StyledTableCell>
                                <StyledTableCell align="right">Disponiveis/Total</StyledTableCell>
                                <StyledTableCell align="right">Data compra</StyledTableCell>
                                <StyledTableCell align="right">Data Começo</StyledTableCell>
                                <StyledTableCell align="right">Data Proximo Pagamento</StyledTableCell>
                                <StyledTableCell align="right">Data Expiração</StyledTableCell>
                                <StyledTableCell align="right">Preço</StyledTableCell>
                                <StyledTableCell align="right">Estado</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prof.data.map((row, i) => (
                                <StyledTableRow key={i}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{row.available}/{row.total}</StyledTableCell>
                                    <StyledTableCell align="right">{moment(row.purchased_at).format('lll')}</StyledTableCell>
                                    <StyledTableCell align="right">{moment(row.starts_at).format('lll')}</StyledTableCell>
                                    <StyledTableCell align="right">{moment(row.invoice_at).format('lll')}</StyledTableCell>
                                    <StyledTableCell align="right">{moment(row.expires_at).format('lll')}</StyledTableCell>
                                    <StyledTableCell align="right">{row.price}</StyledTableCell>
                                    <StyledTableCell align="right">{row.in_grace_period ? 'Expirado' : 'Activo'}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <h1>Notificações</h1>
                <TableContainer component={Paper}>
                    <Table className="tabela" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Plataforma</StyledTableCell>
                                <StyledTableCell align="left">Flow</StyledTableCell>
                                <StyledTableCell align="left">Tipo</StyledTableCell>
                                <StyledTableCell align="left">Status</StyledTableCell>
                                <StyledTableCell align="left">Data Criação</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notifications.map((row, i) => (
                                <StyledTableRow key={i}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.provider}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.flow}</StyledTableCell>
                                    <StyledTableCell align="left">{row.event_type}</StyledTableCell>
                                    <StyledTableCell align="left">{row.data ? advertCode(row.data.code) : null}</StyledTableCell>
                                    <StyledTableCell align="left">{row.data ? moment(row.data.created_at).format('lll') : null}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Layout>
    );
};

export default withCookies(Profile);
