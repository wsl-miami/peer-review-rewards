import "../../style/TabStyle.css";
import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dashboard from "./Dashboard";
import EditorStats from './EditorStats'
class Editor extends Component {

    render() {
        return (
            <>
                <br />
                <Container fluid>
                    <Row>
                        <Tabs className="tabs">
                            <Tab title='Editor Dashboard' eventKey='dashboard'>
                                <Dashboard
                                    chainId={this.props.chainId}
                                    account={this.props.account}
                                    bounties={this.props.editorBounties}
                                    PRContract={this.props.PRContract}
                                    SoulBoundContract={this.props.SoulBoundContract}
                                    type={'editor'}
                                    web3={this.props.web3}

                                />
                            </Tab>
                            <Tab title='Statistics' eventKey='statistics'>
                                <EditorStats editorBounties={this.props.editorBounties} />
                            </Tab>
                        </Tabs>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Editor;