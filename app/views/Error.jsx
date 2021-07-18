const React = require("react");
const Layout = require('../views/shared/Layout')


const ErrorPage = () => {
    return (
        <Layout>
            <div className="container">
                <h1>Error: Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </Layout>
    );
};


exports.ErrorPage = ErrorPage;