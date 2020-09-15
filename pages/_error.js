import Layout from "../components/Layout";

const Error = ({ message }) => (
    <Layout mainTitle="Error">
        <div style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 500, color: 'crimson' }}>
            <p>Error: {message}</p>
        </div>
    </Layout>
);

export default Error;
