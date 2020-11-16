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
/* import Error from "../_error"; */
import Loading from "../../components/Loading"

/* import { auth } from '../../utils/auth' */



/* const data2 = [
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
]; */


/* STATUS CODES OF ADVERTS:

| pending         after POST
| pending_update  after PUT
| pending_activate           // SE CONTER pending BLOQUEAR ALL ACTIONS
| pending_deactivate
| pending_delete  after DELETE



| active // can PUT DELETE DEACTIVATE

| unpaid // can only POST (I think, this happens if we try to create when imovirtual is not paid)

| removed_by_user // can POST or ACTIVATE (depending on the last operation)


| outdated_by_package // Can PUT and DELETE


| moderated //
| removed_by_moderator     // No operations allowed in these 3 states
| outdated // 

any error (could be empty)   // Depends on error, could be POST if error on creating

*/


/* 


    imovel-tipo: 95, 47, 49, 129, 154 Apartamento| 34 Moradia| 71, 87, 91 Comercial

    imovel-estado: 78 Venda | 77 Arrendamento | 174 Arrendado | 175 Vendido


*/

const isAvailable = (imoStatus, action, ImoPrevious = null) => { /* action can be post, put, delete, activate, deactivate */

    /* User deleted */
    if (imoStatus === 'removed_by_user' && ImoPrevious === 'pending_delete')
        return action === 'post'

    /* User deactivated */
    if (imoStatus === 'removed_by_user' && ImoPrevious === 'pending_deactivate')
        return action === 'activate'

    if (!imoStatus && action === 'post') /* Property is not on Imovirtual */
        return true
    switch (imoStatus) {
        case 'active':
            return !(action === 'post' || action === 'activate')
        case 'unpaid':
            return action === 'post'
        case 'removed_by_user':
            return action === 'post' || action === 'activate'
        case 'outdated_by_package':
            return action === 'put' || action === 'delete'
        default: /* moderated, removed_by_moderator, outdated, all pendings, any other error */
            return false
    }

}

const preSendData = (data) => {

    const { content, id, link, property_meta, status, title, type, ideCode } = data

    const { REAL_HOMES_property_images } = property_meta

    const property_images = REAL_HOMES_property_images.map(img => { return { full_url: img.full_url } })


    /* Remove HTML from content */
    const contentNoHTML = document.createElement("DIV");
    contentNoHTML.innerHTML = content.rendered

    /*     function stripHtml(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        } */

    return {
        id,
        link,
        status,
        ideCode,
        type,
        title,
        content: { rendered: contentNoHTML.textContent || contentNoHTML.innerText || "" },
        "imovel-caracteristicas": data["imovel-caracteristicas"],
        "imovel-estado": data["imovel-estado"],
        "imovel-tipo": data["imovel-tipo"],
        "localizacao-imovel": data["localizacao-imovel"],
        property_meta: {
            ...property_meta,
            REAL_HOMES_property_images: property_images
        }
    }
}


const Imovel = ({ params, signedIn }) => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [publish, setPublish] = useState(false);
    const [loading, setLoading] = useState("A carregar dados do imovel");
    const [info, setInfo] = useState({
        error: true,
        msg: null
    });
    const [status, setStatus] = useState(null);
    const [statusImo, setStatusImo] = useState(null);
    const [statusImoPrevious, setStatusImoPrevious] = useState(null);

    const postImo = () => {
        setLoading("A enviar pedido de publicação a Imovirtual")
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                const sendData = preSendData(res.data)
                axios.post(`/imovirtual/advert/${params.id}`, {
                    data: sendData
                })
                    .then(res => {
                        setLoading(false)
                        setPublish(false)
                        setStatusImo('Publicação pendente')
                        setInfo({
                            error: false,
                            msg: 'Pedido enviado com sucesso'
                        })
                        handleClose()
                    })
                    .catch(err => {
                        setLoading(false)
                        handleClose()
                        console.log(err)
                        setInfo({
                            error: true,
                            msg: 'ERROR Posting in Imovirtual: ' + err.response.data.error
                        })
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo({
                    error: true,
                    msg: 'ERROR Getting Property Info: ' + err.response.data.error
                })
                handleClose()
                console.log(err)
            })
    }

    const putImo = () => {
        setLoading("A enviar pedido de atualização a Imovirtual")
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                const sendData = preSendData(res.data)
                axios.put(`/imovirtual/advert/${data.imovirtual.uuid}`, {
                    data: sendData
                })
                    .then(res => {
                        setLoading(false)
                        setPublish(false)
                        setStatusImo('Atualização pendente')
                        setInfo({
                            error: false,
                            msg: 'Pedido enviado com sucesso'
                        })
                        handleClose()
                    })
                    .catch(err => {
                        setLoading(false)
                        handleClose()
                        console.log(err)
                        setInfo({
                            error: true,
                            msg: 'ERROR Putting in Imovirtual: ' + err.response.data.error
                        })
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo({
                    error: true,
                    msg: 'ERROR Getting Property Info: ' + err.response.data.error
                })
                handleClose()
                console.log(err)
            })
    }

    const deleteImo = () => {
        setLoading("A enviar pedido de eliminação a Imovirtual")
        axios.delete(`/imovirtual/advert/${data.imovirtual.uuid}`)
            .then(res => {
                console.log(res)
                setStatusImo('Eliminação pendente')
                setLoading(false)
                handleClose()
                setInfo({
                    error: false,
                    msg: 'Pedido de eliminação enviado'
                })
            })
            .catch(err => {
                setLoading(false)
                handleClose()
                setInfo({
                    error: true,
                    msg: 'Ocorreu algum erro'
                })
            })
    }

    const validateImo = () => {
        setLoading("A enviar pedido de validação a Imovirtual")
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                const sendData = preSendData(res.data)
                axios.post(`/imovirtual/advert/validate`, {
                    data: sendData
                })
                    .then(res2 => {
                        setLoading(false)
                        setPublish(true)
                        setInfo({
                            error: true,
                            msg: res2.data.message || 'Validado com sucesso!'
                        })
                    })
                    .catch(err => {
                        setLoading(false)
                        setPublish(false)
                        console.log(err)
                        setInfo({
                            error: true,
                            msg: 'ERROR Validating Property: ' + err.response.data.error
                        })
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo({
                    error: true,
                    msg: 'ERROR Getting Property'
                })
                console.log(err)
            })

    }

    const activateAdvert = () => {
        axios.post(`/imovirtual/advert/${data.imovirtual.uuid}/activate`)
            .then(res => {
                console.log(res)
                setStatusImo('Ativação pendente')
                setInfo({
                    error: false,
                    msg: 'Pedido de ativação enviado'
                })
            })
            .catch(err => setInfo({
                error: true,
                msg: 'Ocorreu algum erro'
            }))
    }

    const deactivateAdvert = () => {
        axios.post(`/imovirtual/advert/${data.imovirtual.uuid}/deactivate`)
            .then(res => {
                console.log(res)
                setStatusImo('Desativação pendente')
                setInfo({
                    error: false,
                    msg: 'Pedido de desativação enviado'
                })
            })
            .catch(err => setInfo({
                error: true,
                msg: 'Ocorreu algum erro'
            }))
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
                                    setStatusImo(res2.data.imoCode) /* data.state.code */
                                    setStatusImoPrevious(res2.data.prevImoCode)
                                    setStatus(res.data.status)
                                })
                                .catch(err => {
                                    setLoading(false)
                                    setStatus(res.data.status)
                                    setStatusImo(res2.data.imoCode) /* data.state.code */
                                    setStatusImoPrevious(res2.data.prevImoCode)
                                    setData({ ...res.data, imovirtual: res2.data.data, statistics: null })
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            setData({ ...res.data, statistics: null })
                            setStatus(res.data.status)
                            if (err.response && err.response.status === 403) {
                                setStatusImo('Error Authentication')
                                setInfo({
                                    error: true,
                                    msg: 'Erro Autenticação Imovirtual. Para voltar a activar a app vai ao menu "Profile".'
                                })
                            } else
                                setStatusImo('Error')
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


    const handlePending = () => {
        const newStatus = "pending"// status === "draft" ? "pending" : "draft"
        axios.put(`/api/imoveis/${data.id}`, {
            ...data,
            status: newStatus
        })
            .then(res => {
                console.log(res)
                setInfo({
                    error: false,
                    msg: ''
                })
                setStatus(newStatus)
            })
            .catch(err => setInfo({
                error: true,
                msg: 'Ocorreu algum erro'
            }))
    }

    const handlePublish = () => {
        axios.put(`/api/imoveis/${data.id}`, {
            ...data,
            status: "publish"
        })
            .then(res => {
                console.log(res)
                setInfo({
                    error: false,
                    msg: 'Pedido de publicação enviado'
                })
                setOpen(false);
            })
            .catch(err => setInfo({
                error: true,
                msg: 'Ocorreu algum erro'
            }))
    }

    const deleteAdvert = () => {
        setOpen('delete');
    }

    const handleIdealistaValidate = () => { /* Igual ao do Imovirtual, só muda o link e erroor message */
        setLoading("A enviar pedido de validação Idealista")
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                const sendData = preSendData(res.data)
                axios.post(`/idealista/advert/validate`, {
                    data: sendData
                })
                    .then(res2 => {
                        setLoading(false)
                        setPublish(true)
                        setInfo({
                            error: true,
                            msg: res2.data.message || 'Idealista validado com sucesso!'
                        })
                    })
                    .catch(err => {
                        setLoading(false)
                        setPublish(false)
                        console.log(err)
                        setInfo({
                            error: true,
                            msg: 'Idealista ERROR Validating Property: ' + err.response.data.error
                        })
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo({
                    error: true,
                    msg: 'Idealista ERROR Getting Property'
                })
                console.log(err)
            })
    }

    const handleIdealistaPost = () => { /* Igual ao do Imovirtual, só muda o link e erroor message */
        setLoading("A enviar pedido de publicação Idealista")
        axios.get(`/api/imoveis/${params.id}`)
            .then(res => {
                const sendData = preSendData(res.data)
                axios.post(`/idealista/advert/${params.id}`, {
                    data: sendData
                })
                    .then(res => {
                        setLoading(false)
                        setPublish(false)
                        setStatusImo('Publicação pendente')
                        setInfo({
                            error: false,
                            msg: 'Pedido enviado com sucesso'
                        })
                        handleClose()
                    })
                    .catch(err => {
                        setLoading(false)
                        handleClose()
                        console.log(err)
                        setInfo({
                            error: true,
                            msg: 'Idealista ERROR Posting in Imovirtual: ' + err.response.data.error
                        })
                    })
            })
            .catch(err => {
                setLoading(false)
                setInfo({
                    error: true,
                    msg: 'Idealista ERROR Getting Property Info: ' + err.response.data.error
                })
                handleClose()
                console.log(err)
            })
    }

    const handleIdealistaDelete = () => {
        setLoading("A enviar pedido de eliminação Idealista")
        axios.delete(`/idealista/delete/${params.id}`)
            .then(res => {
                setLoading(false)
                setPublish(false)
                setInfo({
                    error: false,
                    msg: 'Pedido de eliminação Idealista enviado com sucesso'
                })
                handleClose()
            })
            .catch(err => {
                setLoading(false)
                handleClose()
                console.log(err)
                setInfo({
                    error: true,
                    msg: 'Idealista ERROR delete in Idealista: ' + err.response.data.error
                })
            })

    }

    const displayStatus = status === "draft" ? "Rascunho" : status === "pending" ? "Revisão Pendente" : "Publico"

    const isWebsitePending = status === "pending" || status === "draft"

    const ImoStatusCode = statusImo || 'Not published'
    const isImoPending = ImoStatusCode.includes('pending') || ImoStatusCode.includes('pendente') ? true : false

    const objectiveStatus = data && data['imovel-estado'] && data['imovel-estado'].length ? data['imovel-estado'][0] === 77 ? 'A arrendar' : data['imovel-estado'][0] === 78 ? 'A vender' : data['imovel-estado'][0] === 174 ? 'Arrendado' : data['imovel-estado'][0] === 175 ? 'Vendido' : null : null
    const type =
        data && data['imovel-tipo'] && data['imovel-tipo'].length ?
            data['imovel-tipo'][0] === 34 ?
                'Moradia' : data['imovel-tipo'].includes(91) ?
                    'Loja' : data['imovel-tipo'].includes(87) ?
                        'Escritorio' : data['imovel-tipo'][0] === 194 ?
                            'Terreno' : 'Apartamento' : null

    /* console.log('Previous Imo', statusImoPrevious) */

    if (loading)
        return <Loading message={loading} />;

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
                        <Grid container justify="flex-start">
                            <Grid item xs={4}>
                                <h3>Estado Website: <span style={{ color: displayStatus === 'Publico' ? '#82ca9d' : 'red' }}>{displayStatus}</span></h3>
                            </Grid>
                            <Grid item xs={3}>
                                <h3>Tipo: <span style={{ color: '#82ca9d' }}>{type}</span></h3>
                            </Grid>
                            <Grid item xs={3}>
                                <h3>Objectivo: <span style={{ color: '#82ca9d' }}>{objectiveStatus}</span></h3>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" target="_blank" href={data.link}>Ver página</Button>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={4}>
                                <h3>Estado Idealista: <span style={{ color: data.idealista ? '#82ca9d' : 'red' }}>{data.idealista ? 'Ativo' : 'Desativo'}</span></h3>
                            </Grid>
                            {data.idealista &&
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" target="_blank" href={`https://www.idealista.pt/${data.idealista}`}>Ver página</Button>
                                </Grid>
                            }
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={4}>
                                <h3>Estado Imovirtual: <span style={{ color: ImoStatusCode === 'active' ? '#82ca9d' : 'red' }}>{ImoStatusCode === 'removed_by_user' ? statusImoPrevious === 'pending_deactivate' ? 'Desativado' : statusImoPrevious === 'pending_delete' ? 'Eliminado' : ImoStatusCode : ImoStatusCode}</span></h3>
                            </Grid>
                            {data.imovirtual && data.imovirtual.state &&
                                <Grid item xs={3}>
                                    <Button variant="contained" color="primary" target="_blank" href={data.imovirtual.state.url}>Ver página</Button>
                                </Grid>
                            }
                        </Grid>

                        {data.statistics &&
                            <>
                                <h5>Estatisticas Imovirtual</h5>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data.statistics}
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
                        <h2>Editar Website</h2>
                        <Grid container justify="flex-end" className="action-container">
                            {/* <Button variant="contained" color="secondary" onClick={() => handlePending()}>
                                {status === "pending" ? 'Guardar como "Rascunho"' : 'Guardar como "Revisão Pendente"'}
                            </Button> */}
                            <Button variant="contained" color={isWebsitePending ? "primary" : "secondary"} onClick={() => isWebsitePending ? handleClickOpen('wp') : handlePending()}>
                                {isWebsitePending ? "Publicar no Website" : "Guardar como 'Revisão Pendente'"}
                            </Button>
                        </Grid>
                        <h2>Editar Imovirtual</h2>
                        <Grid container justify="flex-end" className="action-container">
                            <Button variant="contained" color="primary" disabled={statusImo === 'Error Authentication'} onClick={() => validateImo()}>
                                Validar Imovirtual
                            </Button>
                            {isAvailable(statusImo, 'put') ?
                                <Button variant="contained" color="primary" disabled={!publish || !isAvailable(statusImo, 'put')} /* disabled={isImoPending || !publish || (statusImo && (ImoStatusCode !== 'active'))} */ onClick={() => handleClickOpen('imoPut')}>
                                    {"Atualizar Imovirtual" + (publish ? '' : ' (Valida primeiro)')}
                                </Button>
                                :
                                <Button variant="contained" color="primary" disabled={!publish || !isAvailable(statusImo, 'post', statusImoPrevious)} /* disabled={isImoPending || !publish || (statusImo && (ImoStatusCode === 'active'))} */ onClick={() => handleClickOpen('imo')}>
                                    {"Publicar Imovirtual" + (publish ? '' : ' (Valida primeiro)')}
                                </Button>
                            }
                            <Button variant="contained" color="primary" disabled={ImoStatusCode === 'active' ? !isAvailable(statusImo, 'deactivate') : !isAvailable(statusImo, 'activate', statusImoPrevious)} /* disabled={isImoPending || (statusImo && !ImoStatusCode) || !statusImo || ImoStatusCode === 'Error'} */ onClick={() => ImoStatusCode === 'active' ? deactivateAdvert() : activateAdvert()}>
                                {ImoStatusCode === 'active' ? 'Desativar Imovirtual' : 'Ativar Imovirtual'}
                            </Button>
                            <Button variant="contained" color="primary" disabled={!isAvailable(statusImo, 'delete')} onClick={() => deleteAdvert()}>
                                Eliminar do Imovirtual
                            </Button>
                        </Grid>
                        <p style={{ color: info.error ? 'red' : 'green', fontWeight: 500, textAlign: 'center' }}>
                            {info.msg}
                        </p>
                        <h2>Editar Idealista</h2>
                        <Grid container justify="flex-end" className="action-container">
                            <Button variant="contained" color="primary" disabled={false} onClick={() => handleIdealistaValidate()}>
                                Validar Idealista
                            </Button>
                            <Button variant="contained" color="primary" disabled={false} onClick={() => handleIdealistaPost()}>
                                {data.idealista ? "Actualizar Idealista" : "Publicar Idealista"}
                            </Button>
                            <Button variant="contained" color="primary" disabled={!data.idealista} onClick={() => handleIdealistaDelete()}>
                                Eliminar do Idealista
                            </Button>
                        </Grid>
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
                <DialogTitle id="alert-dialog-slide-title">Tens a certeza que queres {open === 'delete' ? ' eliminar' : open === 'imoPut' ? ' atualizar' : ' publicar'}?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Se clicares "Sim", o imovel ficará {open === 'delete' ? ' eliminado' : ' público'} no {open === 'wp' ? ' Website da Relive' : open === 'imoPut' ? ' Imovirtual e com informação atualizada do website' : ' Imovirtual'}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Não
                    </Button>
                    <Button onClick={open === 'wp' ? handlePublish : open === 'imoPut' ? putImo : open === 'delete' ? deleteImo : postImo} color="primary">
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    )
};

/* Imovel.getInitialProps = async ({query}) => {
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
    const {params} = ctx
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
    return {props: {data}, revalidate: 60 }
        }
        
        // This function gets called at build time
export async function getStaticPaths() {
                let paths = []
        
    try {
                axios.defaults.baseURL = 'https://relive.pt/wp-json'
        await axios.post('/jwt-auth/v1/token', {username: 'sergioferras97', password: process.env.PASS })
            .then(res => {
                axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
            })
            .catch(e => console.log("WTF", e))
        const res = await axios.get('/wp/v2/imoveis?_embed&per_page=100&status=pending,publish,draft')
        paths = res.data.map((post) => ({
                params: {id: post.id.toString() },
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
const {params} = ctx
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