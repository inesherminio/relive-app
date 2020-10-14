import React, { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import axios from "axios"
import Head from "next/head"
import Container from '@material-ui/core/Container'
import Layout from "../../components/Layout"
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Error from "../_error";
import Loading from "../../components/Loading"

/* import { auth } from '../../utils/auth' */



const data2 = [
    {
        "date": "2019-02-15",
        "messages_count": 2,
        "page_views": 4,
        "phone_views": 2
    },
    {
        "date": "2019-02-14",
        "messages_count": 1,
        "page_views": 3,
        "phone_views": 1
    }
];




const Imovel = ({ params, signedIn }) => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [publish, setPublish] = useState(false);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState('');
    const [status, setStatus] = useState(null);

    const postImo = () => {
        setLoading(true)
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                axios.post(`/imovirtual/advert/${params.id}`, {
                    data: res.data
                })
                    .then(res => {
                        setLoading(false)
                        handleClose()
                    })
                    .catch(err => {
                        setLoading(false)
                        handleClose()
                        console.log(err)
                        setInfo('ERROR Posting in Imovirtual: ' + err.response.data.error)
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo('ERROR Getting Property Info: ' + err.response.data.error)
                handleClose()
                console.log(err)
            })
    }

    const validateImo = () => {
        setLoading(true)
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                axios.post(`/imovirtual/advert/validate`, {
                    data: res.data
                })
                    .then(res2 => {
                        setLoading(false)
                        setPublish(true)
                        setInfo(res2.data.message)
                    })
                    .catch(err => {
                        setLoading(false)
                        setPublish(false)
                        console.log(err)
                        setInfo('ERROR Validating Property')
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo('ERROR Getting Property')
                console.log(err)
            })

    }


    useEffect(() => {
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                if (res.data.imovirtual) {
                    axios.get(`/imovirtual/advert/${res.data.imovirtual}`)
                        .then(res2 => {
                            /* setLoading(false)
                               setData({ ...res.data, imovirtual: res2.data.data }) */
                            axios.get(`/imovirtual/advert/${res.data.imovirtual}/statistics`)
                                .then(res3 => {
                                    setLoading(false)
                                    setData({ ...res.data, imovirtual: res2.data.data, statistics: res3.data.data })
                                    setStatus(res.data.status)
                                })
                                .catch(err => {
                                    setLoading(false)
                                    setStatus(res.data.status)
                                    setData({ ...res.data, imovirtual: res2.data.data, statistics: null })
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            setData({ ...res.data, imovirtual: { state: { code: 'Error' } }, statistics: null })
                            setStatus(res.data.status)
                            setLoading(false)
                            console.log(err)
                        })
                } else {
                    setLoading(false)
                    setData(res.data)
                    setStatus(res.data.status)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, []);

    const handleClickOpen = (type) => {
        setOpen(type);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const activateAdvert = () => { /* DIZER QUE SÓ DEPOIS DO WEBHOOK É QUE SABEMOS SE DEU */
        axios.post(`/imovirtual/advert/${data.imovirtual.uuid}/activate`)
            .then(res => {
                console.log(res)
                setInfo('')
            })
            .catch(err => setInfo('Ocorreu algum erro'))
    }

    const deactivateAdvert = () => { /* DIZER QUE SÓ DEPOIS DO WEBHOOK É QUE SABEMOS SE DEU */
        axios.post(`/imovirtual/advert/${data.imovirtual.uuid}/deactivate`)
            .then(res => {
                console.log(res)
                setInfo('')
            })
            .catch(err => setInfo('Ocorreu algum erro'))
    }

    const handlePending = () => {
        const newStatus = "pending"// status === "draft" ? "pending" : "draft"
        axios.put(`/api/imoveis/${data.id}`, {
            ...data,
            status: newStatus
        })
            .then(res => {
                console.log(res)
                setInfo('')
                setStatus(newStatus)
            })
            .catch(err => setInfo('Ocorreu algum erro'))
    }

    const handlePublish = () => {
        axios.put(`/api/imoveis/${data.id}`, {
            ...data,
            status: "publish"
        })
            .then(res => {
                console.log(res)
                setInfo('Pedido de publicação enviado')
                setOpen(false);
            })
            .catch(err => setInfo('Ocorreu algum erro'))
    }

    const displayStatus = status === "draft" ? "Rascunho" : status === "pending" ? "Revisão Pendente" : "Publico"


    const isWebsitePending = status === "pending" || status === "draft"

    const ImoStatusCode = data.imovirtual && data.imovirtual.state ? data.imovirtual.state.code : 'Error'


    if (loading)
        return <Loading message="A carregar dados do imovel" />;


    return (
        <Layout
            mainTitle="Propriedades Relive"
            footer={`Relive Copyright ${new Date().getFullYear()} | All rights reserved`}
            signedIn={signedIn}
        >
            <Head>
            <title>Prop RE-{params.id}</title>
            </Head>
            <Container maxWidth="lg" className="container">
                {data.title ?
                    <>
                        <h2>{data.title.rendered}</h2>
                        <h3>Estado Website: <span style={{ color: displayStatus === 'Publico' ? '#82ca9d' : 'red' }}>{displayStatus}</span></h3>
                        <h3>Estado Imovirtual: <span style={{ color: data.imovirtual && ImoStatusCode === 'active' ? '#82ca9d' : 'red' }}>{data.imovirtual ? ImoStatusCode : 'Not published'}</span></h3>

                        {data.statistics &&
                            <>
                                <h5>Estatisticas Imovirtual</h5>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data2} /* data.statistics */
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" name="Data" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="messages_count" stroke="#632A57" name="Nº mensagens" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="page_views" name="Nº visualizações página" stroke="#EC837C" />
                                    <Line type="monotone" dataKey="phone_views" name="Nº visualizações telemovel" stroke="#82ca9d" />
                                </LineChart>
                            </>
                        }
                        <h2>Ações</h2>
                        <Grid container justify="flex-end" className="action-container">
                            {/* <Button variant="contained" color="secondary" onClick={() => handlePending()}>
                                {status === "pending" ? 'Guardar como "Rascunho"' : 'Guardar como "Revisão Pendente"'}
                            </Button> */}

                            <Button variant="contained" color={isWebsitePending ? "primary" : "secondary"} onClick={() => isWebsitePending ? handleClickOpen('wp') : handlePending()}>
                                {isWebsitePending ? "Publicar no Website" : "Guardar como 'Revisão Pendente'"}
                            </Button>
                            <Button variant="contained" color="primary" disabled={data.imovirtual && ImoStatusCode === 'Error'} onClick={() => validateImo()}>
                                Validar Imovirtual
                            </Button>
                            {/* PUBLICAR TEM DE SER TAMBÉM ACTUALIZAR */}
                            <Button variant="contained" color="primary" disabled={!publish || (data.imovirtual && (ImoStatusCode === 'active' || ImoStatusCode === 'Error'))} onClick={() => handleClickOpen('imo')}>
                                {"Publicar Imovirtual" + (publish ? '' : ' (Valida primeiro)')}
                            </Button>
                            <Button variant="contained" color="primary" disabled={(data.imovirtual && !ImoStatusCode) || !data.imovirtual} onClick={() => data.imovirtual && ImoStatusCode === 'active' ? deactivateAdvert() : activateAdvert()}>
                                {data.imovirtual && ImoStatusCode === 'active' ? 'Desativar Imovirtual' : 'Ativar Imovirtual'}
                            </Button>
                        </Grid>
                        <p style={{ color: 'red', fontWeight: 500, textAlign: 'center' }}>
                            {info}
                        </p>
                    </>
                    :
                    "Propriedade não encontrada ou problema de autenticação"
                }
            </Container>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Tens a certeza que queres publicar?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Se clicares "Sim", o imovel ficará publico no {open === 'wp' ? ' Website da Relive' : ' Imovirtual'}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Não
                    </Button>
                    <Button onClick={open === 'wp' ? handlePublish : postImo} color="primary">
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    )
};

/* Imovel.getInitialProps = async ({ query }) => {
    let data = []
    try {
        const res = await axios.get(`/wp/v2/imoveis/${query.id}?_embed)`)
        data = res.data;
    } catch (err) {
        console.log("ERROR", err.message);
    }
    return {
        data
    };
}; */

// This also gets called at build time
/* export async function getStaticProps(ctx) {
    const { params } = ctx
    const token = auth(ctx)
    let data = []
    try {
        const res = await axios.get(`/wp/v2/imoveis/${params.id}?_embed)`)
        data = res.data;
    } catch (err) {
        console.log("ERROR", err.message);
    }

    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    return { props: { data }, revalidate: 60 }
}

// This function gets called at build time
export async function getStaticPaths() {
    let paths = []

    try {
        axios.defaults.baseURL = 'https://relive.pt/wp-json'
        await axios.post('/jwt-auth/v1/token', { username: 'sergioferras97', password: process.env.PASS })
            .then(res => {
                axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
            })
            .catch(e => console.log("WTF", e))
        const res = await axios.get('/wp/v2/imoveis?_embed&per_page=100&status=pending,publish,draft')
        paths = res.data.map((post) => ({
            params: { id: post.id.toString() },
        }))
    } catch (err) {
        console.log("ERROR", err.message);
    }
    return {
        paths,
        fallback: false
    }
} */

export async function getServerSideProps(ctx) {
    const { params } = ctx
    /* const token = auth(ctx)
    const { params } = ctx
    let data = []
    try {
        const res = await axios.get(`/wp/v2/imoveis/${params.id}?_embed)`)
        data = res.data;
    } catch (err) {
        console.log("ERROR", err.message);
    }
 */
    return { props: { params } }
}



export default Imovel;