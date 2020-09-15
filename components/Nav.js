import Link from "next/link"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const Nav = () => (
    <AppBar position="static">
        <Toolbar>
            <Link href="/">
                <img src="/static/logo.svg" alt="logo" height="50" className="logo" />
            </Link>
            <Link href="/imoveis">
                <a>Propriedades</a>
            </Link>
            <Link href="/login">
                <a>Log In</a>
            </Link>
            <Link href="/profile">
                <a>Profile</a>
            </Link>
            <style jsx>{`
            a,
            img {
                padding: 10px;
                color: #fff;
            }
        `}</style>
        </Toolbar>
    </AppBar>
);

export default Nav