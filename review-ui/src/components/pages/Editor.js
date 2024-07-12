import "../../style/TabStyle.css";
import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Dashboard from "./Dashboard";
class Editor extends Component {

    render() {
        return (
            <>
                <br />
                <Container fluid>
                    <Row>
                        <h2>Editor Dashboard</h2>
                                <Dashboard
                                    chainId={this.props.chainId}
                                    account={this.props.account}
                                    bounties={this.props.editorBounties}
                                    PRContract={this.props.PRContract}
                                    SoulBoundContract={this.props.SoulBoundContract}
                                    type={'editor'}
                                    web3={this.props.web3}

                                />
                    </Row>
                </Container>
            </>
        );
    }
}

export default Editor;