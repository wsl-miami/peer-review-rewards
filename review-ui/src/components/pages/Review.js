import "../../style/TabStyle.css";
import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Dashboard from "./Dashboard";
class Review extends Component {

    render() {
        return (
            <>
                <br />
                <Container fluid>
                    <Row>
                        <h2>Reviewer Dashboard</h2>
                                <Dashboard
                                    chainId={this.props.chainId}
                                    account={this.props.account}
                                    bounties={this.props.reviewerBounties}
                                    PRContract={this.props.PRContract}
                                    type={"reviewer"}
                                    profile={this.props.profile}
                                    web3={this.props.web3}
                                />
                    </Row>
                </Container>
            </>
        );
    }
}

export default Review;