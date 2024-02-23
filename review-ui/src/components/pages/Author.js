import "../../style/TabStyle.css";
import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dashboard from './Dashboard';
import AuthorStats from './AuthorStats'

class Author extends Component {

    render() {
        return (

            <>
                <br />
                <Container fluid>
                    <Row>
                        <Tabs className="tabs">
                            <Tab title='Author Dashboard' eventKey='dashboard'>
                                <Dashboard
                                    chainId={this.props.chainId}
                                    account={this.props.account}
                                    bounties={this.props.authorBounties}
                                    PRContract={this.props.PRContract}
                                    type={'author'}
                                    web3={this.props.web3}
                                />
                            </Tab>
                            <Tab title='Statistics' eventKey='statistics'>
                                <AuthorStats authorBounties={this.props.authorBounties} />
                            </Tab>
                        </Tabs>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Author;