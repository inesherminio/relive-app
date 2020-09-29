import Link from "next/link"
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const Nav = (props) => (
    < AppBar position="static" >
        <Toolbar>
            <Link href="/">
                <img src="/static/logo.svg" alt="logo" height="50" className="logo" />
            </Link>
            {props.signedIn &&
                <Link href="/imoveis">
                    <a>Propriedades</a>
                </Link>
            }
            {props.signedIn &&
                <Link href="/profile">
                    <a>Profile</a>
                </Link>
            }
            {props.signedIn ?
                <Link href="/logout">
                    <a>Log Out</a>
                </Link>
                :
                <Link href="/login">
                    <a>Log In</a>
                </Link>

            }
            <style jsx>{`
            a,
            img {
                padding: 10px;
                color: #fff;
            }
        `}</style>
        </Toolbar>
    </AppBar >
);

export default Nav