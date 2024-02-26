import React from "react";
import Row from "react-bootstrap/Row";

class NoBounties extends React.Component {
    constructor(props) {
        super(props);
        this.generateContent = this.generateContent.bind(this);
    }

    generateContent() {
        if (this.props.type === "reviewer") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1>No Review Requests!</h1>
                        <h3> You have not received any request to review a manuscript. Once you are assinged a manuscript they will be displayed here.</h3>
                    </Row>
                </>
            );
        }

        else if (this.props.type === "editor") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1> No Manuscript Submissions!</h1>
                        <h3> You haven't received any manuscript for review. Once you receive a manuscript, they will be displayed here.</h3>
                    </Row>
                </>
            );
        }

        else if (this.props.type === "author") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1> No Manuscript Submissions!</h1>
                        <h3> You must click on the "Submit a Manuscript" button in the top right to submit a new manuscript. Once submitted, your authored articles will be displayed here.</h3>
                    </Row>
                </>
            );
        }
    }
    render() {
        return (
            <>{this.generateContent()}</>
        )
    }
}

export default NoBounties;